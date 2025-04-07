import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    console.log("API courses được gọi");
    
    // Kết nối đến database
    await connectToDatabase();
    console.log("Đã kết nối database");
    
    // Lấy các tham số query
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    
    console.log("MongoDB query params:", { grade, subject, limit, page });
    
    // Xây dựng query
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
    const courses = await coursesCollection.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .toArray();
    
    console.log(`Lấy được ${courses.length} khóa học`);
    
    if (courses.length > 0) {
      console.log("Khóa học đầu tiên:", JSON.stringify(courses[0], null, 2));
    }
    
    // Định dạng dữ liệu trả về
    const formattedCourses = courses.map(course => ({
      ...course,
      id: course._id.toString(),
      _id: course._id.toString()
    }));
    
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("API Error /courses:", error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách khóa học', details: error.message },
      { status: 500 }
    );
  }
} 