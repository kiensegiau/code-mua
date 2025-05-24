import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Middleware để kiểm tra xác thực admin
export async function adminAuthMiddleware(request) {
  try {
    // Kiểm tra cookie admin_access
    const cookieStore = cookies();
    const adminAccess = cookieStore.get('admin_access');
    
    if (adminAccess && adminAccess.value === 'true') {
      // Đã xác thực qua cookie
      return request;
    }
    
    // Kiểm tra header Authorization
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Không có token xác thực'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Kiểm tra token admin đơn giản
    // Trong môi trường thực tế, bạn nên sử dụng xác thực mạnh hơn
    if (token === 'admin-token-placeholder') {
      return request;
    }
    
    return NextResponse.json({
      success: false,
      message: 'Không có quyền truy cập'
    }, { status: 403 });
  } catch (error) {
    console.error('Lỗi xác thực admin:', error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    }, { status: 500 });
  }
} 