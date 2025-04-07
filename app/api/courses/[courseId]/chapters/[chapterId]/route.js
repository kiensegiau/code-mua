import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import CourseContent from "@/app/_models/courseContent";
import { getServerSession } from "next-auth";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = params;
    
    await connectToDatabase();

    // Tìm nội dung khóa học
    const courseContent = await CourseContent.findOne({ courseId }).lean();
    if (!courseContent) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung khóa học" },
        { status: 404 }
      );
    }

    // Tìm chapter
    const chapter = courseContent.chapters.find(c => c._id.toString() === chapterId);
    if (!chapter) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      );
    }

    // Lấy danh sách bài học và đảm bảo đúng định dạng
    const lessons = chapter.lessons.map(lesson => ({
      ...lesson,
      id: lesson._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách bài học" },
      { status: 500 }
    );
  }
} 