import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    console.log("API lấy danh sách khóa học đã đăng ký được gọi");
    
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
    
    // Kết nối đến database elearning
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    console.log("Đã kết nối đến database elearning");
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    const coursesCollection = elearningDb.collection('courses');
    
    try {
      // 1. Lấy danh sách đăng ký từ enrollments collection
      console.log("Lấy danh sách đăng ký từ enrollments collection");
      const enrollments = await enrollmentsCollection.find({
        userId: userId,
        status: 'active'
      }).toArray();
      
      console.log(`Tìm thấy ${enrollments.length} đăng ký từ collection enrollments`);
      
      // 2. Lấy thông tin user để kiểm tra enrolledCourses (legacy)
      console.log("Lấy thông tin user từ collection users");
      const user = await usersCollection.findOne({ uid: userId });
      
      let legacyEnrollments = [];
      if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        console.log("Xử lý enrolledCourses từ user (legacy)");
        legacyEnrollments = user.enrolledCourses.map(course => {
          // Chuẩn hóa dữ liệu course
          if (typeof course === 'string') {
            return {
              courseId: course,
              enrolledAt: new Date(),
              progress: 0,
              type: 'legacy'
            };
          } else {
            return {
              courseId: course.courseId || course._id,
              enrolledAt: course.enrolledAt || new Date(),
              progress: course.progress || 0,
              type: 'legacy'
            };
          }
        });
      }
      
      // 3. Gộp danh sách đăng ký từ cả hai nguồn
      const allEnrollmentIds = [
        ...enrollments.map(e => e.courseId),
        ...legacyEnrollments.map(e => e.courseId)
      ];
      
      console.log(`Tổng số khóa học đã đăng ký: ${allEnrollmentIds.length}`);
      
      // Loại bỏ trùng lặp
      const uniqueCourseIds = [...new Set(allEnrollmentIds)];
      console.log(`Số lượng khóa học đã đăng ký (đã loại bỏ trùng lặp): ${uniqueCourseIds.length}`);
      
      // 4. Lấy thông tin chi tiết của các khóa học
      console.log("Lấy thông tin chi tiết khóa học từ database elearning");
      const courseDetails = await coursesCollection.find({
        _id: { $in: uniqueCourseIds.map(id => {
          try {
            // Cố gắng chuyển đổi id thành ObjectId nếu có thể
            return new mongoose.Types.ObjectId(id);
          } catch (e) {
            // Nếu không thể chuyển đổi, trả về id như chuỗi
            return id;
          }
        })}
      }).toArray();
      
      console.log(`Tìm thấy ${courseDetails.length} khóa học từ database`);
      
      // 5. Kết hợp thông tin đăng ký với thông tin khóa học
      const enrolledCourses = uniqueCourseIds.map(courseId => {
        // Tìm thông tin chi tiết khóa học
        const courseDetail = courseDetails.find(c => 
          c._id.toString() === courseId.toString()
        );
        
        // Tìm thông tin đăng ký từ enrollment collection
        const enrollmentInfo = enrollments.find(e => 
          e.courseId.toString() === courseId.toString()
        );
        
        // Tìm thông tin đăng ký từ legacy
        const legacyInfo = legacyEnrollments.find(e => 
          e.courseId.toString() === courseId.toString()
        );
        
        // Ưu tiên sử dụng thông tin từ enrollment collection
        const enrollmentData = enrollmentInfo || legacyInfo || { 
          enrolledAt: new Date(),
          progress: 0
        };
        
        return {
          courseId: courseId,
          courseDetails: courseDetail || { title: "Khóa học không tồn tại", _id: courseId },
          enrolledAt: enrollmentData.enrolledAt,
          progress: enrollmentData.progress || 0,
          status: enrollmentInfo ? enrollmentInfo.status : 'active',
          type: (enrollmentInfo && enrollmentInfo.paymentStatus === 'paid') ? 'purchased' : 'free'
        };
      });
      
      console.log(`Đã kết hợp thông tin cho ${enrolledCourses.length} khóa học`);
      
      return NextResponse.json({
        enrolledCourses: enrolledCourses
      });
    } catch (dbError) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", dbError);
      return NextResponse.json(
        { error: "Lỗi khi truy vấn cơ sở dữ liệu", details: dbError.message },
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