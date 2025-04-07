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

    const { courseId, chapterId, lessonId } = params;
    
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

    // Tìm lesson
    const lesson = chapter.lessons.find(l => l._id.toString() === lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: "Không tìm thấy bài học" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...lesson,
      id: lesson._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bài học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin bài học" },
      { status: 500 }
    );
  }
} 