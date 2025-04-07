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

    const { courseId } = params;
    
    await connectToDatabase();

    // Tìm nội dung khóa học
    const courseContent = await CourseContent.findOne({ courseId }).lean();
    if (!courseContent) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung khóa học" },
        { status: 404 }
      );
    }

    // Định dạng lại response để có ID string
    const formattedContent = {
      id: courseContent._id.toString(),
      courseId: courseContent.courseId.toString(),
      chapters: courseContent.chapters.map(chapter => ({
        ...chapter,
        id: chapter._id.toString(),
        _id: undefined,
        lessons: chapter.lessons.map(lesson => ({
          ...lesson,
          id: lesson._id.toString(),
          _id: undefined,
          resources: lesson.resources ? lesson.resources.map(resource => ({
            ...resource,
            id: resource._id.toString(),
            _id: undefined
          })) : []
        }))
      })),
      createdAt: courseContent.createdAt,
      updatedAt: courseContent.updatedAt,
      _id: undefined
    };

    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error("Lỗi khi lấy nội dung khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy nội dung khóa học" },
      { status: 500 }
    );
  }
} 