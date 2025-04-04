import { NextResponse } from 'next/server';

export async function POST(request) {
  const requestId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  try {
    const body = await request.json();
    console.log(`📝 [${requestId}] Client log:`, body);
    
    return NextResponse.json({ message: 'Log received' });
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi xử lý log:`, error);
    
    return NextResponse.json(
      { error: 'Không thể xử lý log', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
} 