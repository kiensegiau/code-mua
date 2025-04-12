"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function TeacherCard({ name, image, achievement, description }) {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [stars, setStars] = useState(Array(5).fill(0).map((_, i) => i < 5));

  const safeBase64Encode = (str) => {
    // Lấy viết tắt tên người dùng một cách an toàn
    const initials = name?.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('') || 'GV';
    
    // Dùng SVG cố định thay vì tạo động với btoa
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23777'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='white'%3E${initials}%3C/text%3E%3C/svg%3E`;
  };

  useEffect(() => {
    setIsClient(true);
    
    // Hiệu ứng xuất hiện khi component load
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Tạo initials từ tên giáo viên
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  // Tránh hydration mismatch bằng cách không render nội dung phức tạp cho đến khi client-side hydration hoàn tất
  if (!isClient) {
    return <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-8 h-[300px] flex items-center justify-center">
      <div className="animate-pulse w-3/4 h-4 bg-gray-200 rounded"></div>
    </div>;
  }

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-500 bg-white border border-gray-100 transform ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${isHovered ? 'shadow-2xl -translate-y-2 border-blue-100' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-gradient-to-r from-indigo-100 to-blue-100 overflow-hidden">
        {isClient ? (
          image ? (
            <div className="relative w-full h-full">
              <Image
                src={image}
                fill
                alt={name}
                className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.style.backgroundColor = '#4F46E5';
                  e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-5xl font-bold">${getInitials(name)}</div>`;
                }}
              />
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent flex items-end justify-center pb-6">
                  <div className="text-white text-center">
                    <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide inline-block animate-pulse">
                      Giáo viên 5 sao
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-indigo-600">
              <div className={`text-6xl font-bold text-white transform transition-all duration-500 ${isHovered ? 'scale-125' : ''}`}>
                {getInitials(name)}
              </div>
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
              )}
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-600">
            <div className="text-6xl font-bold text-white">{getInitials(name)}</div>
          </div>
        )}
        
        {/* Floating Decorative Elements that move on hover */}
        <div className={`absolute right-2 top-2 w-8 h-8 rounded-full bg-blue-400/20 backdrop-blur-sm transition-all duration-700 ${isHovered ? 'transform translate-x-3 -translate-y-1 scale-150' : ''}`}></div>
        <div className={`absolute left-3 bottom-6 w-5 h-5 rounded-full bg-indigo-400/20 backdrop-blur-sm transition-all duration-700 ${isHovered ? 'transform -translate-x-2 translate-y-3 scale-150' : ''}`}></div>
      </div>

      <div className="p-6 relative overflow-hidden">
        {/* Decorative background line */}
        <div className={`absolute right-0 bottom-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mb-16 transition-all duration-500 ${isHovered ? 'scale-125' : ''}`}></div>
        
        <div className="relative z-10">
          <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${isHovered ? 'text-indigo-700' : 'text-gray-800'}`}>
            {name}
          </h3>
          
          <div className={`inline-block px-2 py-1 rounded-md text-xs font-semibold mb-3 transition-all duration-300 ${isHovered ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-indigo-600'}`}>
            {achievement.split(',')[0]}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="flex items-center space-x-1 mb-4">
            {stars.map((isFilled, index) => (
              <svg 
                key={index}
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${isFilled ? 'text-yellow-400 animate-star' : 'text-yellow-500'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-500 relative overflow-hidden ${isHovered ? 'h-14' : 'h-12'}`}>
        <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'} bg-indigo-100 p-3 flex justify-center`}>
          <span className="text-indigo-700 font-medium">Xem thông tin</span>
        </div>
        <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} bg-gradient-to-r from-indigo-600 to-blue-600 p-3 flex justify-center`}>
          <span className="text-white font-medium flex items-center">
            <span>Xem chi tiết</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-star {
          animation: star-pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 