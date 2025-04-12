"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function TeacherCard({ name, image, achievement, description }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hiệu ứng hover
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl bg-white hover:translate-y-[-8px] border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
        {isClient ? (
          image ? (
            <div className="relative w-full h-full">
              <Image
                src={image}
                fill
                alt={name}
                className="object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `data:image/svg+xml;base64,${btoa(
                    '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">' + name.charAt(0) + '</text></svg>'
                  )}`;
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <span className="text-6xl font-bold text-blue-500">{name.charAt(0)}</span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <span className="text-6xl font-bold text-blue-500">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{name}</h3>
        <p className="text-indigo-600 font-medium text-sm mb-4">{achievement}</p>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      <div className={`bg-indigo-100 p-4 transition-all duration-300 ${isHovered ? 'bg-indigo-200' : ''}`}>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-full w-full font-medium transition-all duration-300">
          Xem thông tin giáo viên
        </button>
      </div>
    </div>
  );
} 