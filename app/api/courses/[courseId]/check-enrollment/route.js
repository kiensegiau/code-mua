import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

// Cache cho thông tin người dùng và quyền truy cập với giới hạn kích thước
class LRUCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // Lấy giá trị và cập nhật vị trí (đưa lên đầu)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // Nếu đã tồn tại, xóa trước để cập nhật vị trí
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Kiểm tra kích thước cache
    else if (this.cache.size >= this.maxSize) {
      // Xóa entry cũ nhất (phần tử đầu tiên trong Map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    // Thêm entry mới
    this.cache.set(key, value);
  }

  delete(key) {
    this.cache.delete(key);
  }

  // Dọn dẹp các mục hết hạn
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key);
      }
    }
  }
}

// Khởi tạo cache với giới hạn 5000 mục (có thể điều chỉnh theo nhu cầu)
const userEnrollmentCache = new LRUCache(5000);

// Duy trì kết nối database để tránh mở kết nối mới mỗi request
let dbConnection = null;
let hocmaiDb = null;
let usersCollection = null;
let enrollmentsCollection = null;

// Hàm khởi tạo kết nối trước
async function initDatabaseConnection() {
  if (!dbConnection) {
    try {
      await connectToDatabase();
      dbConnection = mongoose.connection;
      hocmaiDb = dbConnection.useDb('hocmai', { useCache: true });
      usersCollection = hocmaiDb.collection('users');
      enrollmentsCollection = hocmaiDb.collection('enrollments');
      console.log("Đã khởi tạo kết nối database cho enrollment API");
    } catch (error) {
      console.error("Lỗi khi khởi tạo kết nối database:", error);
      // Reset để thử lại lần sau
      dbConnection = null;
    }
  }
}

// Khởi tạo kết nối ngay khi server khởi động
initDatabaseConnection();

// Chạy dọn dẹp cache mỗi 10 phút
setInterval(() => {
  userEnrollmentCache.cleanup();
}, 10 * 60 * 1000);

// Hàm kiểm tra và khởi tạo lại kết nối database nếu cần
async function ensureDatabaseConnection() {
  if (!dbConnection || !dbConnection.readyState || dbConnection.readyState !== 1) {
    await initDatabaseConnection();
  }
  
  // Nếu vẫn không có kết nối, thử kết nối lại
  if (!dbConnection || !dbConnection.readyState || dbConnection.readyState !== 1) {
    await connectToDatabase();
    dbConnection = mongoose.connection;
    hocmaiDb = dbConnection.useDb('hocmai', { useCache: true });
    usersCollection = hocmaiDb.collection('users');
    enrollmentsCollection = hocmaiDb.collection('enrollments');
  }
}

export async function GET(request, { params }) {
  const startTime = Date.now();
  try {
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc", status: "error" },
        { status: 400 }
      );
    }

    // Tạo cacheKey từ thông tin người dùng và khóa học
    const cacheKey = `${userId}-${courseId}`;
    
    // Kiểm tra cache trước khi truy vấn database
    const cachedEnrollment = userEnrollmentCache.get(cacheKey);
    if (cachedEnrollment) {
      // Kiểm tra xem cache có còn hạn không
      if (cachedEnrollment.expires > Date.now()) {
        console.log(`[CACHE HIT] User: ${userId}, Course: ${courseId}, Time: ${Date.now() - startTime}ms`);
        return NextResponse.json(cachedEnrollment.data);
      }
      // Cache đã hết hạn, xóa khỏi cache
      userEnrollmentCache.delete(cacheKey);
    }

    // Đảm bảo có kết nối database
    await ensureDatabaseConnection();
    
    if (!usersCollection || !enrollmentsCollection) {
      throw new Error("Không thể kết nối đến collections");
    }
    
    // Lấy thông tin user
    const user = await usersCollection.findOne({ uid: userId });
    
    // Kiểm tra người dùng VIP
    if (user && user.isVip === true) {
      const currentDate = new Date();
      // Kiểm tra nếu người dùng đang VIP và VIP chưa hết hạn
      if (user.vipExpiresAt && new Date(user.vipExpiresAt) > currentDate) {
        const responseData = {
          enrolled: true,
          enrollment: {
            enrolledAt: currentDate,
            progress: 0,
            lastAccessed: currentDate,
            type: 'vip'
          },
          userId,
          courseId,
          status: "success",
          isVip: true
        };
        
        // Thời gian cache ngắn hơn cho người dùng VIP để đảm bảo cập nhật kịp thời
        // khi trạng thái VIP thay đổi
        userEnrollmentCache.set(cacheKey, {
          data: responseData,
          expires: Date.now() + 10 * 60 * 1000, // 10 phút cho VIP
          userData: {
            isVip: true,
            vipExpiresAt: user.vipExpiresAt
          }
        });
        
        console.log(`[VIP USER] User: ${userId}, Course: ${courseId}, Time: ${Date.now() - startTime}ms`);
        return NextResponse.json(responseData);
      }
    }
    
    // Kiểm tra trong collection enrollments
    let isEnrolled = false;
    let enrollmentInfo = null;
    
    // Thử chuyển đổi courseId thành ObjectId nếu có thể
    let courseObjectId;
    try {
      courseObjectId = new mongoose.Types.ObjectId(courseId);
    } catch (error) {
      courseObjectId = courseId;
    }
    
    // Tìm trong enrollments collection - thêm index để cải thiện hiệu suất
    const enrollment = await enrollmentsCollection.findOne({
      userId: userId,
      courseId: courseObjectId, 
      status: 'active'
    });
    
    if (enrollment) {
      isEnrolled = true;
      enrollmentInfo = {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress || 0,
        lastAccessed: enrollment.lastAccessed,
        type: enrollment.paymentStatus === 'paid' ? 'purchased' : 'free'
      };
    } else {
      // Kiểm tra trong user.enrolledCourses (cách cũ)
      if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        // Tìm kiếm courseId trong danh sách khóa học đã đăng ký
        const enrolledCourse = user.enrolledCourses.find(course => {
          if (typeof course === 'string') {
            return course === courseId;
          } else if (course.courseId) {
            return course.courseId.toString() === courseId;
          } else if (course._id) {
            return course._id.toString() === courseId;
          }
          return false;
        });
        
        if (enrolledCourse) {
          isEnrolled = true;
          enrollmentInfo = {
            enrolledAt: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.enrolledAt || new Date()),
            progress: typeof enrolledCourse === 'string' ? 0 : (enrolledCourse.progress || 0),
            lastAccessed: typeof enrolledCourse === 'string' ? new Date() : (enrolledCourse.lastAccessed || enrolledCourse.enrolledAt || new Date()),
            type: 'legacy'
          };
        }
      }
    }
    
    const responseData = {
      enrolled: isEnrolled,
      enrollment: enrollmentInfo,
      userId,
      courseId,
      status: "success"
    };
    
    // Lưu kết quả vào cache (30 phút cho người dùng thường)
    // Thời gian cache dài hơn cho những người không phải VIP
    userEnrollmentCache.set(cacheKey, {
      data: responseData,
      expires: Date.now() + 30 * 60 * 1000, // 30 phút cho người dùng thường
      userData: user ? {
        isVip: user.isVip || false,
        vipExpiresAt: user.vipExpiresAt || null
      } : null
    });
    
    console.log(`[DB QUERY] User: ${userId}, Course: ${courseId}, Time: ${Date.now() - startTime}ms`);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`Lỗi khi kiểm tra đăng ký (${Date.now() - startTime}ms):`, error);
    return NextResponse.json(
      { error: "Lỗi khi kiểm tra đăng ký", details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 