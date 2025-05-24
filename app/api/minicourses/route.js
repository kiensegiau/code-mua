import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MiniCourse from '@/models/MiniCourse';

export async function GET(request) {
  try {
    // Kết nối đến MongoDB với thử lại nếu cần
    try {
      await connectDB();
    } catch (connError) {
      console.error('Lỗi kết nối MongoDB, đang thử lại...', connError);
      // Đợi 1 giây và thử lại một lần nữa
      await new Promise(resolve => setTimeout(resolve, 1000));
      await connectDB();
    }
    
    // Lấy tham số tìm kiếm từ URL nếu có
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Tạo query dựa trên tham số tìm kiếm
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }
    
    // Đếm tổng số bản ghi
    const total = await MiniCourse.countDocuments(query);
    
    // Lấy danh sách minicourses với phân trang
    const minicourses = await MiniCourse.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Trả về kết quả
    return NextResponse.json({
      success: true,
      data: {
        minicourses,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách minicourses:', error);
    
    // Xử lý các loại lỗi khác nhau
    if (error.name === 'MongooseServerSelectionError') {
      return NextResponse.json({
        success: false,
        message: 'Không thể kết nối đến máy chủ MongoDB, vui lòng thử lại sau',
        error: error.message
      }, { status: 503 }); // Service Unavailable
    }
    
    if (error.name === 'MongooseError' && error.message.includes('different connection strings')) {
      return NextResponse.json({
        success: false,
        message: 'Lỗi cấu hình kết nối cơ sở dữ liệu, vui lòng liên hệ quản trị viên',
        error: 'Lỗi cấu hình kết nối MongoDB'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách minicourses',
      error: error.message
    }, { status: 500 });
  }
} 