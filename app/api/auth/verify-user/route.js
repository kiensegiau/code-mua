import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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
    console.log("✅ Firebase Admin SDK đã được khởi tạo thành công trong API (App Router)");
  } catch (error) {
    console.error("❌ Lỗi khởi tạo Firebase Admin SDK trong API:", error);
  }
}

export async function GET(request) {
  const requestId = `auth_verify_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`🔍 [${requestId}] GET /api/auth/verify-user - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Lấy URL và params
    const url = new URL(request.url);
    const uid = url.searchParams.get('uid');
    
    if (!uid) {
      console.log(`❌ [${requestId}] Thiếu tham số UID [${new Date().toISOString()}]`);
      return NextResponse.json(
        { error: 'Thiếu tham số UID', exists: false },
        { status: 400 }
      );
    }
    
    console.log(`👤 [${requestId}] Đang kiểm tra người dùng với UID: ${uid} [${new Date().toISOString()}]`);
    
    // Kiểm tra xem người dùng có tồn tại không
    const userRecord = await getAuth().getUser(uid);
    
    // Nếu tài khoản bị vô hiệu hóa, coi như không tồn tại
    if (userRecord.disabled) {
      console.log(`⚠️ [${requestId}] Tài khoản đã bị vô hiệu hóa [${new Date().toISOString()}]`);
      return NextResponse.json(
        { exists: false, message: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 200 }
      );
    }
    
    console.log(`✅ [${requestId}] Người dùng tồn tại: ${userRecord.email} [${new Date().toISOString()}]`);
    return NextResponse.json({ exists: true, email: userRecord.email });
  } catch (error) {
    // Nếu là lỗi không tìm thấy người dùng
    if (error.code === 'auth/user-not-found') {
      console.log(`🔍 [${requestId}] Không tìm thấy người dùng [${new Date().toISOString()}]`);
      return NextResponse.json(
        { exists: false, message: 'Không tìm thấy người dùng' },
        { status: 200 }
      );
    }
    
    // Lỗi khác
    console.error(`❌ [${requestId}] Lỗi kiểm tra người dùng: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
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