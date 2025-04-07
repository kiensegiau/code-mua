import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';
import { initModel as initCourseModel } from '@/app/_models/course';

// Import trực tiếp từ schema thay vì model để kiểm tra
export async function GET(request) {
  try {
    console.log("API courses được gọi");
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Khởi tạo model Course
    const Course = await initCourseModel();
    
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    
    console.log("MongoDB query params:", { grade, subject, limit, page });
    
    let query = {};
    
    if (grade) {
      query.grade = grade;
    }
    
    if (subject) {
      query.subject = subject;
    }
    
    console.log("MongoDB query:", JSON.stringify(query));
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    console.log("Đã kết nối đến database hocmai");
    
    // Truy cập collection courses trong database hocmai
    const coursesCollection = hocmaiDb.collection('courses');
    
    // Kiểm tra số lượng documents trong collection
    const count = await coursesCollection.countDocuments(query);
    console.log(`Collection courses có ${count} documents`);
    
    // Lấy các documents
    const courses = await Course.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    console.log(`Lấy được ${courses.length} khóa học`);
    
    if (courses.length > 0) {
      console.log("Khóa học đầu tiên:", JSON.stringify(courses[0], null, 2));
    }
    
    const formattedCourses = courses.map(course => ({
      ...course,
      id: course._id.toString(),
      _id: course._id.toString()
    }));
    
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("API Error /courses:", error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách khóa học' },
      { status: 500 }
    );
  }
} 