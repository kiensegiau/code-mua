import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import Course from "@/app/_utils/models/Course";

export async function GET(request, { params }) {
  try {
    const { courseId, chapterId } = params;

    await connectToDatabase();

    // Lấy thông tin khóa học từ MongoDB
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    // Tìm chapter trong mảng chapters của course
    const chapter = course.chapters.find(
      (chapter) => chapter.id === chapterId || chapter._id?.toString() === chapterId
    );

    if (!chapter) {
      return NextResponse.json(
        { error: "Không tìm thấy chương học" },
        { status: 404 }
      );
    }

    // Trả về danh sách bài học trong chương
    return NextResponse.json(chapter.lessons);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi lấy danh sách bài học" },
      { status: 500 }
    );
  }
} 