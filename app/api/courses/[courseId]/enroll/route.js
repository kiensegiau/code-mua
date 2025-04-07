import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_models/user";
import Course from "@/app/_models/course";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const userId = session.user.id;

    await connectToDatabase();

    // Tìm khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
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
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin người dùng" },
        { status: 404 }
      );
    }

    // Kiểm tra xem đã đăng ký chưa
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

    // Sử dụng MongoDB session để đảm bảo tính nhất quán
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Thêm khóa học vào danh sách đã đăng ký
      const courseEnrollment = {
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null
      };
      
      if (!user.enrolledCourses) {
        user.enrolledCourses = [courseEnrollment];
      } else {
        user.enrolledCourses.push(courseEnrollment);
      }
      
      // Cập nhật số người đăng ký khóa học
      if (!course.enrolledUsers) {
        course.enrolledUsers = [userId];
        course.enrollments = 1;
      } else {
        if (!course.enrolledUsers.includes(userId)) {
          course.enrolledUsers.push(userId);
          course.enrollments = (course.enrollments || 0) + 1;
        }
      }
      
      // Lưu các thay đổi
      await Promise.all([
        user.save({ session: dbSession }),
        course.save({ session: dbSession })
      ]);
      
      await dbSession.commitTransaction();
      
      return NextResponse.json({ 
        success: true,
        message: "Đăng ký khóa học thành công"
      });
    } catch (error) {
      // Rollback nếu có lỗi
      await dbSession.abortTransaction();
      console.error("Lỗi khi đăng ký khóa học:", error);
      return NextResponse.json(
        { error: "Lỗi khi đăng ký khóa học" },
        { status: 500 }
      );
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.error("Lỗi xử lý yêu cầu:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
} 