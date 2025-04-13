"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoTimeOutline } from 'react-icons/io5';
import { FaGraduationCap, FaRegLightbulb, FaUserGraduate, FaRegClock } from 'react-icons/fa';

const HeroSection = () => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set deadline 10 days from now
  useEffect(() => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 10);
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = deadline - now;
      
      if (difference <= 0) {
        clearInterval(intervalId);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Các mục tiêu xu hướng
  const trends = [
    { icon: <FaGraduationCap />, text: "95% đạt kết quả cao" },
    { icon: <FaRegLightbulb />, text: "Tư duy tiếp cận mới" },
    { icon: <FaUserGraduate />, text: "Giáo viên kinh nghiệm" },
    { icon: <FaRegClock />, text: "Tiết kiệm thời gian" },
  ];

  return (
    <section className="relative mt-16 md:mt-20 pt-12 pb-16 md:py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
      </div>
      
      {/* Floating particles - decorative */}
      <div className="absolute inset-0 -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${Math.random() > 0.7 ? 4 : 3} h-${Math.random() > 0.7 ? 4 : 3} rounded-full ${
              Math.random() > 0.7 ? 'bg-yellow-400/20' : 'bg-blue-600/20'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Left column - Text content */}
          <motion.div 
            className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full mb-4 font-medium text-sm"
              variants={itemVariants}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                HỌC SINH 2K8 CHÚ Ý
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              variants={itemVariants}
            >
              Lộ trình học <span className="text-blue-600 relative">
                toàn diện
                <svg className="absolute bottom-1 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" width="100%" height="10" preserveAspectRatio="none">
                  <path d="M0,5 C20,0 80,10 100,5" fill="none" stroke="#3B82F6" strokeWidth="2" />
                </svg>
              </span> đảm bảo đỗ Đại học top
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-8"
              variants={itemVariants}
            >
              Lộ trình học được thiết kế chuyên sâu bởi đội ngũ giáo viên 18+ năm kinh nghiệm, giúp bạn chinh phục điểm cao nhất trong kỳ thi đại học 2026.
            </motion.p>
            
            {/* Xu hướng */}
            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              variants={itemVariants}
            >
              {trends.map((trend, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-white rounded-full px-3 py-1.5 text-sm text-gray-700 shadow-sm border border-gray-100"
                >
                  <span className="text-blue-600 mr-1.5">
                    {trend.icon}
                  </span>
                  {trend.text}
                </div>
              ))}
            </motion.div>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
              variants={itemVariants}
            >
              <motion.a 
                href="#dang-ky" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Đăng ký ngay</span>
                <motion.span 
                  className="absolute inset-0 bg-blue-500 z-0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.a>
              <motion.a 
                href="#lo-trinh" 
                className="bg-white hover:bg-gray-50 text-blue-600 text-center font-semibold px-6 py-3 rounded-full shadow border-2 border-blue-100 hover:border-blue-200 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Xem lộ trình học
              </motion.a>
            </motion.div>
            
            {/* Countdown timer */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <IoTimeOutline className="text-lg animate-pulse" />
                <p className="font-medium">Ưu đãi đặc biệt - Còn lại</p>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <CountdownBox value={timeLeft.days} label="NGÀY" />
                <CountdownBox value={timeLeft.hours} label="GIỜ" />
                <CountdownBox value={timeLeft.minutes} label="PHÚT" />
                <CountdownBox value={timeLeft.seconds} label="GIÂY" />
              </div>
              
              <motion.p 
                className="text-center text-sm text-gray-600 mt-2 bg-yellow-50 py-1 px-2 rounded border border-yellow-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="font-medium text-yellow-600">Chỉ còn 19 suất!</span> Dành cho 100 học sinh đăng ký sớm nhất
              </motion.p>
            </motion.div>
          </motion.div>
          
          {/* Right column - Image and decorations */}
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-w-4 aspect-h-3 bg-blue-100 relative">
                {/* Hero image */}
                <div className="w-full h-full">
                  <Image
                    src="/images/student-success.jpg"
                    alt="Học sinh thành công cùng TopUni"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={(e) => {
                      // Fallback khi hình ảnh không load được
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-blue-600 text-lg bg-blue-50">
                          <div class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9-5-9-5-9 5 9 5z" />
                            </svg>
                            <p>Học sinh xuất sắc cùng TopUni</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            
            {/* Pulsing circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-blue-400/30 -z-10">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-400/40"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Stats floating cards */}
            <motion.div 
              className="absolute -left-12 top-1/4 bg-white p-3 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-semibold">
                  18+
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Giáo viên kinh nghiệm</p>
                  <p className="text-xs text-gray-600">Đội ngũ giảng dạy hàng đầu</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -right-6 bottom-1/3 bg-white p-3 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full text-white flex items-center justify-center font-semibold">
                  95%
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Tỷ lệ đỗ đại học</p>
                  <p className="text-xs text-gray-600">Từ các khóa trước</p>
                </div>
              </div>
            </motion.div>
            
            {/* Kết quả thi rơi xuống */}
            <motion.div 
              className="absolute -bottom-5 left-1/4 bg-white px-3 py-2 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <p className="text-xs text-gray-500">Điểm ĐGNL đạt được</p>
              <p className="text-lg font-bold text-blue-600">122/150</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Component hộp đếm ngược
const CountdownBox = ({ value, label }) => (
  <motion.div 
    className="bg-blue-50 rounded-lg p-2 relative overflow-hidden"
    whileHover={{ 
      scale: 1.05, 
      backgroundColor: "#EFF6FF" // Equivalent to bg-blue-50 but slightly brighter on hover
    }}
  >
    <motion.div
      className="absolute inset-0 bg-blue-100 origin-bottom"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ zIndex: 0 }}
    />
    <div className="relative z-10">
      <div className="text-2xl md:text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  </motion.div>
);

export default HeroSection; 