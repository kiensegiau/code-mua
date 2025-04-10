import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    
    // Xóa cookie Firebase token
    cookieStore.delete('firebaseToken');
    
    // Xóa các cookie khác liên quan đến xác thực nếu còn
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userToken');
    cookieStore.delete('userRole');
    cookieStore.delete('userId');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Đăng xuất thành công' 
    });
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Đã xảy ra lỗi khi đăng xuất',
        error: error.message
      },
      { status: 500 }
    );
  }
} 