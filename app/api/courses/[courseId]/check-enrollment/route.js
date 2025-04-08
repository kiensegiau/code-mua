import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    console.log("API check-enrollment được gọi");
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log("Params:", { courseId, userId });

    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc", status: "error" },
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
    
    // Kiểm tra trong collection enrollments
    let isEnrolled = false;
    let enrollmentInfo = null;
    
    // Thử chuyển đổi courseId thành ObjectId nếu có thể
    let courseObjectId;
    try {
      courseObjectId = new mongoose.Types.ObjectId(courseId);
    } catch (error) {
      console.error("Không thể chuyển đổi courseId thành ObjectId:", error.message);
      courseObjectId = courseId;
    }
    
    // Tìm trong enrollments collection
    const enrollment = await enrollmentsCollection.findOne({
      userId: userId,
      courseId: courseObjectId, 
      status: 'active'
    });
    
    if (enrollment) {
      console.log("Tìm thấy đăng ký trong collection enrollments");
      isEnrolled = true;
      enrollmentInfo = {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress || 0,
        lastAccessed: enrollment.lastAccessed,
        type: enrollment.paymentStatus === 'paid' ? 'purchased' : 'free'
      };
    } else {
      console.log("Không tìm thấy đăng ký trong collection enrollments");
      
      // Kiểm tra trong user.enrolledCourses (cách cũ)
      const user = await usersCollection.findOne({ uid: userId });
      
      if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        // Tìm kiếm courseId trong danh sách khóa học đã đăng ký
        const enrolledCourse = user.enrolledCourses.find(course => {
          if (typeof course === 'string') {
            return course === courseId;
          } else if (course.courseId) {
            return course.courseId.toString() === courseId;
          } else if (course._id) {
            return course._id.toString() === courseId;
          }
          return false;
        });
        
        if (enrolledCourse) {
          console.log("Tìm thấy đăng ký trong user.enrolledCourses");
          isEnrolled = true;
          enrollmentInfo = {
            enrolledAt: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.enrolledAt || new Date()),
            progress: typeof enrolledCourse === 'string' ? 0 : (enrolledCourse.progress || 0),
            lastAccessed: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.lastAccessed || enrolledCourse.enrolledAt || new Date()),
            type: 'legacy'
          };
        } else {
          console.log("Không tìm thấy đăng ký trong user.enrolledCourses");
        }
      }
    }
    
    return NextResponse.json({
      enrolled: isEnrolled,
      enrollment: enrollmentInfo,
      userId,
      courseId,
      status: "success"
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng ký:", error);
    return NextResponse.json(
      { error: "Lỗi khi kiểm tra đăng ký", details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 