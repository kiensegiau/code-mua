import { NextResponse } from 'next/server';
import admin from '../../../_utils/firebaseAdmin';

export async function POST(request) {
  try {
    const { uid, forceRefresh = false } = await request.json();
    
    if (!uid) {
      return NextResponse.json(
        { error: 'UID người dùng không được cung cấp' },
        { status: 400 }
      );
    }
    
    try {
      // Tạo custom token từ Firebase Admin
      const customToken = await admin.auth().createCustomToken(uid);
      
      console.log('✅ API refresh-token - Custom token được tạo cho UID:', uid);
      
      // Tính thời gian hết hạn
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 giờ
      
      return NextResponse.json({
        success: true,
        customToken: customToken,
        expiryTime
      });
    } catch (error) {
      console.error('❌ API refresh-token - Lỗi khi tạo token mới:', error);
      return NextResponse.json(
        { error: 'Không thể tạo token mới', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ API refresh-token - Lỗi server:', error);
    return NextResponse.json(
      { error: 'Lỗi server', details: error.message },
      { status: 500 }
    );
  }
} 