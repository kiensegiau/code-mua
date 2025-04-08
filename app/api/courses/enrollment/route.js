import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    console.log("API lấy danh sách khóa học đã đăng ký được gọi");
    
    // Lấy userId từ query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    
    console.log("userId từ query params:", userId);
    
    if (!userId) {
      console.log("Lỗi: userId không được cung cấp");
      return NextResponse.json(
        { error: 'userId là bắt buộc', status: "error" },
        { status: 400 }
      );
    }

    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Kết nối đến database elearning
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    console.log("Đã kết nối đến database elearning");
    
    // Truy cập các collections
    const usersCollection = hocmaiDb.collection('users');
    const enrollmentsCollection = hocmaiDb.collection('enrollments');
    const hocmaiCoursesCollection = hocmaiDb.collection('courses');
    const elearningCoursesCollection = elearningDb.collection('courses');
    
    try {
      // 1. Lấy danh sách đăng ký từ enrollments collection
      console.log("Lấy danh sách đăng ký từ enrollments collection");
      const enrollments = await enrollmentsCollection.find({
        userId: userId,
        status: 'active'
      }).toArray();
      
      console.log(`Tìm thấy ${enrollments.length} đăng ký từ collection enrollments`);
      
      // 2. Lấy thông tin user để kiểm tra enrolledCourses (legacy)
      console.log("Lấy thông tin user từ collection users");
      const user = await usersCollection.findOne({ uid: userId });
      
      let legacyEnrollments = [];
      if (user && user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        console.log("Xử lý enrolledCourses từ user (legacy)");
        legacyEnrollments = user.enrolledCourses.map(course => {
          // Chuẩn hóa dữ liệu course
          if (typeof course === 'string') {
            return {
              courseId: course,
              enrolledAt: new Date(),
              progress: 0,
              type: 'legacy'
            };
          } else {
            return {
              courseId: course.courseId || course._id,
              enrolledAt: course.enrolledAt || new Date(),
              progress: course.progress || 0,
              type: 'legacy'
            };
          }
        });
      }
      
      // 3. Gộp danh sách đăng ký từ cả hai nguồn
      const allEnrollmentIds = [
        ...enrollments.map(e => e.courseId),
        ...legacyEnrollments.map(e => e.courseId)
      ];
      
      console.log(`Tổng số khóa học đã đăng ký: ${allEnrollmentIds.length}`);
      
      // Loại bỏ trùng lặp
      const uniqueCourseIds = [...new Set(allEnrollmentIds.map(id => id.toString()))];
      console.log(`Số lượng khóa học đã đăng ký (đã loại bỏ trùng lặp): ${uniqueCourseIds.length}`);
      
      // Phân trang dữ liệu
      const totalEnrollments = uniqueCourseIds.length;
      const paginatedCourseIds = uniqueCourseIds.slice((page - 1) * limit, page * limit);
      
      // Chuyển các courseId thành ObjectId nếu có thể
      const courseObjectIds = paginatedCourseIds.map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (e) {
          console.log(`Không thể chuyển đổi ID ${id} thành ObjectId:`, e.message);
          return id;
        }
      });

      // 4. Lấy thông tin cơ bản của khóa học từ cả hai database song song
      console.log("Lấy thông tin khóa học từ cả hai database song song");
      const projection = {
        _id: 1,
        title: 1,
        description: 1,
        imageUrl: 1,
        coverImage: 1,
        thumbnail: 1,
        subject: 1,
        grade: 1,
        price: 1,
        updatedAt: 1,
        createdAt: 1
      };
      
      const [hocmaiCourses, elearningCourses] = await Promise.all([
        hocmaiCoursesCollection.find(
          { _id: { $in: courseObjectIds } },
          { projection }
        ).toArray(),
        elearningCoursesCollection.find(
          { _id: { $in: courseObjectIds } },
          { projection }
        ).toArray()
      ]);
      
      const allCourses = [
        ...hocmaiCourses.map(course => ({ ...course, source: 'hocmai' })),
        ...elearningCourses.map(course => ({ ...course, source: 'elearning' }))
      ];
      
      console.log(`Tìm thấy ${allCourses.length} khóa học từ cả hai database`);
      
      // 5. Kết hợp thông tin đăng ký với thông tin khóa học
      const enrolledCourses = paginatedCourseIds.map(courseId => {
        // Tìm thông tin chi tiết khóa học (ưu tiên từ hocmai trước)
        const courseDetail = allCourses.find(c => 
          c._id.toString() === courseId.toString()
        );
        
        // Tìm thông tin đăng ký từ enrollment collection
        const enrollmentInfo = enrollments.find(e => 
          e.courseId.toString() === courseId.toString()
        );
        
        // Tìm thông tin đăng ký từ legacy
        const legacyInfo = legacyEnrollments.find(e => 
          e.courseId.toString() === courseId.toString()
        );
        
        // Ưu tiên sử dụng thông tin từ enrollment collection
        const enrollmentData = enrollmentInfo || legacyInfo || { 
          enrolledAt: new Date(),
          progress: 0
        };

        // Xác định xem khóa học thuộc database nào
        const source = courseDetail ? courseDetail.source : 'unknown';
        
        // Nếu không tìm thấy thông tin khóa học
        if (!courseDetail) {
          console.log(`Không tìm thấy thông tin cho khóa học có ID ${courseId}`);
          return {
            id: courseId,
            courseId: courseId,
            title: "Khóa học không tồn tại",
            description: "Không tìm thấy thông tin khóa học",
            enrolledAt: enrollmentData.enrolledAt,
            progress: enrollmentData.progress || 0,
            status: enrollmentInfo ? enrollmentInfo.status : 'active',
            type: (enrollmentInfo && enrollmentInfo.paymentStatus === 'paid') ? 'purchased' : 'free',
            found: false
          };
        }
        
        return {
          id: courseId,
          courseId: courseId,
          _id: courseDetail._id.toString(),
          title: courseDetail.title || "Không có tiêu đề",
          description: courseDetail.description || "",
          imageUrl: courseDetail.imageUrl || courseDetail.coverImage || courseDetail.thumbnail || "/images/course-default.jpg",
          thumbnail: courseDetail.thumbnail || courseDetail.imageUrl || courseDetail.coverImage || "/images/course-default.jpg",
          subject: courseDetail.subject || "Khác",
          grade: courseDetail.grade || "Khác",
          enrolledAt: enrollmentData.enrolledAt,
          progress: enrollmentData.progress || 0,
          lastAccessed: enrollmentData.lastAccessed || enrollmentData.enrolledAt,
          status: enrollmentInfo ? enrollmentInfo.status : 'active',
          type: (enrollmentInfo && enrollmentInfo.paymentStatus === 'paid') ? 'purchased' : 'free',
          price: courseDetail.price || 0,
          source: source,
          found: true,
          updatedAt: courseDetail.updatedAt || courseDetail.createdAt || new Date()
        };
      });
      
      console.log(`Đã kết hợp thông tin cho ${enrolledCourses.length} khóa học`);
      
      // Chỉ trả về các khóa học hợp lệ (đã tìm thấy thông tin)
      const validEnrolledCourses = enrolledCourses.filter(course => course.found);
      console.log(`Số lượng khóa học hợp lệ: ${validEnrolledCourses.length}`);
      
      return NextResponse.json({
        courses: validEnrolledCourses,
        pagination: {
          total: totalEnrollments,
          page,
          limit,
          totalPages: Math.ceil(totalEnrollments / limit)
        },
        status: "success"
      });
    } catch (dbError) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", dbError);
      return NextResponse.json(
        { error: "Lỗi khi truy vấn cơ sở dữ liệu", details: dbError.message, status: "error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lỗi xử lý yêu cầu:", error);
    return NextResponse.json(
      { error: "Lỗi server", details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 