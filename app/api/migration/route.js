import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Trả về thông tin về API migration
    return NextResponse.json({
      status: 'available',
      endpoints: [
        '/api/migration/users', 
        '/api/migration/user-enrollments',
        '/api/migration/courses'
      ],
      message: 'API Migration sẵn sàng sử dụng'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, source, target, options } = body;

    // Kiểm tra các tham số bắt buộc
    if (!type || !source || !target) {
      return NextResponse.json(
        { error: 'Thiếu các tham số bắt buộc (type, source, target)' },
        { status: 400 }
      );
    }

    // Xử lý yêu cầu migration dựa trên loại
    let result;
    switch (type) {
      case 'users':
        // Gọi API migration người dùng
        const usersResponse = await fetch(`${request.nextUrl.origin}/api/migration/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        result = await usersResponse.json();
        break;
      
      case 'user-enrollments':
        // Gọi API migration đăng ký khóa học
        const enrollmentsResponse = await fetch(`${request.nextUrl.origin}/api/migration/user-enrollments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        result = await enrollmentsResponse.json();
        break;
        
      case 'courses':
        // Gọi API migration khóa học
        const coursesResponse = await fetch(`${request.nextUrl.origin}/api/migration/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        result = await coursesResponse.json();
        break;

      case 'all':
        // Gọi tất cả các API migration
        const allResults = {};
        
        // Migration người dùng
        const usersAllResponse = await fetch(`${request.nextUrl.origin}/api/migration/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        allResults.users = await usersAllResponse.json();
        
        // Migration đăng ký khóa học
        const enrollmentsAllResponse = await fetch(`${request.nextUrl.origin}/api/migration/user-enrollments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        allResults.userEnrollments = await enrollmentsAllResponse.json();
        
        // Migration khóa học
        const coursesAllResponse = await fetch(`${request.nextUrl.origin}/api/migration/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, target, options })
        });
        allResults.courses = await coursesAllResponse.json();
        
        result = { status: 'migration_all_started', results: allResults };
        break;
        
      default:
        return NextResponse.json(
          { error: `Loại migration không hợp lệ: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      status: 'migration_started',
      type,
      source,
      target,
      result
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 