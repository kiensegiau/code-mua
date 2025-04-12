"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoSchoolOutline, 
  IoTimeOutline, 
  IoCheckmarkCircleOutline, 
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoStarOutline,
  IoGlobeOutline
} from "react-icons/io5";
import { GiRoad } from "react-icons/gi";
import { FaArrowRight, FaArrowLeft, FaPlay } from "react-icons/fa";
import RoadmapItem from "./RoadmapItem";

const ROADMAP_DATA = [
  {
    title: "Nhận thức & định hướng",
    description: "Tìm hiểu về các lựa chọn du học\nXác định mục tiêu và điểm đến\nĐánh giá khả năng tài chính\nTìm hiểu về các học bổng tiềm năng",
    duration: "4-6",
    icon: <IoSchoolOutline />
  },
  {
    title: "Nghiên cứu & chọn trường",
    description: "Tìm kiếm các trường phù hợp với chuyên ngành\nKiểm tra yêu cầu đầu vào và học phí\nTìm hiểu về thời hạn nộp đơn\nBắt đầu chuẩn bị bài luận và hồ sơ",
    duration: "6-8",
    icon: <IoDocumentTextOutline />
  },
  {
    title: "Chuẩn bị hồ sơ & kỹ năng",
    description: "Luyện thi IELTS/TOEFL/SAT\nChuẩn bị CV và thư giới thiệu\nHoàn thiện bài luận cá nhân\nChuẩn bị portfolio nếu cần thiết",
    duration: "8-12",
    icon: <IoPeopleOutline />
  },
  {
    title: "Nộp đơn & phỏng vấn",
    description: "Nộp đơn xin học vào các trường\nChuẩn bị và tham gia phỏng vấn\nXin visa du học\nChuẩn bị tài chính và các giấy tờ cần thiết",
    duration: "4-6",
    icon: <IoDocumentTextOutline />
  },
  {
    title: "Chuẩn bị trước khi đi",
    description: "Đặt vé máy bay và chỗ ở\nMua bảo hiểm du học\nTìm hiểu về cuộc sống ở nước ngoài\nChuẩn bị tâm lý và kỹ năng sống độc lập",
    duration: "2-3",
    icon: <IoGlobeOutline />
  },
  {
    title: "Bắt đầu cuộc sống mới",
    description: "Ổn định chỗ ở và sinh hoạt\nTham gia các hoạt động định hướng\nLàm quen với môi trường học tập\nXây dựng mạng lưới bạn bè và hỗ trợ",
    duration: "4-8",
    icon: <IoStarOutline />
  },
];

const MENTORS = [
  {
    name: "TS. Nguyễn Văn A",
    role: "Cố vấn du học Anh",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9,
    reviews: 127,
    yearsOfExperience: 8
  },
  {
    name: "TS. Trần Thị B",
    role: "Chuyên gia học bổng",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    reviews: 98,
    yearsOfExperience: 6
  },
  {
    name: "ThS. Lê Minh C",
    role: "Cố vấn du học Úc",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 4.7,
    reviews: 85,
    yearsOfExperience: 5
  }
];

