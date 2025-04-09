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
    const search = searchParams.get("search");
    
    console.log("MongoDB query params:", { grade, subject, limit, page, search });
    
    // Xây dựng query
    let query = {};
    
    if (grade) {
      // Chuyển đổi cách biểu diễn của grade
      let formattedGrade = grade;
      
      // Nếu grade chỉ là số (10, 11, 12), thì chuyển thành định dạng grade-X
      if (/^[0-9]+$/.test(grade)) {
        formattedGrade = `grade-${grade}`;
      }
      
      // Xử lý các trường hợp khác
      if (grade === '10' || grade === 'grade-10' || grade === 'grade10' || grade === 'lớp 10') {
        query.$or = [
          { grade: 'grade-10' },
          { grade: 'grade10' },
          { grade: 'lớp 10' },
          { grade: '10' },
          { title: { $regex: '\\b10\\b|\\blớp 10\\b', $options: 'i' } }
        ];
      } else if (grade === '11' || grade === 'grade-11' || grade === 'grade11' || grade === 'lớp 11') {
        query.$or = [
          { grade: 'grade-11' },
          { grade: 'grade11' },
          { grade: 'lớp 11' },
          { grade: '11' },
          { title: { $regex: '\\b11\\b|\\blớp 11\\b', $options: 'i' } }
        ];
      } else if (grade === '12' || grade === 'grade-12' || grade === 'grade12' || grade === 'lớp 12') {
        query.$or = [
          { grade: 'grade-12' },
          { grade: 'grade12' },
          { grade: 'lớp 12' },
          { grade: '12' },
          { title: { $regex: '\\b12\\b|\\blớp 12\\b', $options: 'i' } }
        ];
      } else {
        query.grade = formattedGrade;
      }
    }
    
    if (subject) {
      // Nếu đã có $or từ điều kiện grade, thêm điều kiện subject vào query riêng
      if (query.$or) {
        const orConditions = query.$or;
        delete query.$or;
        query.subject = subject;
        query = {
          $and: [
            { $or: orConditions },
            { subject: subject }
          ]
        };
      } else {
        query.subject = subject;
      }
    }
    
    // Thêm tìm kiếm theo từ khóa
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log("MongoDB query:", JSON.stringify(query));
    
    // Kết nối đến cả hai database
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    console.log("Đã kết nối đến cả hai database");
    
    // Truy cập collection courses trong cả hai database
    const hocmaiCoursesCollection = hocmaiDb.collection('courses');
    const elearningCoursesCollection = elearningDb.collection('courses');
    
    // Thực hiện truy vấn song song trên cả hai database
    const [hocmaiCourses, elearningCourses] = await Promise.all([
      hocmaiCoursesCollection.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray(),
      elearningCoursesCollection.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray()
    ]);
    
    // Đếm tổng số khóa học trong cả hai database
    const [hocmaiCount, elearningCount] = await Promise.all([
      hocmaiCoursesCollection.countDocuments(query),
      elearningCoursesCollection.countDocuments(query)
    ]);
    
    const totalCount = hocmaiCount + elearningCount;
    console.log(`Tổng số khóa học: ${totalCount} (hocmai: ${hocmaiCount}, elearning: ${elearningCount})`);
    
    // Kết hợp kết quả từ cả hai database
    const allCourses = [
      ...hocmaiCourses.map(course => ({ ...course, source: 'hocmai' })),
      ...elearningCourses.map(course => ({ ...course, source: 'elearning' }))
    ];
    
    // Sắp xếp lại theo thời gian cập nhật
    allCourses.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
      return dateB - dateA;
    });
    
    // Định dạng dữ liệu trả về
    const formattedCourses = allCourses.map(course => ({
      id: course._id.toString(),
      _id: course._id.toString(),
      title: course.title || "Không có tiêu đề",
      description: course.description || "",
      imageUrl: course.imageUrl || course.coverImage || course.thumbnail || "/images/course-default.jpg",
      thumbnail: course.thumbnail || course.imageUrl || course.coverImage || "/images/course-default.jpg",
      subject: course.subject || "Khác",
      grade: course.grade || "Khác",
      price: course.price || 0,
      source: course.source,
      updatedAt: course.updatedAt || course.createdAt || new Date()
    }));
    
    return NextResponse.json({
      courses: formattedCourses,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      status: "success"
    });
  } catch (error) {
    console.error("API Error /courses:", error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách khóa học', details: error.message, status: "error" },
      { status: 500 }
    );
  }
} 