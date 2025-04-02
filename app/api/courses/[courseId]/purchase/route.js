import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
import Course from "@/app/_utils/models/Course";
import Purchase from "@/app/_utils/models/Purchase";
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
    
    // Bắt đầu transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Tìm thông tin người dùng
      const user = await User.findOne({ uid: userId }).session(session);
      
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Tìm thông tin khóa học
      const course = await Course.findById(courseId).session(session);
      
      if (!course) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      const userBalance = user.balance || 0;
      const coursePrice = course.price || 0;

      // Kiểm tra số dư
      if (userBalance < coursePrice) {
        throw new Error("Số dư không đủ để mua khóa học này");
      }

      // Kiểm tra đã mua chưa
      const existingPurchase = await Purchase.findOne({
        userId: userId,
        courseId: courseId
      }).session(session);
      
      if (existingPurchase) {
        throw new Error("Bạn đã mua khóa học này rồi");
      }

      // Trừ tiền người dùng
      await User.updateOne(
        { uid: userId },
        { 
          $set: { balance: userBalance - coursePrice },
          $addToSet: { enrolledCourses: courseId }
        }
      ).session(session);
      
      // Tạo bản ghi mua hàng
      await Purchase.create([{
        userId,
        courseId,
        amount: coursePrice,
        purchasedAt: new Date()
      }], { session });
      
      // Cập nhật thông tin khóa học
      await Course.updateOne(
        { _id: courseId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      ).session(session);

      await session.commitTransaction();
      
      return NextResponse.json({ success: true });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Lỗi khi mua khóa học:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi trong quá trình mua khóa học" },
      { status: 500 }
    );
  }
}
