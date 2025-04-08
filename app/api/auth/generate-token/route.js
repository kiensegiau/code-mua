import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  // Lấy dữ liệu từ body của request
  const data = await request.json();
  const { uid, email, role = "user" } = data;

  if (!uid || !email) {
    return NextResponse.json(
      { error: 'Thiếu thông tin người dùng' },
      { status: 400 }
    );
  }

  try {
    // Tạo JWT token
    const token = jwt.sign(
      { 
        uid, 
        email,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Lỗi tạo token:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi khi tạo token', 
        message: error.message 
      },
      { status: 500 }
    );
  }
} 