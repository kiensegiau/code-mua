import connectToDatabase from './mongodb';
import User from './models/User';
import Course from './models/Course';
import Purchase from './models/Purchase';
import mongoose from 'mongoose';

const GlobalMongoApi = {
  getAllCourseList: async (options = {}) => {
    const { grade, subject, limit: limitCount = 50, page = 1 } = options;

    try {
      await connectToDatabase();
      
      // Xây dựng query dựa trên filter
      let query = {};
      
      if (grade) {
        query.grade = grade;
      }
      
      if (subject) {
        query.subject = subject;
      }
      
      // Thực hiện truy vấn với sắp xếp và phân trang
      const courses = await Course
        .find(query)
        .sort({ updatedAt: -1 })
        .limit(limitCount)
        .skip((page - 1) * limitCount);
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      return courses.map(course => ({
        id: course._id.toString(), 
        ...course.toObject()
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
      throw error;
    }
  },

  getUserProfile: async (UserId) => {
    try {
      await connectToDatabase();
      
      const user = await User.findOne({ uid: UserId });
      
      if (!user) {
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      return {
        id: user._id.toString(),
        ...user.toObject()
      };
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
      throw error;
    }
  },

  updateUserProfile: async (UserId, updatedData) => {
    try {
      await connectToDatabase();
      
      const user = await User.findOneAndUpdate(
        { uid: UserId },
        { $set: updatedData },
        { new: true }
      );
      
      if (!user) {
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      return {
        id: user._id.toString(),
        ...user.toObject()
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      await connectToDatabase();
      
      const course = await Course.findById(courseId);
      
      if (!course) {
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      return {
        id: course._id.toString(),
        ...course.toObject()
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      throw error;
    }
  },

  purchaseCourse: async (userId, courseId) => {
    let session;
    try {
      await connectToDatabase();
      session = await mongoose.startSession();
      session.startTransaction();
      
      const user = await User.findOne({ uid: userId }).session(session);
      
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      
      const course = await Course.findById(courseId).session(session);
      
      if (!course) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }
      
      const userBalance = user.balance || 0;
      const coursePrice = course.price || 0;
      
      // Kiểm tra số dư
      if (userBalance < coursePrice) {
        throw new Error("Insufficient balance");
      }
      
      // Kiểm tra đã mua chưa
      const existingPurchase = await Purchase.findOne({
        userId: userId,
        courseId: courseId
      }).session(session);
      
      if (existingPurchase) {
        throw new Error("Course already purchased");
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
      return true;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      }
      console.error("Lỗi khi mua khóa học:", error);
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  },

  enrollCourse: async (userId, courseId) => {
    try {
      await connectToDatabase();
      
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }
      
      // Nếu là khóa học có phí, chuyển sang flow mua khóa học
      if (course.price > 0) {
        return await GlobalMongoApi.purchaseCourse(userId, courseId);
      }
      
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Tìm user
        const user = await User.findOne({ uid: userId }).session(session);
        
        if (!user) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }
        
        // Cập nhật thông tin người dùng
        await User.updateOne(
          { uid: userId },
          { $addToSet: { enrolledCourses: courseId } }
        ).session(session);
        
        // Cập nhật thông tin khóa học
        await Course.updateOne(
          { _id: courseId },
          { 
            $addToSet: { enrolledUsers: userId },
            $inc: { enrollments: 1 }
          }
        ).session(session);
        
        await session.commitTransaction();
        return true;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      throw error;
    }
  },

  // Thêm các method khác tương tự như GlobalApi...
};

export default GlobalMongoApi; 