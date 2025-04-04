import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const requestId = `auth_sign_out_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`🔒 [${requestId}] POST /api/auth/sign-out - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Lấy cookie handler
    const cookieStore = cookies();
    
    // Xóa cookie
    cookieStore.delete('session');
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    
    console.log(`✅ [${requestId}] Đăng xuất thành công [${new Date().toISOString()}]`);
    
    return NextResponse.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi đăng xuất: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể đăng xuất', message: error.message },
      { status: 500 }
    );
  }
} 