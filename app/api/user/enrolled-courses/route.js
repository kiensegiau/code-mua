import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_models/user";
import Course from "@/app/_models/course";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    // Tìm người dùng
    const user = await User.findOne({ uid: userId }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Lấy danh sách ID khóa học đã đăng ký
    const enrolledCourses = user.enrolledCourses || [];
    if (!enrolledCourses.length) {
      return NextResponse.json([]);
    }

    // Lấy ID của các khóa học
    const courseIds = enrolledCourses.map(course => 
      typeof course === 'string' ? course : course.courseId
    );

    // Lấy thông tin chi tiết của khóa học
    const courses = await Course.find({
      _id: { $in: courseIds }
    }).lean();

    // Kết hợp thông tin khóa học với thông tin đăng ký
    const result = courses.map(course => {
      const courseInfo = enrolledCourses.find(c => {
        const enrolledId = typeof c === 'string' ? c : c.courseId.toString();
        return enrolledId === course._id.toString();
      });

      const courseInfoObj = typeof courseInfo === 'string'
        ? { courseId: courseInfo }
        : courseInfo;

      return {
        ...course,
        id: course._id.toString(),
        _id: undefined,
        enrolledAt: courseInfoObj.enrolledAt || new Date().toISOString(),
        progress: courseInfoObj.progress || 0,
        lastAccessed: courseInfoObj.lastAccessed || null
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách khóa học đã đăng ký" },
      { status: 500 }
    );
  }
}