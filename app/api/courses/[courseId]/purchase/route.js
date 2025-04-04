import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
import Course from "@/app/_utils/models/Course";
import Purchase from "@/app/_utils/models/Purchase";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  const requestId = `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`💰 [${requestId}] POST /api/courses/${params.courseId}/purchase - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      console.log(`🔒 [${requestId}] Từ chối truy cập: Người dùng chưa đăng nhập [${new Date().toISOString()}]`);
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thực hiện tính năng này" },
        { status: 401 }
      );
    }

    const { courseId } = params;
    const userId = session.user.id;
    
    console.log(`👤 [${requestId}] UserId: ${userId}, CourseId: ${courseId} [${new Date().toISOString()}]`);

    console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
    await connectToDatabase();
    
    console.log(`🔄 [${requestId}] Bắt đầu MongoDB transaction... [${new Date().toISOString()}]`);
    // Bắt đầu transaction
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Tìm thông tin người dùng
      console.log(`🔍 [${requestId}] Đang tìm thông tin người dùng (${userId})... [${new Date().toISOString()}]`);
      const user = await User.findOne({ uid: userId }).session(dbSession);
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin người dùng với ID: ${userId} [${new Date().toISOString()}]`);
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Tìm thông tin khóa học
      console.log(`🔍 [${requestId}] Đang tìm thông tin khóa học (${courseId})... [${new Date().toISOString()}]`);
      const course = await Course.findById(courseId).session(dbSession);
      
      if (!course) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin khóa học với ID: ${courseId} [${new Date().toISOString()}]`);
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      const userBalance = user.balance || 0;
      const coursePrice = course.price || 0;

      console.log(`💳 [${requestId}] Số dư người dùng: ${userBalance}, Giá khóa học: ${coursePrice} [${new Date().toISOString()}]`);

      // Kiểm tra số dư
      if (userBalance < coursePrice) {
        console.log(`❌ [${requestId}] Số dư không đủ: ${userBalance} < ${coursePrice} [${new Date().toISOString()}]`);
        throw new Error("Số dư không đủ để mua khóa học này");
      }

      // Kiểm tra đã mua chưa
      console.log(`🔍 [${requestId}] Kiểm tra đã mua khóa học chưa... [${new Date().toISOString()}]`);
      const existingPurchase = await Purchase.findOne({
        userId: userId,
        courseId: courseId
      }).session(dbSession);
      
      if (existingPurchase) {
        console.log(`❌ [${requestId}] Người dùng đã mua khóa học này rồi [${new Date().toISOString()}]`);
        throw new Error("Bạn đã mua khóa học này rồi");
      }

      // Trừ tiền người dùng
      console.log(`🔄 [${requestId}] Đang trừ tiền người dùng... [${new Date().toISOString()}]`);
      await User.updateOne(
        { uid: userId },
        { 
          $set: { balance: userBalance - coursePrice },
          $addToSet: { enrolledCourses: courseId }
        }
      ).session(dbSession);
      
      // Tạo bản ghi mua hàng
      console.log(`🔄 [${requestId}] Đang tạo bản ghi mua khóa học... [${new Date().toISOString()}]`);
      await Purchase.create([{
        userId,
        courseId,
        amount: coursePrice,
        purchasedAt: new Date()
      }], { session: dbSession });
      
      // Cập nhật thông tin khóa học
      console.log(`🔄 [${requestId}] Đang cập nhật thông tin khóa học... [${new Date().toISOString()}]`);
      await Course.updateOne(
        { _id: courseId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      ).session(dbSession);

      console.log(`✅ [${requestId}] Commit transaction mua khóa học... [${new Date().toISOString()}]`);
      await dbSession.commitTransaction();
      
      console.log(`✅ [${requestId}] Mua khóa học thành công [${new Date().toISOString()}]`);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi trong transaction: ${error.message} [${new Date().toISOString()}]`);
      await dbSession.abortTransaction();
      throw error;
    } finally {
      console.log(`🔄 [${requestId}] Kết thúc MongoDB session [${new Date().toISOString()}]`);
      dbSession.endSession();
    }
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi mua khóa học: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    return NextResponse.json(
      { message: error.message || "Lỗi trong quá trình mua khóa học" },
      { status: 500 }
    );
  }
}
