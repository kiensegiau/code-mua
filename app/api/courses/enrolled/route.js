import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
import Course from "@/app/_utils/models/Course";
import Purchase from "@/app/_utils/models/Purchase";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const requestId = `api_enrolled_courses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`📋 [${requestId}] GET /api/courses/enrolled - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Lấy session của người dùng để xác thực
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log(`🔒 [${requestId}] Không có session hợp lệ [${new Date().toISOString()}]`);
      return NextResponse.json({ error: 'Không được phép' }, { status: 401 });
    }
    
    // Lấy userId từ URL hoặc từ session
    const url = new URL(request.url);
    const userIdFromQuery = url.searchParams.get('userId');
    const userId = userIdFromQuery || session.user.id;
    
    // Kiểm tra xem người dùng có quyền xem dữ liệu của userId không
    if (userIdFromQuery && userIdFromQuery !== session.user.id) {
      // Chỉ cho phép xem dữ liệu của chính mình trừ khi là admin
      if (!session.user.isAdmin) {
        return NextResponse.json({ error: 'Không được phép' }, { status: 403 });
      }
    }

    console.log(`👤 [${requestId}] Lấy khóa học đã đăng ký cho userId: ${userId} [${new Date().toISOString()}]`);
    
    // Kết nối đến cơ sở dữ liệu
    await connectToDatabase();
    
    // Tìm các khóa học đã mua
    const purchases = await Purchase.find({ userId: userId });
    
    if (!purchases || purchases.length === 0) {
      console.log(`ℹ️ [${requestId}] Không tìm thấy khóa học đã đăng ký [${new Date().toISOString()}]`);
      return NextResponse.json([]);
    }
    
    // Lấy danh sách courseId
    const courseIds = purchases.map(purchase => purchase.courseId);
    
    // Lấy thông tin chi tiết của các khóa học
    const courses = await Course.find({ _id: { $in: courseIds } });
    
    // Kết hợp thông tin từ khóa học và thông tin đăng ký
    const enrolledCourses = courses.map(course => {
      const purchase = purchases.find(p => p.courseId.toString() === course._id.toString());
      
      return {
        id: course._id.toString(),
        ...course.toObject(),
        enrolledAt: purchase?.createdAt || null,
        progress: purchase?.progress || 0,
        lastAccessed: purchase?.lastAccessed || null,
      };
    });
    
    console.log(`✅ [${requestId}] Thành công - Tìm thấy ${enrolledCourses.length} khóa học đã đăng ký [${new Date().toISOString()}]`);
    
    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi lấy danh sách khóa học đã đăng ký: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể lấy danh sách khóa học đã đăng ký', message: error.message },
      { status: 500 }
    );
  }
} 