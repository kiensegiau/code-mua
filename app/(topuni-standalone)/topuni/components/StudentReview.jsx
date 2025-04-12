"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const StudentReview = ({ name, school, score, examType, avatar }) => {
  const [isClient, setIsClient] = useState(false);
  
  // Hàm an toàn encode base64 cho chuỗi Unicode
  const safeBase64Encode = (str) => {
    // Lấy viết tắt tên người dùng một cách an toàn
    const initials = name?.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('') || 'HS';
    
    // Dùng SVG cố định thay vì tạo động với btoa
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23777'/%3E%3Ctext x='50%25' y='50%25' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='white'%3E${initials}%3C/text%3E%3C/svg%3E`;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="p-8 relative">
        <div className="absolute top-4 right-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-50 opacity-80">
            <path d="M12.92 6C9.16 7.92 6.44 10.72 4.76 14.4C3.08 18 2.24 22 2.24 26.4C2.24 31.12 3.48 35.36 5.96 39.12C8.52 42.8 12.04 45.36 16.52 46.8L18.64 42.96C15.08 41.76 12.24 39.68 10.12 36.72C8.08 33.76 7.06 30.32 7.06 26.4C7.06 23.2 7.66 20.24 8.86 17.52C10.14 14.8 12.12 12.16 14.8 9.6L12.92 6ZM36.92 6C33.16 7.92 30.44 10.72 28.76 14.4C27.08 18 26.24 22 26.24 26.4C26.24 31.12 27.48 35.36 29.96 39.12C32.52 42.8 36.04 45.36 40.52 46.8L42.64 42.96C39.08 41.76 36.24 39.68 34.12 36.72C32.08 33.76 31.06 30.32 31.06 26.4C31.06 23.2 31.66 20.24 32.86 17.52C34.14 14.8 36.12 12.16 38.8 9.6L36.92 6Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-red-500 ring-offset-2">
            {isClient ? (
              avatar ? (
                <Image 
                  src={avatar}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold"
                  style={{ 
                    backgroundImage: `url("${safeBase64Encode(name)}")`,
                    backgroundSize: 'cover'
                  }}
                >
                </div>
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">
                {name?.split(' ').slice(0, 2).map(n => n[0]).join('') || 'HS'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{name}</h3>
            <p className="text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              {school}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-red-50 p-4 rounded-lg mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">{examType}</span>
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full px-4 py-1.5 font-bold shadow-md">
              {score}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star}
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-yellow-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <p className="text-gray-700 italic relative pl-6">
          <span className="absolute left-0 top-0 text-red-500 font-serif text-xl">"</span>
          HOCMAI là người đồng hành tuyệt vời giúp mình đạt được mục tiêu và đỗ vào ngôi trường mơ ước.
          <span className="absolute text-red-500 font-serif text-xl">"</span>
        </p>
      </div>
    </div>
  );
};

export default StudentReview;
