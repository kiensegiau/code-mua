import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/_utils/mongodb';
import Course from '@/app/_utils/models/Course';

// GET /api/courses - Lấy danh sách tất cả khóa học
export async function GET(request) {
  const requestId = `api_courses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`📋 [${requestId}] GET /api/courses - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Lấy params từ URL
    const url = new URL(request.url);
    const grade = url.searchParams.get('grade');
    const subject = url.searchParams.get('subject');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    console.log(`🔍 [${requestId}] Tham số: grade=${grade}, subject=${subject}, limit=${limit}, page=${page} [${new Date().toISOString()}]`);
    
    // Kết nối đến MongoDB
    console.log(`🔄 [${requestId}] Kết nối đến cơ sở dữ liệu... [${new Date().toISOString()}]`);
    await connectToDatabase();
    
    // Xây dựng query
    let query = {};
    
    if (grade) {
      query.grade = grade;
    }
    
    if (subject) {
      query.subject = subject;
    }
    
    console.log(`🔍 [${requestId}] Query: ${JSON.stringify(query)} [${new Date().toISOString()}]`);
    
    // Thực hiện truy vấn
    const courses = await Course
      .find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    // Format kết quả
    const formattedCourses = courses.map(course => {
      if (!course || !course._id) {
        console.warn(`⚠️ [${requestId}] Phát hiện course không hợp lệ hoặc không có _id [${new Date().toISOString()}]`);
        return null;
      }
      
      return {
        id: course._id.toString(),
        ...course.toObject()
      };
    }).filter(Boolean); // Lọc bỏ các giá trị null
    
    console.log(`✅ [${requestId}] Thành công - Tìm thấy ${formattedCourses.length} khóa học [${new Date().toISOString()}]`);
    
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi lấy danh sách khóa học: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể lấy danh sách khóa học', message: error.message },
      { status: 500 }
    );
  }
} 