"use client";
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaQuoteRight, FaChalkboardTeacher } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

const TeacherCard = ({ name, image, achievement, description }) => {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate avatar từ tên
  const getInitialsAvatar = (name) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .slice(-2) // Lấy 2 chữ cái cuối (thường là tên)
      .join('')
      .toUpperCase();
    
    // Generate a random pastel color based on the name
    const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    const color = `hsl(${hue}, 85%, 85%)`;
    
    // Create an SVG with the initials
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360}, 85%, 75%);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad)" rx="50" ry="50" />
        <text x="50" y="52" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="central" style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
          ${initials}
        </text>
      </svg>
    `;
    
    // Convert SVG to base64 data URL - handle Unicode characters safely
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Placeholder when not client-side rendered
  if (!isClient) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse h-[400px]">
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="relative h-full">
        {/* Subtle gradient backdrop for the card */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-60 transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-60'}`}></div>
        
        <div 
          className={`relative h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl transition-all duration-500 ${isHovered ? 'shadow-xl translate-y-[-8px] shadow-indigo-500/20' : 'shadow-lg'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card top accent */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl"></div>
          
          <div className="p-6 sm:p-8 flex-1 flex flex-col">
            {/* Teacher info section */}
            <div className="flex items-start gap-5 mb-6">
              {/* Avatar with subtle shadow */}
              <div className="relative flex-shrink-0">
                <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full ${isHovered ? 'opacity-90 blur-sm' : 'opacity-70 blur-[2px]'} transition-all duration-300`}></div>
                <div 
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-inner"
                  style={{
                    backgroundImage: `url("${image || getInitialsAvatar(name)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay on hover */}
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center"
                    >
                      <div className="text-white text-xs font-medium pb-2 flex items-center">
                        <FiUser className="mr-1" />
                        Profile
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-1 transition-all duration-300 ${isHovered ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-white'}`}>
                  {name}
                </h3>
                
                {/* Rating stars with animation */}
                <div className="flex space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: isHovered ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ 
                        duration: 0.4, 
                        delay: i * 0.06,
                        repeat: isHovered ? Infinity : 0,
                        repeatDelay: 2
                      }}
                    >
                      <FaStar 
                        className="text-yellow-400 w-4 h-4"
                      />
                    </motion.div>
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 mt-0.5">(5.0)</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    <FaChalkboardTeacher className="mr-1" />
                    Giáo viên
                  </span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{achievement}</p>
                </div>
              </div>
            </div>
            
            {/* Quote/Description with elegant styling */}
            <div className="relative flex-1 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 flex-1 p-5 rounded-xl border border-gray-100 dark:border-slate-700 mt-2">
                <FaQuoteLeft className="absolute text-indigo-200 dark:text-indigo-800 w-5 h-5 opacity-80 top-2 left-3" />
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed px-5 pb-1">
                  {description}
                </p>
                
                <FaQuoteRight className="absolute text-indigo-200 dark:text-indigo-800 w-5 h-5 opacity-80 bottom-2 right-3" />
              </div>
            </div>
            
            {/* Footer with call-to-action */}
            <div className="mt-6 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                <svg className="w-3 h-3 mr-1 text-indigo-500" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="currentColor"/>
                </svg>
                TopUni Expert
              </span>
              
              <motion.button 
                className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem profile
                <svg className="w-3 h-3 ml-1" viewBox="0 0 16 16" fill="none">
                  <path d="M6.66667 4L11.3333 8L6.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherCard; 