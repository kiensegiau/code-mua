import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    
    // Kết nối đến database
    await connectToDatabase();
    
    // Tạo ObjectId từ courseId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(courseId);
    } catch (idError) {
      return NextResponse.json(
        { error: "ID khóa học không hợp lệ", details: idError.message, status: "error" },
        { status: 400 }
      );
    }
    
    // Kết nối đến cả hai database
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    
    // Projection để chỉ lấy các fields cần thiết
    const courseProjection = {
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
    
    const contentProjection = {
      _id: 1,
      courseId: 1,
      chapters: 1
    };
    
    // Truy cập các collections trong cả hai database
    const hocmaiCoursesCollection = hocmaiDb.collection('courses');
    const hocmaiContentsCollection = hocmaiDb.collection('courseContents');
    const elearningCoursesCollection = elearningDb.collection('courses');
    const elearningContentsCollection = elearningDb.collection('courseContents');
    
    // Tìm khóa học từ cả hai database song song với projection
    const [hocmaiCourse, elearningCourse] = await Promise.all([
      hocmaiCoursesCollection.findOne({ _id: objectId }, { projection: courseProjection }),
      elearningCoursesCollection.findOne({ _id: objectId }, { projection: courseProjection })
    ]);
    
    // Chọn source phù hợp
    let course = null;
    let source = null;
    
    if (hocmaiCourse) {
      course = hocmaiCourse;
      source = 'hocmai';
    } else if (elearningCourse) {
      course = elearningCourse;
      source = 'elearning';
    }
    
    // Kiểm tra nếu không tìm thấy khóa học
    if (!course) {
      return NextResponse.json(
        { error: "Không tìm thấy khóa học", status: "error" },
        { status: 404 }
      );
    }
    
    // Tìm nội dung khóa học từ database phù hợp
    const contentCollection = source === 'hocmai' ? hocmaiContentsCollection : elearningContentsCollection;
    const courseContent = await contentCollection.findOne(
      { courseId: objectId },
      { projection: contentProjection }
    );
    
    // Định dạng dữ liệu trả về
    const formattedCourse = {
      id: course._id.toString(),
      _id: course._id.toString(),
      title: course.title || "Không có tiêu đề",
      description: course.description || "",
      imageUrl: course.imageUrl || course.coverImage || course.thumbnail || "/images/course-default.jpg",
      thumbnail: course.thumbnail || course.imageUrl || course.coverImage || "/images/course-default.jpg",
      subject: course.subject || "Khác",
      grade: course.grade || "Khác",
      price: course.price || 0,
      chapters: courseContent ? (courseContent.chapters || []) : [],
      source: source,
      hasContent: !!courseContent && courseContent.chapters && courseContent.chapters.length > 0,
      updatedAt: course.updatedAt || course.createdAt || new Date()
    };
    
    // Trả về kết quả trong định dạng đồng nhất với các API khác
    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy chi tiết khóa học", details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 