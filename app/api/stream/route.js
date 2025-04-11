export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

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

// Cache cho thông tin người dùng và quyền truy cập
const userAccessCache = new Map();

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

// Kiểm tra quyền truy cập của người dùng
async function checkUserAccess(userId, courseId) {
  try {
    if (!userId || !courseId) {
      return false;
    }
    
    // Kết nối đến database
    await connectToDatabase();
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    
    // Lấy thông tin user
    const user = await usersCollection.findOne({ uid: userId });
    
    // Kiểm tra người dùng VIP
    if (user && user.isVip === true) {
      const currentDate = new Date();
      // Kiểm tra nếu người dùng đang VIP và VIP chưa hết hạn
      if (user.vipExpiresAt && new Date(user.vipExpiresAt) > currentDate) {
        return true;
      }
    }
    
    // Thử chuyển đổi courseId thành ObjectId nếu có thể
    let courseObjectId;
    try {
      courseObjectId = new mongoose.Types.ObjectId(courseId);
    } catch (error) {
      courseObjectId = courseId;
    }
    
    // Kiểm tra trong collection enrollments
    const enrollment = await enrollmentsCollection.findOne({
      userId: userId,
      courseId: courseObjectId, 
      status: 'active'
    });
    
    if (enrollment) {
      return true;
    }
    
    // Kiểm tra trong user.enrolledCourses (cách cũ)
    if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
      // Tìm kiếm courseId trong danh sách khóa học đã đăng ký
      const enrolledCourse = user.enrolledCourses.find(course => {
        if (typeof course === 'string') {
          return course === courseId;
        } else if (course.courseId) {
          return course.courseId.toString() === courseId;
        } else if (course._id) {
          return course._id.toString() === courseId;
        }
        return false;
      });
      
      if (enrolledCourse) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền truy cập:", error);
    return false;
  }
}

/**
 * API để lấy signed URL cho video hoặc PDF từ Wasabi
 * Method: GET
 * Query params:
 *   - key: Key của file trong Wasabi (bắt buộc)
 *   - expires: Thời gian hết hạn của URL tính bằng giây (mặc định 6 giờ)
 *   - userId: ID của người dùng (bắt buộc)
 *   - courseId: ID của khóa học (bắt buộc)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!key || !userId || !courseId) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin cần thiết" },
        { status: 400 }
      );
    }

    // Tạo cacheKey từ thông tin người dùng và khóa học
    const cacheKey = `${userId}-${courseId}`;
    
    // Kiểm tra quyền truy cập từ cache trước
    const cachedAccess = userAccessCache.get(cacheKey);
    let hasAccess = false;
    
    if (cachedAccess) {
      // Kiểm tra xem thông tin cache có còn hạn không (còn ít nhất 5 phút)
      if (cachedAccess.expires > Date.now()) {
        hasAccess = cachedAccess.hasAccess;
      } else {
        // Xóa cache đã hết hạn
        userAccessCache.delete(cacheKey);
      }
    }
    
    // Nếu không có trong cache hoặc cache đã hết hạn, kiểm tra quyền truy cập từ database
    if (!cachedAccess) {
      hasAccess = await checkUserAccess(userId, courseId);
      
      // Nếu không có quyền truy cập, lấy thông tin người dùng để lưu vào cache
      if (!hasAccess) {
        // Kết nối database và lấy thông tin người dùng
        await connectToDatabase();
        const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
        const usersCollection = hocmaiDb.collection('users');
        const user = await usersCollection.findOne({ uid: userId });
        
        // Lưu kết quả vào cache (hết hạn sau 30 phút)
        userAccessCache.set(cacheKey, {
          hasAccess: false,
          expires: Date.now() + 30 * 60 * 1000,
          userData: user ? {
            isVip: user.isVip || false,
            vipExpiresAt: user.vipExpiresAt ? new Date(user.vipExpiresAt).getTime() : null
          } : null
        });
      } else {
        // Lưu kết quả vào cache (hết hạn sau 30 phút)
        userAccessCache.set(cacheKey, {
          hasAccess: true,
          expires: Date.now() + 30 * 60 * 1000
        });
      }
    }
    
    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn chưa đăng ký khóa học này hoặc không có quyền truy cập",
        },
        { status: 403 }
      );
    }

    // Kiểm tra file tồn tại không
    const fileExists = await checkFileExists(key);
    if (!fileExists) {
      return NextResponse.json(
        {
          success: false,
          error: "File không tồn tại trên Wasabi",
        },
        { status: 404 }
      );
    }

    // Kiểm tra file có được hỗ trợ không (video hoặc PDF)
    if (!isSupportedFile(key)) {
      return NextResponse.json(
        {
          success: false,
          error: "File không phải định dạng được hỗ trợ",
        },
        { status: 400 }
      );
    }

    // Tạo signed URL
    const expires = 6 * 60 * 60; // 6 giờ
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });

    // Tính toán thời gian hết hạn (6 giờ)
    const expiresAt = Date.now() + expires * 1000;

    return NextResponse.json({
      success: true,
      streamUrl: signedUrl,
      expires: expiresAt,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu stream:", error);
    
    return NextResponse.json(
      { success: false, error: "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
