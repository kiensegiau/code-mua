import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    console.log("API mua khóa học được gọi");
    const { courseId } = params;
    console.log("courseId:", courseId);
    
    // Lấy dữ liệu từ request body
    const requestData = await request.json();
    const userId = requestData.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc" },
        { status: 400 }
      );
    }
    
    console.log("userId từ request:", userId);

    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const coursesCollection = hocmaiDb.collection('courses');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    const purchasesCollection = hocmaiDb.collection('purchases');
    const transactionsCollection = hocmaiDb.collection('transactions');
    
    try {
      // Convert courseId sang ObjectId
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      console.log("courseObjectId:", courseObjectId);

      // Kiểm tra xem đã mua khóa học chưa
      const existingPurchase = await purchasesCollection.findOne({
        userId: userId,
        courseId: courseId,
        status: { $in: ['completed', 'pending'] }
      });

      if (existingPurchase) {
        console.log("Người dùng đã mua khóa học này rồi");
        return NextResponse.json(
          { error: "Khóa học này đã được mua trước đó" },
          { status: 400 }
        );
      }

      // Lấy thông tin số dư của người dùng
      const user = await usersCollection.findOne({ uid: userId });
      if (!user) {
        console.log("Không tìm thấy người dùng với ID:", userId);
        return NextResponse.json(
          { error: "Không tìm thấy thông tin người dùng" },
          { status: 404 }
        );
      }
      
      console.log("Đã tìm thấy người dùng:", user.email || user.uid);
      const userBalance = user.balance || 0;
      console.log("Số dư người dùng:", userBalance);

      // Lấy giá của khóa học
      const course = await coursesCollection.findOne({ _id: courseObjectId });
      if (!course) {
        console.log("Không tìm thấy khóa học với ID:", courseId);
        return NextResponse.json(
          { error: "Không tìm thấy khóa học" },
          { status: 404 }
        );
      }
      
      console.log("Đã tìm thấy khóa học:", course.title);
      const coursePrice = course.price || 0;
      console.log("Giá khóa học:", coursePrice);

      if (userBalance < coursePrice) {
        console.log("Số dư không đủ. Cần:", coursePrice, "Hiện có:", userBalance);
        return NextResponse.json(
          { error: "Số dư không đủ để mua khóa học này" },
          { status: 400 }
        );
      }

      console.log("Bắt đầu mua khóa học - không dùng transaction");
      
      // 1. Trừ tiền và cập nhật ví người dùng
      const userUpdateResult = await usersCollection.updateOne(
        { uid: userId },
        { $set: { balance: userBalance - coursePrice } }
      );
      console.log("Đã cập nhật số dư người dùng:", userUpdateResult.acknowledged);

      // 2. Lưu thông tin mua khóa học
      const purchaseData = {
        userId: userId,
        courseId: courseId,
        amount: coursePrice,
        purchasedAt: new Date(),
        status: 'completed',
        paymentMethod: 'wallet',
        transactionId: new mongoose.Types.ObjectId().toString()
      };
      
      const purchaseResult = await purchasesCollection.insertOne(purchaseData);
      console.log("Đã lưu thông tin mua khóa học:", purchaseResult.acknowledged);
      
      // 3. Lưu lịch sử giao dịch
      const transactionData = {
        userId: userId,
        type: 'purchase',
        amount: -coursePrice,
        balance: userBalance - coursePrice,
        description: `Mua khóa học: ${course.title}`,
        reference: {
          type: 'course',
          id: courseId
        },
        createdAt: new Date()
      };
      
      const transactionResult = await transactionsCollection.insertOne(transactionData);
      console.log("Đã lưu lịch sử giao dịch:", transactionResult.acknowledged);

      // 4. Thêm khóa học vào danh sách đã đăng ký của người dùng
      const enrollmentData = {
        userId: userId,
        courseId: courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null,
        status: 'active',
        paymentStatus: 'paid',
        paymentAmount: coursePrice
      };
      
      const enrollmentResult = await enrollmentsCollection.insertOne(enrollmentData);
      console.log("Đã thêm dữ liệu vào collection enrollments:", enrollmentResult.acknowledged);
      
      // 5. Cập nhật enrolledCourses trong user (cho backwards compatibility)
      const courseEnrollment = {
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        lastAccessed: null
      };
      
      const enrolledResult = await usersCollection.updateOne(
        { uid: userId },
        { $push: { enrolledCourses: courseEnrollment } }
      );
      console.log("Đã cập nhật enrolledCourses trong user:", enrolledResult.acknowledged);

      // 6. Cập nhật số người đăng ký của khóa học
      const courseUpdateResult = await coursesCollection.updateOne(
        { _id: courseObjectId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      );
      console.log("Đã cập nhật enrolledUsers và enrollments trong course:", courseUpdateResult.acknowledged);

      return NextResponse.json({ 
        success: true,
        message: "Mua khóa học thành công"
      });
    } catch (idError) {
      console.error("Lỗi khi xử lý ID:", idError);
      return NextResponse.json(
        { error: "ID không hợp lệ", details: idError.message },
        { status: 400 }
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
