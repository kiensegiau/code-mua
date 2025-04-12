"use client";
import React, { useState, useEffect } from 'react';

const SectionHeader = ({ title, subtitle }) => {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col items-center mb-12">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="animate-pulse h-4 w-64 bg-gray-100 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gradient bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-center mb-2">{title}</h2>
      <div className="h-1.5 w-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mb-4"></div>
      {subtitle && (
        <p className="text-gray-600 text-center max-w-3xl text-base md:text-lg font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader; 