export default function Roadmap() {
  const [activeStep, setActiveStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  const [currentMentor, setCurrentMentor] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation for auto-advancing steps
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev < ROADMAP_DATA.length - 1 ? prev + 1 : 0));
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle step navigation
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStep < ROADMAP_DATA.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  // Toggle auto-play
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // UI elements animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (!isClient) {
    return <div className="h-96 w-full flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 mb-3"
        >
          <GiRoad className="w-4 h-4 mr-2" />
          Lộ trình du học
        </motion.div>
        
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Hành trình chinh phục ước mơ du học
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
        >
          Từng bước chuẩn bị chu đáo để bạn tự tin trên con đường du học
        </motion.p>
        
        {/* Decorative element */}
        <div className="absolute w-64 h-64 top-0 right-0 -mt-16 -mr-20 opacity-20 dark:opacity-10">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4F46E5" d="M29.6,-49.1C39.2,-40.9,48.7,-33.8,55.9,-23.7C63.2,-13.6,68.1,-0.5,66.6,11.8C65.1,24.1,57.2,35.5,47.2,45.2C37.2,54.9,25.1,62.8,11.2,66.3C-2.8,69.7,-18.5,68.7,-33.1,63.3C-47.7,57.9,-61.1,48.1,-65.7,35.4C-70.3,22.8,-66.1,7.4,-63.5,-8.2C-60.9,-23.9,-59.9,-39.7,-51.3,-48.8C-42.7,-57.9,-26.4,-60.3,-12.7,-57.5C1,-54.7,20,-57.4,29.6,-49.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      {/* Main roadmap section */}
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        
        <div className="relative pt-8 px-4 sm:px-6 lg:px-8 pb-12">
          {/* Roadmap navigation and controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevStep}
                disabled={activeStep === 0}
                className={`inline-flex items-center justify-center p-2 rounded-full ${
                  activeStep === 0 
                    ? "text-gray-500 bg-gray-100 cursor-not-allowed dark:text-gray-500 dark:bg-gray-800" 
                    : "text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/70"
                }`}
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className={`inline-flex items-center justify-center p-2 rounded-full ${
                  isPlaying
                    ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/70"
                    : "text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/70"
                }`}
              >
                <FaPlay className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
              </button>
              
              <button
                onClick={handleNextStep}
                disabled={activeStep === ROADMAP_DATA.length - 1}
                className={`inline-flex items-center justify-center p-2 rounded-full ${
                  activeStep === ROADMAP_DATA.length - 1 
                    ? "text-gray-500 bg-gray-100 cursor-not-allowed dark:text-gray-500 dark:bg-gray-800" 
                    : "text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-900/70"
                }`}
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Bước {activeStep + 1} / {ROADMAP_DATA.length}
            </div>
          </div>
          
          {/* Roadmap timeline */}
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 relative"
          >
            {ROADMAP_DATA.map((step, index) => (
              <RoadmapItem
                key={index}
                title={step.title}
                description={step.description}
                duration={step.duration}
                index={index}
                active={activeStep}
                setActive={setActiveStep}
                total={ROADMAP_DATA.length}
                icon={step.icon}
              />
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Current step details */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {ROADMAP_DATA[activeStep].icon && (
                <span className="mr-3 text-blue-700 dark:text-blue-300">{ROADMAP_DATA[activeStep].icon}</span>
              )}
              {ROADMAP_DATA[activeStep].title}
            </h3>
            
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
              <IoTimeOutline className="w-4 h-4 mr-1" />
              <span>Thời gian: {ROADMAP_DATA[activeStep].duration} tuần</span>
            </div>
            
            <div className="mt-6 prose dark:prose-invert prose-blue max-w-none">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Mô tả chi tiết</h4>
              <ul className="space-y-3">
                {ROADMAP_DATA[activeStep].description.split('\n').map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-start"
                  >
                    <IoCheckmarkCircleOutline className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200">
                Tìm hiểu thêm
                <FaArrowRight className="ml-2 -mr-1 w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Mentor section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-xl shadow-lg overflow-hidden text-white"
        >
          <div className="px-6 py-8">
            <h3 className="text-xl font-bold mb-6">Cố vấn chuyên môn</h3>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMentor}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40">
                    <img
                      src={MENTORS[currentMentor].avatar}
                      alt={MENTORS[currentMentor].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full px-2 py-1 text-xs font-bold flex items-center">
                    <IoStarOutline className="w-3 h-3 mr-1" />
                    {MENTORS[currentMentor].rating}
                  </div>
                </div>
                
                <h4 className="mt-4 font-bold text-lg text-white">{MENTORS[currentMentor].name}</h4>
                <p className="text-blue-50">{MENTORS[currentMentor].role}</p>
                
                <div className="mt-4 flex items-center text-sm text-blue-50">
                  <span className="flex items-center">
                    <IoPeopleOutline className="w-4 h-4 mr-1" />
                    {MENTORS[currentMentor].reviews} đánh giá
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <IoTimeOutline className="w-4 h-4 mr-1" />
                    {MENTORS[currentMentor].yearsOfExperience} năm kinh nghiệm
                  </span>
                </div>
                
                <div className="mt-6 flex space-x-1">
                  {MENTORS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMentor(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentMentor
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`View mentor ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <button className="w-full py-3 px-4 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center">
                Tư vấn miễn phí
                <FaArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 