import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    const { courseId } = params;
    
    // Lấy dữ liệu từ request body
    const requestData = await request.json();
    const userId = requestData.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc" },
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
    const purchasesCollection = hocmaiDb.collection('purchases');
    const transactionsCollection = hocmaiDb.collection('transactions');
    
    try {
      // Convert courseId sang ObjectId
      const courseObjectId = new mongoose.Types.ObjectId(courseId);

      // Kiểm tra xem đã mua khóa học chưa
      const existingPurchase = await purchasesCollection.findOne({
        userId: userId,
        courseId: courseId,
        status: { $in: ['completed', 'pending'] }
      });

      if (existingPurchase) {
        return NextResponse.json(
          { error: "Khóa học này đã được mua trước đó" },
          { status: 400 }
        );
      }

      // Lấy thông tin số dư của người dùng
      const user = await usersCollection.findOne({ uid: userId });
      if (!user) {
        return NextResponse.json(
          { error: "Không tìm thấy thông tin người dùng" },
          { status: 404 }
        );
      }
      
      // Kiểm tra người dùng VIP
      const isVip = user.isVip === true && user.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();
      
      // Nếu người dùng VIP, cho phép mua khóa học mà không cần trừ tiền
      if (isVip) {
        // Kiểm tra xem đã đăng ký trong enrollments chưa
        const existingEnrollment = await enrollmentsCollection.findOne({
          userId: userId,
          courseId: courseId,
          status: 'active'
        });
        
        if (existingEnrollment) {
          return NextResponse.json({
            success: true,
            message: "Bạn đã đăng ký khóa học này với tài khoản VIP",
            isVip: true
          });
        }
        
        // Lưu thông tin mua khóa học với người dùng VIP
        const enrollmentData = {
          userId,
          courseId,
          enrolledAt: new Date(),
          progress: 0,
          lastAccessed: new Date(),
          status: 'active',
          paymentStatus: 'vip',
          type: 'vip'
        };
        
        await enrollmentsCollection.insertOne(enrollmentData);
        
        // Cập nhật số người đăng ký khóa học
        await coursesCollection.updateOne(
          { _id: courseObjectId },
          { 
            $addToSet: { enrolledUsers: userId },
            $inc: { enrollments: 1 }
          }
        );
        
        return NextResponse.json({
          success: true,
          message: "Đăng ký khóa học thành công với tài khoản VIP",
          isVip: true
        });
      }
      
      const userBalance = user.balance || 0;

      // Lấy giá của khóa học
      const course = await coursesCollection.findOne({ _id: courseObjectId });
      if (!course) {
        return NextResponse.json(
          { error: "Không tìm thấy khóa học" },
          { status: 404 }
        );
      }
      
      const coursePrice = course.price || 0;

      if (userBalance < coursePrice) {
        return NextResponse.json(
          { error: "Số dư không đủ để mua khóa học này" },
          { status: 400 }
        );
      }
      
      // 1. Trừ tiền và cập nhật ví người dùng
      const userUpdateResult = await usersCollection.updateOne(
        { uid: userId },
        { $set: { balance: userBalance - coursePrice } }
      );

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

      // 6. Cập nhật số người đăng ký của khóa học
      const courseUpdateResult = await coursesCollection.updateOne(
        { _id: courseObjectId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      );

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
