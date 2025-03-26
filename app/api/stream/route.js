export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Khởi tạo Wasabi client
const s3Client = new S3Client({
  region: process.env.WASABI_REGION || "ap-southeast-1", // Singapore region
  endpoint:
    process.env.WASABI_ENDPOINT || "https://s3.ap-southeast-1.wasabisys.com",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.WASABI_BUCKET_NAME || "hocmai";

// Kiểm tra xem file có tồn tại trong Wasabi không
async function checkFileExists(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

// Kiểm tra xem file có phải video không
function isVideoFile(key) {
  return key.match(/\.(mp4|webm|mov|ogg|avi|mkv)$/i) !== null;
}

// Kiểm tra xem file có phải PDF không
function isPDFFile(key) {
  return key.match(/\.(pdf)$/i) !== null;
}

// Kiểm tra xem file có phải file được hỗ trợ không
function isSupportedFile(key) {
  return isVideoFile(key) || isPDFFile(key);
}

/**
 * API để lấy signed URL cho video hoặc PDF từ Wasabi
 * Method: GET
 * Query params:
 *   - key: Key của file trong Wasabi (bắt buộc)
 *   - expires: Thời gian hết hạn của URL tính bằng giây (mặc định 6 giờ)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const expires = parseInt(searchParams.get("expires") || "21600"); // Mặc định 6 giờ

    // Validate input
    if (!key) {
      return NextResponse.json(
        {
          error: "Thiếu key của file",
        },
        { status: 400 }
      );
    }

    // Kiểm tra file tồn tại không
    const fileExists = await checkFileExists(key);
    if (!fileExists) {
      return NextResponse.json(
        {
          error: "File không tồn tại trên Wasabi",
        },
        { status: 404 }
      );
    }

    // Kiểm tra file có được hỗ trợ không (video hoặc PDF)
    if (!isSupportedFile(key)) {
      return NextResponse.json(
        {
          error: "File không phải định dạng được hỗ trợ",
        },
        { status: 400 }
      );
    }

    // Tạo signed URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });

    // Trả về signed URL
    return NextResponse.json(
      {
        success: true,
        streamUrl: signedUrl,
        expires: Date.now() + expires * 1000,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300", // Cache 5 phút
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi tạo signed URL:", error);
    return NextResponse.json(
      {
        error: "Không thể tạo URL cho file",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
