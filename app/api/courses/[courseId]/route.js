import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import Course from "@/app/_models/course";
import CourseContent from "@/app/_models/courseContent";

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    
    await connectToDatabase();
    
    // Lấy thông tin cơ bản của khóa học
    const course = await Course.findById(courseId).lean();
    
    if (!course) {
      return NextResponse.json(
        { error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    // Lấy nội dung chi tiết của khóa học
    const courseContent = await CourseContent.findOne({ courseId }).lean();
    
    // Trả về dữ liệu kết hợp
    return NextResponse.json({
      ...course,
      id: course._id.toString(),
      _id: undefined,
      chapters: courseContent ? courseContent.chapters : [],
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy chi tiết khóa học" },
      { status: 500 }
    );
  }
} 