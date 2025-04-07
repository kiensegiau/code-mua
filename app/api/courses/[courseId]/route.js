import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    console.log("API courses/[courseId] được gọi");
    const { courseId } = params;
    console.log("courseId:", courseId);
    
    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Tạo ObjectId từ courseId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(courseId);
      console.log("ObjectId:", objectId);
    } catch (idError) {
      console.error("Lỗi khi chuyển đổi ID:", idError);
      return NextResponse.json(
        { error: "ID khóa học không hợp lệ", details: idError.message },
        { status: 400 }
      );
    }
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Kết nối đến database elearning
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    console.log("Đã kết nối đến database elearning");
    
    // Truy cập các collections trong hocmai
    const coursesCollection = hocmaiDb.collection('courses');
    const courseContentsCollection = hocmaiDb.collection('courseContents');
    
    // Truy cập các collections trong elearning
    const elearningCoursesCollection = elearningDb.collection('courses');
    const elearningContentsCollection = elearningDb.collection('courseContents');
    
    // Tìm khóa học trong database hocmai
    let course = await coursesCollection.findOne({ _id: objectId });
    let courseContent = null;
    let fromElearning = false;
    
    // Log thông tin course nếu tìm thấy
    if (course) {
      console.log("Đã tìm thấy khóa học trong hocmai:", course.title);
      console.log("Thông tin cơ bản khóa học:", {
        id: course._id.toString(),
        title: course.title,
        price: course.price,
        subject: course.subject,
        grade: course.grade
      });
    }
    
    // Nếu không tìm thấy trong hocmai, tìm trong elearning
    if (!course) {
      console.log("Không tìm thấy khóa học trong database hocmai, tìm trong elearning");
      
      // Tìm khóa học trong database elearning
      const elearningCourse = await elearningCoursesCollection.findOne({ _id: objectId });
      
      if (elearningCourse) {
        console.log("Đã tìm thấy khóa học trong database elearning:", elearningCourse.title);
        console.log("Thông tin cơ bản khóa học từ elearning:", {
          id: elearningCourse._id.toString(),
          title: elearningCourse.title,
          price: elearningCourse.price,
          subject: elearningCourse.subject,
          grade: elearningCourse.grade
        });
        course = elearningCourse;
        fromElearning = true;
      }
    }
    
    // Kiểm tra nếu vẫn không tìm thấy khóa học
    if (!course) {
      console.log("Không tìm thấy khóa học với ID:", courseId, "trong cả hai database");
      return NextResponse.json(
        { error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }
    
    console.log("Đã tìm thấy khóa học:", course.title);

    // Tìm nội dung khóa học với nhiều cách khác nhau
    // Mảng các cách tìm kiếm courseContents khác nhau
    const courseIdVariants = [
      courseId,                     // String ID
      objectId,                     // ObjectId
      objectId.toString(),          // String từ ObjectId
      course._id,                   // _id từ course (có thể là ObjectId)
      course._id.toString(),        // String từ _id của course
      course.id                     // id từ course (nếu có)
    ].filter(Boolean); // Lọc bỏ các giá trị null/undefined
    
    console.log("Tìm kiếm courseContents với các ID:", courseIdVariants.map(id => 
      typeof id === 'object' ? id.toString() : id
    ));
    
    // Tìm trong database tương ứng trước
    const primaryDb = fromElearning ? elearningContentsCollection : courseContentsCollection;
    const primaryDbName = fromElearning ? "elearning" : "hocmai";
    
    // Tìm kiếm với nhiều biến thể của ID
    for (const idVariant of courseIdVariants) {
      const content = await primaryDb.findOne({ courseId: idVariant });
      if (content) {
        console.log(`Đã tìm thấy nội dung khóa học trong ${primaryDbName} với ID:`, 
          typeof idVariant === 'object' ? idVariant.toString() : idVariant);
        courseContent = content;
        break;
      }
    }
    
    // Nếu không tìm thấy trong database chính, tìm trong database khác
    if (!courseContent) {
      console.log(`Không tìm thấy nội dung khóa học trong ${primaryDbName}, tìm trong database ${fromElearning ? 'hocmai' : 'elearning'}`);
      const secondaryDb = fromElearning ? courseContentsCollection : elearningContentsCollection;
      const secondaryDbName = fromElearning ? "hocmai" : "elearning";
      
      // Tìm kiếm với nhiều biến thể của ID
      for (const idVariant of courseIdVariants) {
        const content = await secondaryDb.findOne({ courseId: idVariant });
        if (content) {
          console.log(`Đã tìm thấy nội dung khóa học trong ${secondaryDbName} với ID:`, 
            typeof idVariant === 'object' ? idVariant.toString() : idVariant);
          courseContent = content;
          fromElearning = !fromElearning; // Đổi nguồn dữ liệu
          break;
        }
      }
    }
    
    // Log thông tin về nội dung khóa học
    if (courseContent) {
      console.log("Thông tin nội dung khóa học:", {
        courseId: courseContent.courseId,
        chapters: (courseContent.chapters || []).length
      });
      
      if (courseContent.chapters && courseContent.chapters.length > 0) {
        console.log("Danh sách chapters:", courseContent.chapters.map(c => ({
          id: c.id,
          title: c.title,
          lessons: (c.lessons || []).length
        })));
      }
    } else {
      console.log("Không tìm thấy nội dung khóa học trong cả hai database");
    }
    
    // Tìm kiếm bằng cách linh hoạt hơn
    if (!courseContent) {
      console.log("Thử tìm kiếm courseContents không dựa vào courseId");
      
      // Tìm tất cả courseContents và tìm một document có courseId gần giống
      const allHocmaiContents = await courseContentsCollection.find({}).limit(100).toArray();
      console.log(`Có ${allHocmaiContents.length} courseContents trong hocmai`);
      
      const allElearningContents = await elearningContentsCollection.find({}).limit(100).toArray();
      console.log(`Có ${allElearningContents.length} courseContents trong elearning`);
      
      // Log các courseId có trong database để so sánh
      console.log("Các courseId trong hocmai:", allHocmaiContents.map(c => c.courseId).filter(Boolean));
      console.log("Các courseId trong elearning:", allElearningContents.map(c => c.courseId).filter(Boolean));
    }
    
    // Trả về dữ liệu kết hợp
    return NextResponse.json({
      ...course,
      id: course._id.toString(),
      _id: course._id.toString(),
      chapters: courseContent ? courseContent.chapters : [],
      source: fromElearning ? 'elearning' : 'hocmai',
      hasContent: !!courseContent
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy chi tiết khóa học", details: error.message },
      { status: 500 }
    );
  }
} 