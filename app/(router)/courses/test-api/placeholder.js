"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Danh sách các placeholder cho các môn học
const subjectPlaceholders = [
  { id: "math", name: "Toán học", color: "#4285F4" },
  { id: "physics", name: "Vật lý", color: "#DB4437" },
  { id: "chemistry", name: "Hóa học", color: "#F4B400" },
  { id: "biology", name: "Sinh học", color: "#0F9D58" },
  { id: "literature", name: "Ngữ văn", color: "#AA66CC" },
  { id: "english", name: "Tiếng Anh", color: "#34A853" },
  { id: "history", name: "Lịch sử", color: "#FF6D00" },
  { id: "geography", name: "Địa lý", color: "#2196F3" },
  { id: "informatics", name: "Tin học", color: "#9C27B0" },
  { id: "others", name: "Khác", color: "#757575" },
];

export default function Placeholder() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Placeholder Images</h1>
      <p className="mb-8">
        Đây là các placeholder được sử dụng khi không tìm thấy ảnh thumbnail cho khóa học.
        Bạn có thể download các ảnh này và đặt vào thư mục{" "}
        <code className="bg-gray-700 px-2 py-1 rounded">public/images/subjects/</code>
        với tên file tương ứng (vd: math.jpg, literature.jpg).
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {subjectPlaceholders.map((subject) => (
          <div key={subject.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div 
              className="aspect-video flex items-center justify-center relative"
              style={{ backgroundColor: subject.color }}
            >
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), 
                                  linear-gradient(to bottom, white 1px, transparent 1px)`,
                backgroundSize: "20px 20px"
              }}></div>
              
              <div className="text-white font-bold text-xl z-10">
                {subject.name}
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm mb-1">Filename: {subject.id}.jpg</p>
              <div className="flex space-x-2">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">{subject.color}</span>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">400x225</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 