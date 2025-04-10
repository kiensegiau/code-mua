import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '../../../_utils/firebaseAdmin';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    // Lấy token từ cookie
    const token = cookieStore.get('firebaseToken')?.value;
    
    // Log quá trình xác thực
    console.log('🍪 API verify-token - Kiểm tra cookie:', !!token);
    
    if (!token) {
      console.log('❌ API verify-token - Không tìm thấy token');
      return NextResponse.json({ 
        valid: false, 
        message: 'Không tìm thấy token' 
      }, { status: 401 });
    }
    
    try {
      // Xác thực token bằng firebase-admin
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('✅ API verify-token - Token hợp lệ, UID:', decodedToken.uid);
      
      // Trả về thông tin từ token đã giải mã
      return NextResponse.json({
        valid: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'user',
        expiresAt: new Date(decodedToken.exp * 1000).toISOString()
      });
    } catch (error) {
      console.error('❌ API verify-token - Lỗi xác thực:', error.message);
      return NextResponse.json({ 
        valid: false, 
        message: 'Token không hợp lệ', 
        error: error.message 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('❌ API verify-token - Lỗi server:', error.message);
    return NextResponse.json({ 
      valid: false, 
      message: 'Lỗi server', 
      error: error.message 
    }, { status: 500 });
  }
} 