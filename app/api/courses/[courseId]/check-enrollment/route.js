import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    console.log("API kiểm tra đăng ký khóa học được gọi");
    const { courseId } = params;
    console.log("courseId:", courseId);
    
    // Lấy userId từ query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log("userId từ query params:", userId);
    
    if (!userId) {
      console.log("Lỗi: userId không được cung cấp");
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      );
    }

    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    const purchasesCollection = hocmaiDb.collection('purchases');
    
    try {
      // Cách 1: Kiểm tra trong collection enrollments
      console.log("Kiểm tra đăng ký trong collection enrollments");
      const enrollment = await enrollmentsCollection.findOne({
        userId: userId,
        courseId: courseId,
        status: 'active'
      });
      
      if (enrollment) {
        console.log("Tìm thấy đăng ký trong collection enrollments");
        return NextResponse.json({
          enrolled: true,
          enrollmentInfo: {
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress || 0,
            type: enrollment.paymentStatus === 'paid' ? 'purchased' : 'free'
          }
        });
      }
      
      // Cách 2: Kiểm tra trong collection purchases
      console.log("Kiểm tra mua khóa học trong collection purchases");
      const purchase = await purchasesCollection.findOne({
        userId: userId,
        courseId: courseId,
        status: 'completed'
      });
      
      if (purchase) {
        console.log("Tìm thấy lịch sử mua khóa học");
        return NextResponse.json({
          enrolled: true,
          enrollmentInfo: {
            enrolledAt: purchase.purchasedAt,
            progress: 0,
            type: 'purchased'
          }
        });
      }
      
      // Cách 3: Kiểm tra trong user.enrolledCourses (legacy)
      console.log("Kiểm tra đăng ký trong user.enrolledCourses");
      const user = await usersCollection.findOne({ uid: userId });
      
      if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        const hasEnrolled = user.enrolledCourses.some(
          c => (typeof c === 'string' && c === courseId) || 
              (c.courseId && (c.courseId === courseId || c.courseId.toString() === courseId))
        );
        
        if (hasEnrolled) {
          console.log("Tìm thấy đăng ký trong user.enrolledCourses");
          // Tìm thông tin enrollment
          const enrollmentInfo = user.enrolledCourses.find(
            c => (typeof c === 'string' && c === courseId) || 
                (c.courseId && (c.courseId === courseId || c.courseId.toString() === courseId))
          );
          
          return NextResponse.json({
            enrolled: true,
            enrollmentInfo: {
              enrolledAt: enrollmentInfo.enrolledAt || new Date(),
              progress: enrollmentInfo.progress || 0,
              type: 'legacy'
            }
          });
        }
      }
      
      // Không tìm thấy đăng ký
      console.log("Không tìm thấy đăng ký nào cho khóa học này");
      return NextResponse.json({
        enrolled: false
      });
    } catch (dbError) {
      console.error("Lỗi khi kiểm tra đăng ký:", dbError);
      return NextResponse.json(
        { error: "Lỗi khi kiểm tra đăng ký", details: dbError.message },
        { status: 500 }
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