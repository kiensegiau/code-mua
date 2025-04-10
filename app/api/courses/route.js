import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    // Kết nối đến database
    await connectToDatabase();
    
    // Lấy các tham số query
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const dgnlType = searchParams.get("dgnlType");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search");
    
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
      } else if (grade === 'dgnl' || grade === 'đgnl' || grade === 'đánh giá năng lực') {
        // Xóa trường hợp này ở đây vì ĐGNL là subject, không phải grade
        query.grade = formattedGrade;
      } else {
        query.grade = formattedGrade;
      }
    }
    
    if (subject) {
      // Trường hợp đặc biệt cho ĐGNL - xử lý như một subject đặc biệt
      if (subject === 'dgnl' || subject === 'đgnl' || subject === 'đánh giá năng lực' || subject === 'assessment') {
        const dgnlConditions = [
          { subject: 'dgnl' },
          { subject: 'đgnl' },
          { subject: 'assessment' },
          { subject: 'đánh giá năng lực' },
          { title: { $regex: '\\bđánh giá năng lực\\b|\\bđgnl\\b|\\bthi đánh giá\\b|\\bnăng lực đh\\b', $options: 'i' } }
        ];
        
        // Kết hợp điều kiện ĐGNL với điều kiện grade nếu có
        if (query.$or) {
          const orConditions = query.$or;
          delete query.$or;
          query = {
            $and: [
              { $or: orConditions },
              { $or: dgnlConditions }
            ]
          };
        } else {
          query.$or = dgnlConditions;
        }
        
        // Nếu có dgnlType, lọc thêm theo loại ĐGNL cụ thể
        if (dgnlType) {
          let dgnlTypeCondition;
          
          switch(dgnlType) {
            case 'hanoi':
              dgnlTypeCondition = { 
                $or: [
                  { title: { $regex: '\\bđh quốc gia hà nội\\b|\\bđhqghn\\b|\\bqg hà nội\\b|\\bđgnl hà nội\\b|\\bđgnl hn\\b', $options: 'i' } },
                  { description: { $regex: '\\bđh quốc gia hà nội\\b|\\bđhqghn\\b|\\bqg hà nội\\b|\\bđgnl hà nội\\b|\\bđgnl hn\\b', $options: 'i' } }
                ]
              };
              break;
            case 'hcm':
              dgnlTypeCondition = { 
                $or: [
                  { title: { $regex: '\\bđh quốc gia hcm\\b|\\bđhqg hcm\\b|\\bđhqg-hcm\\b|\\bqg tp.hcm\\b|\\bđgnl hcm\\b|\\bđgnl tphcm\\b|\\bđgnl tp.hcm\\b', $options: 'i' } },
                  { description: { $regex: '\\bđh quốc gia hcm\\b|\\bđhqg hcm\\b|\\bđhqg-hcm\\b|\\bqg tp.hcm\\b|\\bđgnl hcm\\b|\\bđgnl tphcm\\b|\\bđgnl tp.hcm\\b', $options: 'i' } }
                ]
              };
              break;
            case 'bachkhoa':
              dgnlTypeCondition = { 
                $or: [
                  { title: { $regex: '\\bbách khoa\\b|\\bbk\\b|\\bđgtd\\b|\\bđánh giá tư duy\\b', $options: 'i' } },
                  { description: { $regex: '\\bbách khoa\\b|\\bbk\\b|\\bđgtd\\b|\\bđánh giá tư duy\\b', $options: 'i' } }
                ]
              };
              break;
            case 'supham':
              dgnlTypeCondition = { 
                $or: [
                  { title: { $regex: '\\bsư phạm\\b|\\bsp\\b|\\bđhsp\\b|\\bđgnl sp\\b', $options: 'i' } },
                  { description: { $regex: '\\bsư phạm\\b|\\bsp\\b|\\bđhsp\\b|\\bđgnl sp\\b', $options: 'i' } }
                ]
              };
              break;
            default:
              break;
          }
          
          if (dgnlTypeCondition) {
            // Thêm điều kiện lọc dgnlType vào query hiện tại
            if (query.$and) {
              query.$and.push(dgnlTypeCondition);
            } else if (query.$or) {
              const orConditions = query.$or;
              delete query.$or;
              query = {
                $and: [
                  { $or: orConditions },
                  dgnlTypeCondition
                ]
              };
            } else {
              query = {
                $and: [
                  query,
                  dgnlTypeCondition
                ]
              };
            }
          }
        }
      } else {
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
    }
    
    // Thêm tìm kiếm theo từ khóa
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Kết nối đến cả hai database
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    const elearningDb = mongoose.connection.useDb('elearning', { useCache: true });
    
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
    // Giữ lại console.error cho lỗi để thuận tiện debug
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách khóa học", details: error.message },
      { status: 500 }
    );
  }
} 