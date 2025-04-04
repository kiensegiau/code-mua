import connectToDatabase from './mongodb';
import mongoose from 'mongoose';

// Kiểm tra xem code đang chạy ở phía server hay client
const isServer = typeof window === 'undefined';

// Định nghĩa hàm tạo requestId
const createRequestId = (method) => `api_${method}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Import models chỉ nếu đang ở server-side
let User, Course, Purchase;
if (isServer) {
  // Dynamic imports để tránh lỗi ở client-side
  User = require('./models/User').default;
  Course = require('./models/Course').default;
  Purchase = require('./models/Purchase').default;
}

// Tạo mock function trả về rejected promise với message phù hợp
const createClientSideErrorFunction = (methodName) => async (...args) => {
  console.error(`❌ Không thể gọi GlobalMongoApi.${methodName} ở client-side. API MongoDB chỉ nên được gọi qua server API routes.`);
  return Promise.reject(new Error(`GlobalMongoApi.${methodName} chỉ có thể được gọi từ server API routes, không phải từ client-side.`));
};

// Tạo version client-side an toàn với tất cả các phương thức trả về lỗi
const clientSideApi = {
  getAllCourseList: createClientSideErrorFunction('getAllCourseList'),
  getUserProfile: createClientSideErrorFunction('getUserProfile'),
  updateUserProfile: createClientSideErrorFunction('updateUserProfile'),
  getCourseById: createClientSideErrorFunction('getCourseById'),
  purchaseCourse: createClientSideErrorFunction('purchaseCourse'),
  enrollCourse: createClientSideErrorFunction('enrollCourse'),
  getEnrolledCourses: createClientSideErrorFunction('getEnrolledCourses'),
  isUserEnrolled: createClientSideErrorFunction('isUserEnrolled'),
};

// Phiên bản server-side thực hiện kết nối với MongoDB
const serverSideApi = {
  getAllCourseList: async (options = {}) => {
    const requestId = createRequestId('getAllCourseList');
    console.log(`📋 [${requestId}] getAllCourseList - Bắt đầu [${new Date().toISOString()}]`, options);
    
    const { grade, subject, limit: limitCount = 50, page = 1 } = options;

    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      // Xây dựng query dựa trên filter
      let query = {};
      
      if (grade) {
        query.grade = grade;
      }
      
      if (subject) {
        query.subject = subject;
      }
      
      console.log(`🔍 [${requestId}] Query tìm kiếm khóa học: ${JSON.stringify(query)} [${new Date().toISOString()}]`);
      
      // Thực hiện truy vấn với sắp xếp và phân trang
      const courses = await Course
        .find(query)
        .sort({ updatedAt: -1 })
        .limit(limitCount)
        .skip((page - 1) * limitCount);
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      const result = courses.map(course => ({
        id: course._id.toString(), 
        ...course.toObject()
      }));

      console.log(`✅ [${requestId}] getAllCourseList thành công - Tìm thấy ${result.length} khóa học [${new Date().toISOString()}]`);
      return result;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi lấy danh sách khóa học: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },

  getUserProfile: async (UserId) => {
    const requestId = createRequestId('getUserProfile');
    console.log(`👤 [${requestId}] getUserProfile - Bắt đầu với userId: ${UserId} [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔍 [${requestId}] Tìm kiếm người dùng với uid: ${UserId} [${new Date().toISOString()}]`);
      const user = await User.findOne({ uid: UserId });
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy người dùng với uid: ${UserId} [${new Date().toISOString()}]`);
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      const result = {
        id: user._id.toString(),
        ...user.toObject()
      };
      
      console.log(`✅ [${requestId}] getUserProfile thành công [${new Date().toISOString()}]`);
      return result;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi tìm kiếm người dùng: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },

  updateUserProfile: async (UserId, updatedData) => {
    const requestId = createRequestId('updateUserProfile');
    console.log(`✏️ [${requestId}] updateUserProfile - Bắt đầu cập nhật thông tin người dùng ${UserId} [${new Date().toISOString()}]`);
    console.log(`📝 [${requestId}] Dữ liệu cập nhật: ${JSON.stringify(updatedData)} [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔄 [${requestId}] Cập nhật thông tin người dùng với uid: ${UserId} [${new Date().toISOString()}]`);
      const user = await User.findOneAndUpdate(
        { uid: UserId },
        { $set: updatedData },
        { new: true }
      );
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy người dùng với uid: ${UserId} [${new Date().toISOString()}]`);
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      const result = {
        id: user._id.toString(),
        ...user.toObject()
      };
      
      console.log(`✅ [${requestId}] updateUserProfile thành công [${new Date().toISOString()}]`);
      return result;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi cập nhật thông tin người dùng: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    const requestId = createRequestId('getCourseById');
    console.log(`📘 [${requestId}] getCourseById - Bắt đầu với courseId: ${courseId} [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔍 [${requestId}] Tìm kiếm khóa học với id: ${courseId} [${new Date().toISOString()}]`);
      const course = await Course.findById(courseId);
      
      if (!course) {
        console.log(`❓ [${requestId}] Không tìm thấy khóa học với id: ${courseId} [${new Date().toISOString()}]`);
        return null;
      }
      
      // Chuyển đổi định dạng kết quả để tương thích với code cũ
      const result = {
        id: course._id.toString(),
        ...course.toObject()
      };
      
      console.log(`✅ [${requestId}] getCourseById thành công [${new Date().toISOString()}]`);
      return result;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi lấy thông tin khóa học: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },

  purchaseCourse: async (userId, courseId) => {
    const requestId = createRequestId('purchaseCourse');
    console.log(`💰 [${requestId}] purchaseCourse - Bắt đầu mua khóa học ${courseId} cho người dùng ${userId} [${new Date().toISOString()}]`);
    
    let session;
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔄 [${requestId}] Bắt đầu MongoDB session... [${new Date().toISOString()}]`);
      session = await mongoose.startSession();
      session.startTransaction();
      
      console.log(`🔍 [${requestId}] Tìm kiếm thông tin người dùng với uid: ${userId} [${new Date().toISOString()}]`);
      const user = await User.findOne({ uid: userId }).session(session);
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin người dùng với uid: ${userId} [${new Date().toISOString()}]`);
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      
      console.log(`🔍 [${requestId}] Tìm kiếm thông tin khóa học với id: ${courseId} [${new Date().toISOString()}]`);
      const course = await Course.findById(courseId).session(session);
      
      if (!course) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin khóa học với id: ${courseId} [${new Date().toISOString()}]`);
        throw new Error("Không tìm thấy thông tin khóa học");
      }
      
      const userBalance = user.balance || 0;
      const coursePrice = course.price || 0;
      
      console.log(`💳 [${requestId}] Số dư người dùng: ${userBalance}, Giá khóa học: ${coursePrice} [${new Date().toISOString()}]`);
      
      // Kiểm tra số dư
      if (userBalance < coursePrice) {
        console.log(`❌ [${requestId}] Số dư không đủ: ${userBalance} < ${coursePrice} [${new Date().toISOString()}]`);
        throw new Error("Insufficient balance");
      }
      
      // Kiểm tra đã mua chưa
      console.log(`🔍 [${requestId}] Kiểm tra đã mua khóa học chưa... [${new Date().toISOString()}]`);
      const existingPurchase = await Purchase.findOne({
        userId: userId,
        courseId: courseId
      }).session(session);
      
      if (existingPurchase) {
        console.log(`❌ [${requestId}] Người dùng đã mua khóa học này rồi [${new Date().toISOString()}]`);
        throw new Error("Course already purchased");
      }
      
      // Trừ tiền người dùng
      console.log(`🔄 [${requestId}] Đang trừ tiền người dùng... [${new Date().toISOString()}]`);
      await User.updateOne(
        { uid: userId },
        { 
          $set: { balance: userBalance - coursePrice },
          $addToSet: { enrolledCourses: courseId }
        }
      ).session(session);
      
      // Tạo bản ghi mua hàng
      console.log(`🔄 [${requestId}] Đang tạo bản ghi mua hàng... [${new Date().toISOString()}]`);
      await Purchase.create([{
        userId,
        courseId,
        amount: coursePrice,
        purchasedAt: new Date()
      }], { session });
      
      // Cập nhật thông tin khóa học
      console.log(`🔄 [${requestId}] Đang cập nhật thông tin khóa học... [${new Date().toISOString()}]`);
      await Course.updateOne(
        { _id: courseId },
        { 
          $addToSet: { enrolledUsers: userId },
          $inc: { enrollments: 1 }
        }
      ).session(session);
      
      console.log(`✅ [${requestId}] Commit transaction mua khóa học... [${new Date().toISOString()}]`);
      await session.commitTransaction();
      console.log(`✅ [${requestId}] purchaseCourse thành công [${new Date().toISOString()}]`);
      return true;
    } catch (error) {
      if (session) {
        console.error(`❌ [${requestId}] Lỗi trong transaction: ${error.message} [${new Date().toISOString()}]`);
        await session.abortTransaction();
      }
      console.error(`❌ [${requestId}] Lỗi khi mua khóa học: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    } finally {
      if (session) {
        console.log(`🔄 [${requestId}] Kết thúc MongoDB session [${new Date().toISOString()}]`);
        session.endSession();
      }
    }
  },

  enrollCourse: async (userId, courseId) => {
    const requestId = createRequestId('enrollCourse');
    console.log(`📝 [${requestId}] enrollCourse - Bắt đầu đăng ký khóa học ${courseId} cho người dùng ${userId} [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔍 [${requestId}] Tìm kiếm thông tin khóa học... [${new Date().toISOString()}]`);
      const course = await Course.findById(courseId);
      
      if (!course) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin khóa học với id: ${courseId} [${new Date().toISOString()}]`);
        throw new Error("Không tìm thấy thông tin khóa học");
      }
      
      // Nếu là khóa học có phí, chuyển sang flow mua khóa học
      if (course.price > 0) {
        console.log(`💰 [${requestId}] Khóa học có phí, chuyển sang flow mua khóa học [${new Date().toISOString()}]`);
        return await serverSideApi.purchaseCourse(userId, courseId);
      }
      
      console.log(`🔄 [${requestId}] Bắt đầu MongoDB session... [${new Date().toISOString()}]`);
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Tìm user
        console.log(`🔍 [${requestId}] Tìm kiếm thông tin người dùng... [${new Date().toISOString()}]`);
        const user = await User.findOne({ uid: userId }).session(session);
        
        if (!user) {
          console.log(`❓ [${requestId}] Không tìm thấy thông tin người dùng với uid: ${userId} [${new Date().toISOString()}]`);
          throw new Error("Không tìm thấy thông tin người dùng");
        }
        
        // Cập nhật thông tin người dùng
        console.log(`🔄 [${requestId}] Cập nhật danh sách khóa học đã đăng ký cho người dùng... [${new Date().toISOString()}]`);
        await User.updateOne(
          { uid: userId },
          { $addToSet: { enrolledCourses: courseId } }
        ).session(session);
        
        // Cập nhật thông tin khóa học
        console.log(`🔄 [${requestId}] Cập nhật thông tin khóa học... [${new Date().toISOString()}]`);
        await Course.updateOne(
          { _id: courseId },
          { 
            $addToSet: { enrolledUsers: userId },
            $inc: { enrollments: 1 }
          }
        ).session(session);
        
        console.log(`✅ [${requestId}] Commit transaction đăng ký khóa học... [${new Date().toISOString()}]`);
        await session.commitTransaction();
        
        console.log(`✅ [${requestId}] enrollCourse thành công [${new Date().toISOString()}]`);
        return true;
      } catch (error) {
        console.error(`❌ [${requestId}] Lỗi trong transaction: ${error.message} [${new Date().toISOString()}]`);
        await session.abortTransaction();
        throw error;
      } finally {
        console.log(`🔄 [${requestId}] Kết thúc MongoDB session [${new Date().toISOString()}]`);
        session.endSession();
      }
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi đăng ký khóa học: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },
  
  getEnrolledCourses: async (userId) => {
    const requestId = createRequestId('getEnrolledCourses');
    console.log(`📚 [${requestId}] getEnrolledCourses - Bắt đầu lấy danh sách khóa học đã đăng ký cho ${userId} [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔍 [${requestId}] Tìm kiếm thông tin người dùng... [${new Date().toISOString()}]`);
      const user = await User.findOne({ uid: userId });
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin người dùng với uid: ${userId} [${new Date().toISOString()}]`);
        return [];
      }
      
      const enrolledCourseIds = user.enrolledCourses || [];
      console.log(`📊 [${requestId}] Số lượng khóa học đã đăng ký: ${enrolledCourseIds.length} [${new Date().toISOString()}]`);
      
      if (enrolledCourseIds.length === 0) {
        console.log(`ℹ️ [${requestId}] Người dùng chưa đăng ký khóa học nào [${new Date().toISOString()}]`);
        return [];
      }
      
      console.log(`🔍 [${requestId}] Lấy thông tin chi tiết các khóa học... [${new Date().toISOString()}]`);
      const enrolledCourses = await Course.find({
        _id: { $in: enrolledCourseIds }
      });
      
      console.log(`📊 [${requestId}] Số lượng khóa học tìm thấy: ${enrolledCourses.length}/${enrolledCourseIds.length} [${new Date().toISOString()}]`);
      
      // Chuyển đổi định dạng để tương thích với code cũ
      const formattedCourses = enrolledCourses.map(course => ({
        id: course._id.toString(),
        ...course.toObject()
      }));
      
      console.log(`✅ [${requestId}] getEnrolledCourses thành công [${new Date().toISOString()}]`);
      return formattedCourses;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi lấy danh sách khóa học đã đăng ký: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  },
  
  isUserEnrolled: async (userId, courseId) => {
    const requestId = createRequestId('isUserEnrolled');
    console.log(`🔍 [${requestId}] isUserEnrolled - Kiểm tra người dùng ${userId} đã đăng ký khóa học ${courseId} chưa [${new Date().toISOString()}]`);
    
    try {
      console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
      await connectToDatabase();
      
      console.log(`🔍 [${requestId}] Tìm kiếm thông tin người dùng... [${new Date().toISOString()}]`);
      const user = await User.findOne({ uid: userId });
      
      if (!user) {
        console.log(`❓ [${requestId}] Không tìm thấy thông tin người dùng với uid: ${userId} [${new Date().toISOString()}]`);
        return false;
      }
      
      const enrolledCourses = user.enrolledCourses || [];
      const isEnrolled = enrolledCourses.includes(courseId);
      
      console.log(`✅ [${requestId}] isUserEnrolled: ${isEnrolled} [${new Date().toISOString()}]`);
      return isEnrolled;
    } catch (error) {
      console.error(`❌ [${requestId}] Lỗi khi kiểm tra đăng ký khóa học: ${error.message} [${new Date().toISOString()}]`);
      console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
      throw error;
    }
  }
};

// Export API phù hợp tùy thuộc vào môi trường
const GlobalMongoApi = isServer ? serverSideApi : clientSideApi;

export default GlobalMongoApi; 