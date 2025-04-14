import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Lấy dữ liệu đăng ký khóa học từ database hiện tại
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: true,
        course: true
      }
    });
    
    return NextResponse.json({ enrollments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { source, target, options } = body;

    // Kiểm tra tham số đầu vào
    if (!source || !target) {
      return NextResponse.json(
        { error: 'Source và target là bắt buộc' },
        { status: 400 }
      );
    }

    // Mô phỏng quá trình migration dữ liệu đăng ký khóa học
    // TODO: Triển khai logic migration thực tế ở đây
    // 1. Kết nối đến database nguồn
    // 2. Đọc dữ liệu đăng ký khóa học từ nguồn
    // 3. Chuyển đổi dữ liệu sang định dạng phù hợp
    // 4. Lưu dữ liệu vào database đích
    
    // Giả lập kết quả migration
    const migrationResults = {
      totalEnrollments: 150,
      migratedEnrollments: 150,
      failedEnrollments: 0,
      errors: []
    };

    return NextResponse.json({
      status: 'enrollment_migration_completed',
      source,
      target,
      options,
      results: migrationResults
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 