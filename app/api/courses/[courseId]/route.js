import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import Course from "@/app/_utils/models/Course";
import { verifyJwtToken } from '@/app/_utils/jwt';

export async function GET(request, { params }) {
  const requestId = `api_course_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`📘 [${requestId}] GET /api/courses/${params.courseId} - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Kiểm tra xác thực cho các API liên quan đến khóa học trả phí hoặc thông tin riêng tư
    // Để truy cập tự do vào thông tin cơ bản về khóa học, chúng ta có thể bỏ qua việc kiểm tra xác thực ở đây
    
    // Kết nối đến cơ sở dữ liệu
    console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
    await connectToDatabase();
    
    // Tìm kiếm khóa học theo ID
    console.log(`🔍 [${requestId}] Tìm kiếm khóa học với id: ${params.courseId} [${new Date().toISOString()}]`);
    const course = await Course.findById(params.courseId);
    
    if (!course) {
      console.log(`❓ [${requestId}] Không tìm thấy khóa học với id: ${params.courseId} [${new Date().toISOString()}]`);
      return NextResponse.json(
        { error: 'Không tìm thấy khóa học' },
        { status: 404 }
      );
    }
    
    // Chuyển đổi định dạng kết quả để tương thích với client
    const result = {
      id: course._id.toString(),
      ...course.toObject()
    };
    
    console.log(`✅ [${requestId}] Lấy thông tin khóa học thành công [${new Date().toISOString()}]`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi lấy thông tin khóa học: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể lấy thông tin khóa học', message: error.message },
      { status: 500 }
    );
  }
} 