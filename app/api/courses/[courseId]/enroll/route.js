import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const { courseId } = params;
    
    // Lấy dữ liệu từ request body
    const requestData = await request.json();
    const userId = requestData.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc" },
        { status: 400 }
      );
    }

    // Kết nối đến database
    await connectToDatabase();
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const coursesCollection = hocmaiDb.collection('courses');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    
    try {
      // Convert courseId sang ObjectId (nếu cần)
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      
      // Tìm khóa học
      const course = await coursesCollection.findOne({ _id: courseObjectId });
      
      if (!course) {
        // Thử tìm trong database elearning
        const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
        const elearningCoursesCollection = elearningDb.collection('courses');
        const elearningCourse = await elearningCoursesCollection.findOne({ _id: courseObjectId });
        
        if (!elearningCourse) {
          return NextResponse.json(
            { error: "Không tìm thấy khóa học" },
            { status: 404 }
          );
        }
        
        // Copy khóa học sang database hocmai
        const { _id, ...courseData } = elearningCourse;
        await coursesCollection.insertOne({
          ...courseData,
          _id: courseObjectId
        });
      }

      // Nếu là khóa học có phí, chuyển đến API mua khóa học
      if (course.price > 0) {
        return NextResponse.json(
          { 
            error: "Đây là khóa học có phí, vui lòng sử dụng API mua khóa học",
            redirectToPurchase: true 
          },
          { status: 400 }
        );
      }

      // Tìm người dùng
      const user = await usersCollection.findOne({ uid: userId });
      if (!user) {
        return NextResponse.json(
          { error: "Không tìm thấy thông tin người dùng" },
          { status: 404 }
        );
      }

      // Kiểm tra xem đã đăng ký chưa
      const existingEnrollment = await enrollmentsCollection.findOne({
        userId: userId,
        courseId: courseId
      });
      
      if (existingEnrollment) {
        return NextResponse.json(
          { error: "Bạn đã đăng ký khóa học này rồi" },
          { status: 400 }
        );
      }
      
      // Kiểm tra trong danh sách enrolled của user (cho backwards compatibility)
      const alreadyEnrolled = user.enrolledCourses && user.enrolledCourses.some(
        c => (typeof c === 'string' && c === courseId) || 
            (c.courseId && (c.courseId === courseId || c.courseId.toString() === courseId))
      );

      if (alreadyEnrolled) {
        return NextResponse.json(
          { error: "Bạn đã đăng ký khóa học này rồi" },
          { status: 400 }
        );
      }
      
      // 1. Thêm vào collection enrollments
      const enrollmentData = {
        userId: userId,
        courseId: courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null,
        status: 'active',
        paymentStatus: 'free'
      };
      
      const enrollmentResult = await enrollmentsCollection.insertOne(enrollmentData);
      
      // 2. Thêm khóa học vào danh sách đã đăng ký của user
      const courseEnrollment = {
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null
      };
      
      await usersCollection.updateOne(
        { uid: userId },
        { $push: { enrolledCourses: courseEnrollment } }
      );
      
      // 3. Cập nhật số người đăng ký khóa học
      await coursesCollection.updateOne(
        { _id: courseObjectId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      );
      
      return NextResponse.json({ 
        success: true,
        message: "Đăng ký khóa học thành công"
      });
    } catch (idError) {
      console.error("Lỗi khi xử lý ID:", idError);
      return NextResponse.json(
        { error: "ID không hợp lệ", details: idError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Lỗi xử lý yêu cầu:", error);
    return NextResponse.json(
      { error: "Lỗi server", details: error.message },
      { status: 500 }
    );
  }
} 