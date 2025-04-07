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
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Truy cập các collections
    const coursesCollection = hocmaiDb.collection('courses');
    const courseContentsCollection = hocmaiDb.collection('courseContents');
    
    // Tìm khóa học bằng ID
    try {
      // Convert string ID sang ObjectId
      const objectId = new mongoose.Types.ObjectId(courseId);
      console.log("ObjectId:", objectId);
      
      // Lấy thông tin cơ bản của khóa học
      const course = await coursesCollection.findOne({ _id: objectId });
      
      if (!course) {
        console.log("Không tìm thấy khóa học với ID:", courseId);
        return NextResponse.json(
          { error: "Không tìm thấy khóa học" },
          { status: 404 }
        );
      }
      
      console.log("Đã tìm thấy khóa học:", course.title);

      // Lấy nội dung chi tiết của khóa học
      const courseContent = await courseContentsCollection.findOne({ courseId: courseId });
      console.log("Nội dung khóa học:", courseContent ? "Có" : "Không");
      
      // Trả về dữ liệu kết hợp
      return NextResponse.json({
        ...course,
        id: course._id.toString(),
        _id: course._id.toString(),
        chapters: courseContent ? courseContent.chapters : [],
      });
    } catch (idError) {
      console.error("Lỗi khi chuyển đổi ID:", idError);
      return NextResponse.json(
        { error: "ID khóa học không hợp lệ", details: idError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy chi tiết khóa học", details: error.message },
      { status: 500 }
    );
  }
} 