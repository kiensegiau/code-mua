import connectToDatabase from './mongodb';
import { initModel as initUserModel } from '../_models/user';
import { initModel as initCourseModel } from '../_models/course';
import { initModel as initCourseContentModel } from '../_models/courseContent';
import { initModel as initPurchaseModel } from '../_models/purchase';
import mongoose from 'mongoose';

// Khởi tạo các model
let User;
let Course;
let CourseContent;
let Purchase;

// Chủ động kết nối database trước khi khởi tạo models
const initDb = async () => {
  try {
    await connectToDatabase();
    console.log('Đã kết nối đến database');
    
    // Khởi tạo các model sau khi đã kết nối database
    const [userModel, courseModel, courseContentModel, purchaseModel] = await Promise.all([
      initUserModel(),
      initCourseModel(),
      initCourseContentModel(),
      initPurchaseModel()
    ]);
    
    User = userModel;
    Course = courseModel;
    CourseContent = courseContentModel;
    Purchase = purchaseModel;
    
    console.log('Đã khởi tạo xong các model');
    return true;
  } catch (error) {
    console.error('Lỗi khi khởi tạo database và models:', error);
    return false;
  }
};

// Khởi tạo database khi import file này
initDb();

const GlobalApi = {
  getAllCourseList: async (options = {}) => {
    const { grade, subject, limit: limitCount = 50, page = 1 } = options;

    try {
      await connectToDatabase();
      
      let query = {};
      
      // Thêm các điều kiện lọc
      if (grade) {
        query.grade = grade;
      }

      if (subject) {
        query.subject = subject;
      }

      const courses = await Course.find(query)
        .sort({ updatedAt: -1 })
        .limit(limitCount)
        .skip((page - 1) * limitCount)
        .lean();

      return courses.map(course => ({
        ...course,
        id: course._id.toString()
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
      throw error;
    }
  },

  getUserProfile: async (UserId) => {
    try {
      await connectToDatabase();
      
      const user = await User.findOne({ uid: UserId }).lean();

      if (!user) {
        return null;
      }

      return {
        ...user,
        id: user._id.toString()
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
      ).lean();

      if (!user) {
        return null;
      }

      return {
        ...user,
        id: user._id.toString()
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  },

  purchaseCourse: async (userId, courseId) => {
    try {
      await connectToDatabase();
      
      // Tìm người dùng
      const user = await User.findOne({ uid: userId });
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Tìm khóa học
      const course = await Course.findById(courseId);
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
      const existingPurchase = await Purchase.findOne({ userId, courseId });
      if (existingPurchase) {
        throw new Error("Course already purchased");
      }

      // Sử dụng MongoDB session để đảm bảo tính nhất quán
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Trừ tiền
        user.balance = userBalance - coursePrice;
        
        // Lưu lịch sử mua
        const purchase = new Purchase({
          userId,
          courseId,
          amount: coursePrice,
          purchasedAt: new Date()
        });
        
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
          user.save({ session }),
          purchase.save({ session }),
          course.save({ session })
        ]);
        
        await session.commitTransaction();
        session.endSession();
        
        return true;
      } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      console.error("Lỗi khi mua khóa học:", error);
      throw error;
    }
  },

  enrollCourse: async (userId, courseId) => {
    try {
      await connectToDatabase();
      
      // Tìm khóa học
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      // Nếu là khóa học có phí, chuyển sang flow mua khóa học
      if (course.price > 0) {
        return await GlobalApi.purchaseCourse(userId, courseId);
      }

      // Tìm người dùng
      const user = await User.findOne({ uid: userId });
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Sử dụng MongoDB session để đảm bảo tính nhất quán
      const session = await mongoose.startSession();
      session.startTransaction();

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
          // Kiểm tra xem đã đăng ký chưa
          const alreadyEnrolled = user.enrolledCourses.some(
            c => c.courseId === courseId || c.courseId.toString() === courseId
          );
          
          if (!alreadyEnrolled) {
            user.enrolledCourses.push(courseEnrollment);
          }
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
          user.save({ session }),
          course.save({ session })
        ]);
        
        await session.commitTransaction();
        session.endSession();
        
        return true;
      } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      throw error;
    }
  },

  isUserEnrolled: async (userId, courseId) => {
    try {
      await connectToDatabase();
      
      const user = await User.findOne({ uid: userId }).lean();
      if (!user) {
        return false;
      }
      
      const enrolledCourses = user.enrolledCourses || [];
      return enrolledCourses.some(course => {
        const courseIdStr = typeof course === 'string' ? course : course.courseId.toString();
        return courseIdStr === courseId;
      });
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng ký khóa học:", error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      await connectToDatabase();
      
      // Lấy thông tin khóa học từ collection courses
      const course = await Course.findById(courseId).lean();
      if (!course) {
        return null;
      }
      
      // Lấy nội dung chi tiết từ collection courseContents
      const courseContent = await CourseContent.findOne({ courseId }).lean();
      
      return {
        ...course,
        id: course._id.toString(),
        chapters: courseContent ? courseContent.chapters : []
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      throw error;
    }
  },

  getEnrolledCourses: async (userId) => {
    try {
      await connectToDatabase();
      
      const user = await User.findOne({ uid: userId }).lean();
      if (!user) {
        return [];
      }
      
      const enrolledCourses = user.enrolledCourses || [];
      if (!enrolledCourses.length) {
        return [];
      }
      
      // Lấy ID của các khóa học đã đăng ký
      const courseIds = enrolledCourses.map(course => 
        typeof course === 'string' ? course : course.courseId
      );
      
      // Lấy thông tin chi tiết của các khóa học
      const courses = await Course.find({
        _id: { $in: courseIds }
      }).lean();
      
      // Kết hợp thông tin khóa học với thông tin đăng ký
      return courses.map(course => {
        const courseInfo = enrolledCourses.find(c => {
          const enrolledId = typeof c === 'string' ? c : c.courseId.toString();
          return enrolledId === course._id.toString();
        });
        
        const courseInfoObj = typeof courseInfo === 'string' 
          ? { courseId: courseInfo } 
          : courseInfo;
          
        return {
          ...course,
          id: course._id.toString(),
          enrolledAt: courseInfoObj.enrolledAt || new Date().toISOString(),
          progress: courseInfoObj.progress || 0,
          lastAccessed: courseInfoObj.lastAccessed || null
        };
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
      throw error;
    }
  },

  getLessonData: async (courseId, chapterId, lessonId) => {
    try {
      await connectToDatabase();
      
      // Lấy nội dung chi tiết của khóa học
      const courseContent = await CourseContent.findOne({ courseId }).lean();
      if (!courseContent) {
        return null;
      }
      
      // Tìm chapter theo ID
      const chapter = courseContent.chapters.find(c => c._id.toString() === chapterId);
      if (!chapter) {
        return null;
      }
      
      // Tìm lesson theo ID
      const lesson = chapter.lessons.find(l => l._id.toString() === lessonId);
      if (!lesson) {
        return null;
      }
      
      return {
        ...lesson,
        id: lesson._id.toString()
      };
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học:", error);
      throw error;
    }
  },

  getChapterLessons: async (courseId, chapterId) => {
    try {
      await connectToDatabase();
      
      // Lấy nội dung chi tiết của khóa học
      const courseContent = await CourseContent.findOne({ courseId }).lean();
      if (!courseContent) {
        return [];
      }
      
      // Tìm chapter theo ID
      const chapter = courseContent.chapters.find(c => c._id.toString() === chapterId);
      if (!chapter) {
        return [];
      }
      
      return chapter.lessons.map(lesson => ({
        ...lesson,
        id: lesson._id.toString()
      }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học của chương:", error);
      throw error;
    }
  }
};

export default GlobalApi;
