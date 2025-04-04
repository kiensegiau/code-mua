import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import Course from "@/app/_utils/models/Course";

export async function GET(request, { params }) {
  try {
    const { courseId } = params;

    await connectToDatabase();

    // Lấy thông tin khóa học từ MongoDB
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    // Trả về danh sách chương trong khóa học
    return NextResponse.json(course.chapters || []);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi lấy danh sách chương" },
      { status: 500 }
    );
  }
} 