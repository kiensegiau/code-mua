import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

// Cache cho thông tin người dùng và quyền truy cập
const userEnrollmentCache = new Map();

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc", status: "error" },
        { status: 400 }
      );
    }

    // Tạo cacheKey từ thông tin người dùng và khóa học
    const cacheKey = `${userId}-${courseId}`;
    
    // Kiểm tra cache trước khi truy vấn database
    const cachedEnrollment = userEnrollmentCache.get(cacheKey);
    if (cachedEnrollment) {
      // Kiểm tra xem cache có còn hạn không (còn ít nhất 5 phút)
      if (cachedEnrollment.expires > Date.now()) {
        return NextResponse.json(cachedEnrollment.data);
      }
      // Cache đã hết hạn, xóa khỏi cache
      userEnrollmentCache.delete(cacheKey);
    }

    // Kết nối đến database
    await connectToDatabase();
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    
    // Lấy thông tin user
    const user = await usersCollection.findOne({ uid: userId });
    
    // Kiểm tra người dùng VIP
    if (user && user.isVip === true) {
      const currentDate = new Date();
      // Kiểm tra nếu người dùng đang VIP và VIP chưa hết hạn
      if (user.vipExpiresAt && new Date(user.vipExpiresAt) > currentDate) {
        const responseData = {
          enrolled: true,
          enrollment: {
            enrolledAt: currentDate,
            progress: 0,
            lastAccessed: currentDate,
            type: 'vip'
          },
          userId,
          courseId,
          status: "success",
          isVip: true
        };
        
        // Lưu vào cache (hết hạn sau 15 phút)
        userEnrollmentCache.set(cacheKey, {
          data: responseData,
          expires: Date.now() + 15 * 60 * 1000,
          userData: {
            isVip: true,
            vipExpiresAt: user.vipExpiresAt
          }
        });
        
        return NextResponse.json(responseData);
      }
    }
    
    // Kiểm tra trong collection enrollments
    let isEnrolled = false;
    let enrollmentInfo = null;
    
    // Thử chuyển đổi courseId thành ObjectId nếu có thể
    let courseObjectId;
    try {
      courseObjectId = new mongoose.Types.ObjectId(courseId);
    } catch (error) {
      courseObjectId = courseId;
    }
    
    // Tìm trong enrollments collection
    const enrollment = await enrollmentsCollection.findOne({
      userId: userId,
      courseId: courseObjectId, 
      status: 'active'
    });
    
    if (enrollment) {
      isEnrolled = true;
      enrollmentInfo = {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress || 0,
        lastAccessed: enrollment.lastAccessed,
        type: enrollment.paymentStatus === 'paid' ? 'purchased' : 'free'
      };
    } else {
      // Kiểm tra trong user.enrolledCourses (cách cũ)
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
          isEnrolled = true;
          enrollmentInfo = {
            enrolledAt: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.enrolledAt || new Date()),
            progress: typeof enrolledCourse === 'string' ? 0 : (enrolledCourse.progress || 0),
            lastAccessed: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.lastAccessed || enrolledCourse.enrolledAt || new Date()),
            type: 'legacy'
          };
        }
      }
    }
    
    const responseData = {
      enrolled: isEnrolled,
      enrollment: enrollmentInfo,
      userId,
      courseId,
      status: "success"
    };
    
    // Lưu kết quả vào cache (hết hạn sau 15 phút)
    userEnrollmentCache.set(cacheKey, {
      data: responseData,
      expires: Date.now() + 15 * 60 * 1000,
      userData: user ? {
        isVip: user.isVip || false,
        vipExpiresAt: user.vipExpiresAt || null
      } : null
    });
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng ký:", error);
    return NextResponse.json(
      { error: "Lỗi khi kiểm tra đăng ký", details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 