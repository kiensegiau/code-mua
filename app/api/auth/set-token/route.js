import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Thời hạn cookie: 1 năm
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 năm tính bằng giây

export async function POST(request) {
  try {
    // Kiểm tra content-type để đảm bảo là JSON
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ API set-token - Content-Type không hợp lệ:', contentType);
      return NextResponse.json(
        { error: 'Content-Type phải là application/json' },
        { status: 400 }
      );
    }

    // Kiểm tra nội dung request trước khi phân tích JSON
    const text = await request.text();
    if (!text || text.trim() === '') {
      console.error('❌ API set-token - Request body trống');
      return NextResponse.json(
        { error: 'Request body không được trống' },
        { status: 400 }
      );
    }

    // Phân tích JSON với xử lý lỗi
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('❌ API set-token - Lỗi phân tích JSON:', jsonError);
      return NextResponse.json(
        { error: 'Dữ liệu JSON không hợp lệ', details: jsonError.message },
        { status: 400 }
      );
    }

    const { idToken } = data;
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'ID Token không được cung cấp' },
        { status: 400 }
      );
    }
    
    try {
      // Lưu ID token vào cookie
      cookies().set('firebaseToken', idToken, {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true
      });
      
      console.log('✅ API set-token - ID Token đã được lưu vào cookie');
      
      return NextResponse.json({
        success: true,
        message: 'Token đã được lưu vào cookie'
      });
    } catch (error) {
      console.error('❌ API set-token - Lỗi khi lưu token:', error);
      return NextResponse.json(
        { error: 'Không thể lưu token', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ API set-token - Lỗi server:', error);
    return NextResponse.json(
      { error: 'Lỗi server', details: error.message },
      { status: 500 }
    );
  }
} 