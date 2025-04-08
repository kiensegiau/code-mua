import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";

// Khởi tạo Firebase Admin SDK nếu chưa được khởi tạo
if (!getApps().length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK đã được khởi tạo thành công trong API");
  } catch (error) {
    console.error("❌ Lỗi khởi tạo Firebase Admin SDK trong API:", error);
  }
}

export async function GET(request) {
  // Lấy UID từ URL hoặc search params
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json(
      { error: 'Thiếu tham số UID', exists: false },
      { status: 400 }
    );
  }

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const userRecord = await getAuth().getUser(uid);
    
    // Nếu tài khoản bị vô hiệu hóa, coi như không tồn tại
    if (userRecord.disabled) {
      return NextResponse.json(
        { exists: false, message: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { exists: true, email: userRecord.email },
      { status: 200 }
    );
  } catch (error) {
    // Nếu là lỗi không tìm thấy người dùng
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { exists: false, message: 'Không tìm thấy người dùng' },
        { status: 200 }
      );
    }
    
    // Lỗi khác
    console.error('Lỗi kiểm tra người dùng:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi khi kiểm tra người dùng', 
        message: error.message,
        exists: false 
      },
      { status: 500 }
    );
  }
} 