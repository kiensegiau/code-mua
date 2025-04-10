import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    // Lấy userId từ query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
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
      // Cách 1: Tìm dữ liệu từ collection enrollments
      const enrollments = await enrollmentsCollection.find({ 
        userId: userId,
        status: 'active'
      }).toArray();
      
      if (enrollments.length > 0) {
        // Lấy danh sách courseId
        const courseIds = enrollments.map(enrollment => {
          try {
            return new mongoose.Types.ObjectId(enrollment.courseId);
          } catch (err) {
            console.warn(`Lỗi chuyển đổi courseId ${enrollment.courseId}:`, err.message);
            return null;
          }
        }).filter(id => id !== null);
        
        if (courseIds.length === 0) {
          return NextResponse.json([]);
        }
        
        // Lấy thông tin chi tiết của các khóa học
        const courses = await coursesCollection.find({
          _id: { $in: courseIds }
        }).toArray();
        
        // Kết hợp thông tin khóa học với thông tin đăng ký
        const enrolledCourses = courses.map(course => {
          const enrollment = enrollments.find(e => e.courseId === course._id.toString());
          
          return {
            ...course,
            id: course._id.toString(),
            _id: course._id.toString(),
            enrolledAt: enrollment ? enrollment.enrolledAt : new Date(),
            progress: enrollment ? enrollment.progress || 0 : 0,
            lastAccessed: enrollment ? enrollment.lastAccessed : null,
            paymentStatus: enrollment ? enrollment.paymentStatus : 'free'
          };
        });
        
        return NextResponse.json(enrolledCourses);
      }
      
      // Cách 2: Backup - Tìm trong user.enrolledCourses (cho backwards compatibility)
      const user = await usersCollection.findOne({ uid: userId });
      
      if (!user) {
        return NextResponse.json(
          { error: "Không tìm thấy thông tin người dùng" },
          { status: 404 }
        );
      }
      
      const enrolledCourses = user.enrolledCourses || [];
      
      if (!enrolledCourses.length) {
        return NextResponse.json([]);
      }
      
      // Lấy ID của các khóa học đã đăng ký
      const courseIds = enrolledCourses.map(course => {
        const courseId = typeof course === 'string' ? course : course.courseId;
        
        try {
          return new mongoose.Types.ObjectId(courseId);
        } catch (err) {
          console.warn(`Lỗi chuyển đổi courseId ${courseId}:`, err.message);
          return null;
        }
      }).filter(id => id !== null);
      
      if (courseIds.length === 0) {
        return NextResponse.json([]);
      }
      
      // Lấy thông tin chi tiết của các khóa học
      const courses = await coursesCollection.find({
        _id: { $in: courseIds }
      }).toArray();
      
      // Kết hợp thông tin khóa học với thông tin đăng ký
      const formattedCourses = courses.map(course => {
        const courseEnrollment = enrolledCourses.find(c => {
          const enrolledId = typeof c === 'string' ? c : c.courseId;
          return enrolledId === course._id.toString() || enrolledId === course._id;
        });
        
        const enrollmentInfo = typeof courseEnrollment === 'string' 
          ? { courseId: courseEnrollment } 
          : courseEnrollment;
        
        return {
          ...course,
          id: course._id.toString(),
          _id: course._id.toString(),
          enrolledAt: enrollmentInfo?.enrolledAt || new Date(),
          progress: enrollmentInfo?.progress || 0,
          lastAccessed: enrollmentInfo?.lastAccessed || null
        };
      });
      
      return NextResponse.json(formattedCourses);
    } catch (dbError) {
      console.error("Lỗi khi truy vấn database:", dbError);
      return NextResponse.json(
        { error: "Lỗi khi truy vấn dữ liệu", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách khóa học đã đăng ký", details: error.message },
      { status: 500 }
    );
  }
}