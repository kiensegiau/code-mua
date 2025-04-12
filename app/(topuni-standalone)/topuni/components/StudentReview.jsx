"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillStar } from 'react-icons/ai';
import { FaQuoteLeft, FaQuoteRight, FaGraduationCap, FaUniversity, FaAward } from 'react-icons/fa';
import { LuExternalLink } from 'react-icons/lu';
import { TbSchool } from 'react-icons/tb';

// Dữ liệu học viên tiêu biểu
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Minh Nguyễn",
    avatar: null,
    program: "Cử nhân Quản trị Kinh doanh",
    stars: 5,
    text: "TopUni đã giúp tôi đạt được điểm IELTS 7.5 và được nhận vào chương trình học bổng toàn phần tại Đại học Cambridge. Đội ngũ giảng viên tại đây thực sự chuyên nghiệp và tận tâm!",
    university: "Cambridge University",
    graduationYear: 2023,
    achievement: "Học bổng toàn phần"
  },
  {
    id: 2,
    name: "Hương Trần",
    avatar: null,
    program: "Thạc sĩ Khoa học Máy tính",
    stars: 5,
    text: "Tôi đã tham gia khóa học chuẩn bị hồ sơ du học của TopUni và được nhận vào MIT với học bổng một phần. Các mentors ở đây không chỉ giỏi chuyên môn mà còn rất tâm lý, hỗ trợ tôi trong suốt quá trình ứng tuyển.",
    university: "Massachusetts Institute of Technology",
    graduationYear: 2022,
    achievement: "Học bổng 75% học phí"
  },
  {
    id: 3,
    name: "Tuấn Anh",
    avatar: null,
    program: "Cử nhân Tài chính",
    stars: 4,
    text: "TopUni đã giúp tôi định hướng rõ ràng hơn về con đường học tập và nghề nghiệp. Nhờ sự hướng dẫn từ đội ngũ tư vấn, tôi đã chuẩn bị hồ sơ thành công và nhận được offer từ LSE.",
    university: "London School of Economics",
    graduationYear: 2021,
    achievement: "Được nhận vào trường top 5 thế giới"
  }
];

const StudentReview = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const reviewsRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, delay: 0.2 } }
  };

  // Implement auto-scroll
  useEffect(() => {
    setIsClient(true);
    startAutoRotate();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Reset interval when activeIndex changes
  useEffect(() => {
    if (isHovered) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startAutoRotate();
  }, [activeIndex, isHovered]);

  const startAutoRotate = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % REVIEWS_DATA.length);
    }, 5000); // Rotate every 5 seconds
  };

  const handleScroll = () => {
    // Temporarily pause auto-rotation while scrolling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Resume after a delay
    setTimeout(() => {
      if (!isHovered) {
        startAutoRotate();
      }
    }, 2000);
  };

  const handleReviewHover = (isHovering) => {
    setIsHovered(isHovering);
    
    if (isHovering) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      startAutoRotate();
    }
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Placeholder for when component first loads (pre-hydration)
  if (!isClient) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 rounded-2xl bg-white shadow-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
        <div className="h-36 bg-gray-200 rounded-xl mb-6"></div>
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-2 w-2 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Generate random placeholder avatar when image is missing
  const getInitialsAvatar = (name) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
    
    // Generate a random pastel color based on the name
    const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    
    // Create an SVG with the initials using a gradient fill
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(${hue}, 85%, 85%);stop-opacity:1" />
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

  // Truy cập thông tin học viên hiện tại
  const currentReview = REVIEWS_DATA[activeIndex];

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      ref={reviewsRef}
    >
      {/* Tiêu đề phần */}
      <motion.div 
        className="relative text-center mb-16"
        variants={childVariants}
      >
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent transform -translate-y-1/2"></div>
        <h2 className="relative inline-block px-6 bg-white dark:bg-slate-900 text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Học viên tiêu biểu của TopUni
        </h2>
      </motion.div>
      
      {/* Container chính */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeIndex}
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => handleReviewHover(true)}
            onMouseLeave={() => handleReviewHover(false)}
          >
            <motion.div 
              className="relative w-full p-8 sm:p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
              }}
            >
              {/* Subtle gradient backdrop */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
              
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 dark:from-blue-900/10 to-transparent rounded-tl-3xl rounded-br-2xl z-0 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-50 dark:from-indigo-900/10 to-transparent rounded-br-3xl rounded-tl-2xl z-0 opacity-70"></div>
              
              {/* Quote marks */}
              <motion.div 
                className="absolute top-6 left-6 text-blue-200 dark:text-blue-800 text-4xl opacity-40"
                variants={quoteVariants}
              >
                <FaQuoteLeft />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-6 right-6 text-indigo-200 dark:text-indigo-800 text-4xl opacity-40"
                variants={quoteVariants}
              >
                <FaQuoteRight />
              </motion.div>
              
              {/* Main content */}
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar section with badges */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-70 blur-[2px]"></div>
                    <div 
                      className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md"
                      style={{
                        backgroundImage: `url("${currentReview.avatar || getInitialsAvatar(currentReview.name)}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    ></div>
                    
                    {/* Achievement badge */}
                    <div className="absolute -right-2 -bottom-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-md font-bold">
                      <FaAward className="inline mr-1" />
                      {currentReview.achievement}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">{currentReview.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center justify-center">
                      <FaGraduationCap className="mr-1" />
                      {currentReview.program}
                    </p>
                    
                    {/* Star rating */}
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar 
                          key={i} 
                          className={i < currentReview.stars 
                            ? "text-yellow-400" 
                            : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    
                    {/* University badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mt-1 mb-3">
                      <FaUniversity className="mr-1" />
                      {currentReview.university}
                    </div>
                    
                    {/* Year badge */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <TbSchool className="inline mr-1" />
                      Tốt nghiệp {currentReview.graduationYear}
                    </div>
                  </div>
                </div>
                
                {/* Review text */}
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-lg">
                    {currentReview.text}
                  </p>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      {REVIEWS_DATA.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleDotClick(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === activeIndex
                              ? "bg-blue-600 w-7" 
                              : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-700"
                          }`}
                          aria-label={`Xem lời chứng thực ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <a 
                      href="#" 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors duration-300"
                    >
                      Xem lời chứng thực đầy đủ
                      <LuExternalLink className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows - desktop only */}
        <div className="absolute top-1/2 left-0 right-0 hidden md:flex justify-between items-center -translate-y-1/2 px-4">
          <motion.button
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-slate-700 z-10"
            onClick={() => setActiveIndex((activeIndex - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length)}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Xem học viên trước đó"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
          
          <motion.button
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-slate-700 z-10"
            onClick={() => setActiveIndex((activeIndex + 1) % REVIEWS_DATA.length)}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Xem học viên tiếp theo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* CTA Section */}
      <motion.div 
        className="mt-16 text-center"
        variants={childVariants}
      >
        <div className="inline-flex justify-center mb-8">
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Hãy trở thành một phần trong câu chuyện thành công của học viên TopUni. Đăng ký ngay hôm nay để nhận tư vấn lộ trình cá nhân hóa từ đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi.
        </p>
        <motion.a 
          href="#register"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          Đăng ký tư vấn miễn phí
          <svg className="w-4 h-4 ml-2" viewBox="0 0 16 16" fill="none">
            <path d="M6.66667 4L11.3333 8L6.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default StudentReview;
