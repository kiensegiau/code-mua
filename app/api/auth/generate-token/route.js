import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

export async function POST(request) {
  const requestId = `auth_generate_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`🔐 [${requestId}] POST /api/auth/generate-token - Bắt đầu [${new Date().toISOString()}]`);

  try {
    const { user } = await request.json();
    
    if (!user || !user.uid) {
      console.log(`❌ [${requestId}] Dữ liệu người dùng không hợp lệ [${new Date().toISOString()}]`);
      return NextResponse.json(
        { error: 'Dữ liệu người dùng không hợp lệ' },
        { status: 400 }
      );
    }
    
    console.log(`👤 [${requestId}] Tạo token cho người dùng: ${user.email || user.uid} [${new Date().toISOString()}]`);
    
    // Tạo access token (hết hạn sau 7 ngày)
    const accessToken = jwt.sign(
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    
    // Tạo refresh token (hết hạn sau 30 ngày)
    const refreshToken = jwt.sign(
      { uid: user.uid },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    
    console.log(`✅ [${requestId}] Tạo token thành công [${new Date().toISOString()}]`);
    
    // Trả về cả hai token
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi tạo token: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể tạo token', message: error.message },
      { status: 500 }
    );
  }
} 