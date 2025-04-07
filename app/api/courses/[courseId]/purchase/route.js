import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_models/user";
import Course from "@/app/_models/course";
import Purchase from "@/app/_models/purchase";
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

    // Kiểm tra xem đã mua khóa học chưa
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Course already purchased" },
        { status: 400 }
      );
    }

    // Lấy thông tin số dư của người dùng
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    const userBalance = user.balance || 0;

    // Lấy giá của khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }
    const coursePrice = course.price || 0;

    if (userBalance < coursePrice) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Sử dụng MongoDB session để đảm bảo tính nhất quán của dữ liệu
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Trừ tiền và cập nhật ví người dùng
      user.balance = userBalance - coursePrice;
      await user.save({ session });

      // Lưu thông tin mua khóa học
      const purchase = new Purchase({
        userId,
        courseId,
        amount: coursePrice,
        purchasedAt: new Date(),
      });
      await purchase.save({ session });

      // Thêm khóa học vào danh sách đã đăng ký của người dùng
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
      await user.save({ session });

      // Cập nhật số người đăng ký của khóa học
      if (!course.enrolledUsers) {
        course.enrolledUsers = [userId];
        course.enrollments = 1;
      } else {
        if (!course.enrolledUsers.includes(userId)) {
          course.enrolledUsers.push(userId);
          course.enrollments = (course.enrollments || 0) + 1;
        }
      }
      await course.save({ session });

      await session.commitTransaction();
      return NextResponse.json({ success: true });
    } catch (error) {
      await session.abortTransaction();
      console.error("Lỗi khi thực hiện giao dịch:", error);
      return NextResponse.json(
        { error: "Transaction failed" },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
