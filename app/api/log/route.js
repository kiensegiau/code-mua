import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Client log:', data);
    return NextResponse.json({ message: 'Log received' });
  } catch (error) {
    console.error('Lỗi xử lý log:', error);
    return NextResponse.json(
      { message: 'Lỗi xử lý log' },
      { status: 500 }
    );
  }
} 