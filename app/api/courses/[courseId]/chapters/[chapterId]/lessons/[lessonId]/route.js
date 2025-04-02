import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import Course from "@/app/_utils/models/Course";
import User from "@/app/_utils/models/User";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    const { courseId, chapterId, lessonId } = params;

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

    // Tìm lesson trong mảng lessons của chapter
    const lesson = chapter.lessons.find(
      (lesson) => lesson.id === lessonId || lesson._id?.toString() === lessonId
    );

    if (!lesson) {
      return NextResponse.json(
        { error: "Không tìm thấy bài học" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập
    if (!lesson.isFree && session?.user) {
      const userId = session.user.id;
      const user = await User.findOne({ uid: userId });

      const isEnrolled = user?.enrolledCourses?.includes(courseId);
      
      if (!isEnrolled) {
        return NextResponse.json(
          {
            error: "Bạn chưa đăng ký khóa học này",
            limitedData: { 
              title: lesson.title,
              isFree: lesson.isFree
            }
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bài học:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi lấy thông tin bài học" },
      { status: 500 }
    );
  }
} 