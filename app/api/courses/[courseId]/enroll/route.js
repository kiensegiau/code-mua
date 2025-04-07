import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    console.log("API đăng ký khóa học được gọi");
    const { courseId } = params;
    console.log("courseId:", courseId);
    
    // Lấy dữ liệu từ request body
    const requestData = await request.json();
    const userId = requestData.userId;
    
    if (!userId) {
      console.log("Lỗi: userId không được cung cấp");
      return NextResponse.json(
        { error: "userId là bắt buộc" },
        { status: 400 }
      );
    }
    
    console.log("userId từ request:", userId);

    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const coursesCollection = hocmaiDb.collection('courses');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    
    try {
      // Convert courseId sang ObjectId (nếu cần)
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      console.log("courseObjectId:", courseObjectId);
      
      // Tìm khóa học
      console.log("Tìm kiếm khóa học với ID:", courseId);
      const course = await coursesCollection.findOne({ _id: courseObjectId });
      
      if (!course) {
        console.log("Không tìm thấy khóa học với ID:", courseId);
        console.log("Kiểm tra lại trong database elearning");
        
        // Thử tìm trong database elearning
        const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
        const elearningCoursesCollection = elearningDb.collection('courses');
        const elearningCourse = await elearningCoursesCollection.findOne({ _id: courseObjectId });
        
        if (!elearningCourse) {
          console.log("Không tìm thấy khóa học trong cả hai database");
          return NextResponse.json(
            { error: "Không tìm thấy khóa học" },
            { status: 404 }
          );
        }
        
        console.log("Tìm thấy khóa học trong database elearning:", elearningCourse.title);
        // Copy khóa học sang database hocmai
        const { _id, ...courseData } = elearningCourse;
        const insertResult = await coursesCollection.insertOne({
          ...courseData,
          _id: courseObjectId
        });
        console.log("Đã copy khóa học sang database hocmai:", insertResult.acknowledged);
      }
      
      console.log("Đã tìm thấy khóa học:", course.title);

      // Nếu là khóa học có phí, chuyển đến API mua khóa học
      if (course.price > 0) {
        console.log("Đây là khóa học có phí, yêu cầu mua khóa học");
        return NextResponse.json(
          { 
            error: "Đây là khóa học có phí, vui lòng sử dụng API mua khóa học",
            redirectToPurchase: true 
          },
          { status: 400 }
        );
      }

      // Tìm người dùng
      console.log("Tìm kiếm người dùng với ID:", userId);
      const user = await usersCollection.findOne({ uid: userId });
      if (!user) {
        console.log("Không tìm thấy người dùng với ID:", userId);
        return NextResponse.json(
          { error: "Không tìm thấy thông tin người dùng" },
          { status: 404 }
        );
      }
      
      console.log("Đã tìm thấy người dùng:", user.email || user.uid);

      // Kiểm tra xem đã đăng ký chưa
      console.log("Kiểm tra trạng thái đăng ký");
      const existingEnrollment = await enrollmentsCollection.findOne({
        userId: userId,
        courseId: courseId
      });
      
      if (existingEnrollment) {
        console.log("Người dùng đã đăng ký khóa học này");
        return NextResponse.json(
          { error: "Bạn đã đăng ký khóa học này rồi" },
          { status: 400 }
        );
      }
      
      // Kiểm tra trong danh sách enrolled của user (cho backwards compatibility)
      console.log("Kiểm tra trong user.enrolledCourses");
      const alreadyEnrolled = user.enrolledCourses && user.enrolledCourses.some(
        c => (typeof c === 'string' && c === courseId) || 
            (c.courseId && (c.courseId === courseId || c.courseId.toString() === courseId))
      );

      if (alreadyEnrolled) {
        console.log("Người dùng đã đăng ký khóa học này (trong user.enrolledCourses)");
        return NextResponse.json(
          { error: "Bạn đã đăng ký khóa học này rồi" },
          { status: 400 }
        );
      }

      console.log("Bắt đầu đăng ký khóa học - không dùng transaction");
      
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
      console.log("Đã thêm dữ liệu vào collection enrollments:", enrollmentResult.acknowledged);
      
      // 2. Thêm khóa học vào danh sách đã đăng ký của user
      const courseEnrollment = {
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null
      };
      
      const userUpdateResult = await usersCollection.updateOne(
        { uid: userId },
        { $push: { enrolledCourses: courseEnrollment } }
      );
      console.log("Đã cập nhật enrolledCourses trong user:", userUpdateResult.acknowledged);
      
      // 3. Cập nhật số người đăng ký khóa học
      const courseUpdateResult = await coursesCollection.updateOne(
        { _id: courseObjectId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      );
      console.log("Đã cập nhật enrolledUsers và enrollments trong course:", courseUpdateResult.acknowledged);
      
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