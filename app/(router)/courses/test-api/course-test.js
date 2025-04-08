"use client";

import { useState, useEffect } from "react";
import CourseItem from "../_components/CourseItem";

export default function CourseTest() {
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    // Mẫu dữ liệu khóa học Văn đã được cung cấp
    const sampleCourseData = {
      "_id": "67f3bb893c71dc386575ef32",
      "title": "VĂN THẦY PHẠM MINH NHẬT MCLASS 2K7",
      "slug": "van-thay-pham-minh-nhat-mclass-2k7",
      "description": "",
      "shortDescription": "",
      "thumbnail": "",
      "price": 0,
      "discountPrice": 0,
      "status": "draft",
      "featured": false,
      "driveFolderId": "1LNRrWxxsLR2z1W8-eq0oKfACDoUK44ee",
      "driveUrl": "https://drive.google.com/drive/folders/1LNRrWxxsLR2z1W8-eq0oKfACDoUK44ee?usp=drive_link",
      "teacherId": null,
      "createdAt": "2025-04-03T15:24:18.598Z",
      "updatedAt": "2025-04-08T04:58:22.293Z",
      "firebaseId": "u7ovT7bi4HoAs6vIiFvs",
      "id": "67f3bb893c71dc386575ef32"
    };
    
    // Thêm thông tin môn học dựa vào tiêu đề
    const enhancedCourse = {
      ...sampleCourseData,
      subject: 'literature', // Môn Văn
      grade: 'grade-12' // Lớp 12 (2K7)
    };
    
    setCourse(enhancedCourse);
  }, []);
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kiểm tra hiển thị khóa học</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dữ liệu khóa học gốc</h2>
        <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[300px]">
          <pre className="text-sm text-gray-300">
            {course ? JSON.stringify(course, null, 2) : 'Đang tải...'}
          </pre>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Hiển thị thực tế</h2>
        {course ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <CourseItem data={course} />
            </div>
            
            <div>
              <CourseItem data={{
                ...course,
                thumbnail: "/images/subjects/literature.jpg"
              }} />
              <p className="mt-2 text-center text-sm text-gray-400">Với thumbnail môn Văn</p>
            </div>
            
            <div>
              <CourseItem data={{
                ...course,
                title: course.title,
                subject: 'literature'
              }} />
              <p className="mt-2 text-center text-sm text-gray-400">Với subject được đặt rõ ràng</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Đang tải dữ liệu khóa học...</p>
          </div>
        )}
      </div>
    </div>
  );
} 