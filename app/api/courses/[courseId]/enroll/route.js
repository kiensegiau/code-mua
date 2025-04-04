import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
import Course from "@/app/_utils/models/Course";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thực hiện tính năng này" },
        { status: 401 }
      );
    }

    const { courseId } = params;
    const userId = session.user.id;

    await connectToDatabase();
    
    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin khóa học" },
        { status: 404 }
      );
    }
    
    // Nếu khóa học miễn phí, đăng ký trực tiếp
    if (course.price === 0) {
      await User.updateOne(
        { uid: userId },
        { $addToSet: { enrolledCourses: courseId } }
      );
      
      // Cập nhật số lượng đăng ký của khóa học
      await Course.updateOne(
        { _id: courseId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      );
      
      return NextResponse.json({ success: true });
    } else {
      // Nếu khóa học có phí, chuyển sang API mua khóa học
      return NextResponse.json(
        { 
          message: "Khóa học này có phí, vui lòng sử dụng API mua khóa học",
          needPurchase: true
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi đăng ký khóa học:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi trong quá trình đăng ký khóa học" },
      { status: 500 }
    );
  }
} 