import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    
    // Kết nối đến database
    await connectToDatabase();
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    
    // Truy cập collection courseContents
    const courseContentsCollection = hocmaiDb.collection('courseContents');
    
    try {
      // Tìm nội dung khóa học
      const courseContent = await courseContentsCollection.findOne({ courseId: courseId });
      
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
        chapters: courseContent.chapters ? courseContent.chapters.map(chapter => ({
          ...chapter,
          id: chapter._id.toString(),
          _id: chapter._id.toString(),
          lessons: chapter.lessons ? chapter.lessons.map(lesson => ({
            ...lesson,
            id: lesson._id.toString(),
            _id: lesson._id.toString(),
            resources: lesson.resources ? lesson.resources.map(resource => ({
              ...resource,
              id: resource._id.toString(),
              _id: resource._id.toString()
            })) : []
          })) : []
        })) : [],
        createdAt: courseContent.createdAt,
        updatedAt: courseContent.updatedAt,
      };

      return NextResponse.json(formattedContent);
    } catch (findError) {
      console.error("Lỗi khi tìm nội dung khóa học:", findError);
      return NextResponse.json(
        { error: "Lỗi khi tìm nội dung khóa học", details: findError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy nội dung khóa học:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy nội dung khóa học", details: error.message },
      { status: 500 }
    );
  }
} 