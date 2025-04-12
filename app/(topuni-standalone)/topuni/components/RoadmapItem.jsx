"use client";
import React, { useState, useEffect } from 'react';

const RoadmapItem = ({ title, description, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [steps] = useState(description.split('\n'));
  
  useEffect(() => {
    setIsClient(true);
    
    // Thêm hiệu ứng xuất hiện
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      hoverBorder: 'border-blue-300',
      text: 'text-blue-700',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      numberBg: 'bg-blue-100',
      numberText: 'text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      hoverBorder: 'border-green-300',
      text: 'text-green-700',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      numberBg: 'bg-green-100',
      numberText: 'text-green-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      hoverBorder: 'border-red-300',
      text: 'text-red-700',
      gradientFrom: 'from-red-400',
      gradientTo: 'to-red-600',
      numberBg: 'bg-red-100',
      numberText: 'text-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  };

  const colors = colorMap[color] || colorMap.blue;
  
  // Nếu không phải client-side, hiển thị placeholder để tránh hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-100 h-[300px] flex items-center justify-center">
        <div className="animate-pulse w-3/4 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${colors.bg} border ${isHovered ? `shadow-xl ${colors.hoverBorder} transform -translate-y-2` : `shadow-md ${colors.border}`} 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-white/50 -mr-10 -mt-10 transition-all duration-500 ${isHovered ? 'scale-125' : 'scale-100'}`}></div>
      <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/50 -ml-8 -mb-8 transition-all duration-500 ${isHovered ? 'scale-125' : 'scale-100'}`}></div>
      
      {/* Badge on top */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${colors.numberBg} ${colors.text} transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
        Bước {color === 'blue' ? '1' : color === 'green' ? '2' : '3'}
      </div>
      
      <div className="p-8 relative z-10">
        {/* Icon */}
        <div className={`transition-all duration-500 ${isHovered ? 'transform -translate-y-1' : ''}`}>
          {colors.icon}
        </div>
        
        {/* Title */}
        <div className="mb-3 relative">
          <h3 className={`text-xl font-bold mb-1 ${colors.text}`}>{title}</h3>
          <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} transition-all duration-500 ${isHovered ? 'w-20' : ''}`}></div>
        </div>
        
        {/* Description List */}
        <div className="space-y-2 mt-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-start transition-all duration-500 transform ${isHovered ? 'translate-x-1' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-5 h-5 ${colors.numberBg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 transition-all duration-300 ${isHovered ? 'scale-125' : ''}`}>
                <span className={`text-xs font-bold ${colors.numberText}`}>{index + 1}</span>
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sliding Panel at Bottom */}
      <div className={`p-3 text-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 -translate-y-full absolute'}`}>
        <div className={`flex items-center justify-center font-medium text-sm text-white rounded-full py-2 px-4 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`}>
          <span>Khám phá lộ trình</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RoadmapItem; 