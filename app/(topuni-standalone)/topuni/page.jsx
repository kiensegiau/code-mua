"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./components/CountdownTimer";
import TeacherCard from "./components/TeacherCard";
import StudentReview from "./components/StudentReview";
import RoadmapItem from "./components/RoadmapItem";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { motion } from "framer-motion";
import Footer from './components/Footer';

export default function TopuniPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // student hoặc parent
  const [grade, setGrade] = useState("");
  const [examType, setExamType] = useState("");
  const [remainingSeats, setRemainingSeats] = useState(19);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Danh sách giáo viên
  const teachers = [
    {
      name: "Thầy Nguyễn Thanh Tùng",
      image: null, // "/images/teacher-tung.jpg",
      achievement: "Kĩ sư tốt nghiệp Đại học Bách khoa Hà Nội, 16 năm kinh nghiệm giảng dạy môn Toán",
      description: "Bài giảng của thầy được thiết kế theo hình thức sơ đồ tư duy vì thế học sinh yêu thương gọi thầy là 'THẦY TÙNG MIND-MAP'"
    },
    {
      name: "Thầy Đặng Thành Nam",
      image: null, // "/images/teacher-nam.jpg",
      achievement: "17 năm kinh nghiệm, TOP giáo viên luyện thi được học sinh yêu thích nhất",
      description: "Phương pháp giảng dạy đổi mới, truyền cảm hứng tới học sinh"
    },
  ];

  // Danh sách học sinh chia sẻ
  const students = [
    {
      name: "Bùi Đào Lân",
      school: "ĐH Công nghệ - ĐHQG Hà Nội",
      score: "122/150",
      examType: "Điểm thi HSA",
      avatar: null // "/images/student-1.jpg"
    },
    {
      name: "Nguyễn Trung Kiên",
      school: "Đại học Y Hà Nội",
      score: "28,75/30",
      examType: "Điểm thi TN THPT",
      avatar: null // "/images/student-2.jpg"
    }
  ];

  // Danh sách lộ trình
  const roadmapItems = [
    {
      title: "NỀN TẢNG (4-6 tháng)",
      description: "Trang bị kiến thức nền\nThực hành dạng bài cơ bản",
      color: "blue"
    },
    {
      title: "TỔNG ÔN (3-4 tháng)",
      description: "Hệ thống hóa kiến thức\nQuét mọi chuyên đề",
      color: "green"
    },
    {
      title: "LUYỆN ĐỀ (3 tháng)",
      description: "Rèn phương pháp\nLuyện kĩ năng",
      color: "red"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi thông tin đăng ký
    console.log({ name, phone, email, role, grade, examType });
    setIsModalOpen(true);
  };

  // Hiệu ứng particles cho background
  const particles = {
    count: 100,
    color: "#ff4d4f",
    size: 2,
    minSpeed: 0.3,
    maxSpeed: 1
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulse = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen relative overflow-hidden">
      {/* Background Particles */}
      {isClient && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          {Array.from({ length: particles.count }).map((_, index) => {
            const size = Math.random() * particles.size + 1;
            const speed = particles.minSpeed + Math.random() * (particles.maxSpeed - particles.minSpeed);
            const initialLeft = Math.random() * 100;
            const initialTop = Math.random() * 100;
            
            return (
              <div
                key={index}
                className="absolute rounded-full bg-red-500 animate-float"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${initialLeft}%`,
                  top: `${initialTop}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            );
          })}
        </div>
      )}
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(15px);
          }
          50% {
            transform: translateY(-15px) translateX(-15px);
          }
          75% {
            transform: translateY(-25px) translateX(10px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .bg-pattern {
          background-image: radial-gradient(circle, rgba(255,77,79,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .glass-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .text-gradient {
          background: linear-gradient(to right, #ff4d4f, #f5222d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bg-gradient-red {
          background: linear-gradient(135deg, #ff4d4f 0%, #f5222d 100%);
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-[150px] h-[45px] bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white font-bold rounded-md shadow-md">
              HOCMAI
            </div>
            <div className="h-6 w-0.5 bg-gray-200 hidden md:block"></div>
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 transition-transform duration-300 cursor-pointer">TopUni</span>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="#roadmap" className="font-medium hover:text-red-600 transition relative group py-2">
              Lộ trình
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#teachers" className="font-medium hover:text-red-600 transition relative group py-2">
              Giáo viên
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#reviews" className="font-medium hover:text-red-600 transition relative group py-2">
              Học sinh chia sẻ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#register" className="font-medium hover:text-red-600 transition relative group py-2">
              Đăng ký
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6">
              Đăng ký ngay
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-900 to-red-900 z-0 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 z-0 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.div 
                className="inline-block px-5 py-2 bg-white/15 backdrop-blur-md rounded-full text-white font-medium mb-8 border border-white/10"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Đợt cuối tuyển sinh 2K8
              </motion.div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-8 text-white leading-tight tracking-tight">
                Luyện thi Đại học <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  2K8 xuất phát ngay!
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full" 
                    viewBox="0 0 358 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <path d="M3 9C118.957 4.47226 236.066 3.86015 355 9" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round"/>
                  </motion.svg>
                </span>
              </h1>
              <p className="text-xl mb-10 text-gray-100 leading-relaxed max-w-xl">
                Chiến lược ôn thi đột phá giúp học sinh 2k8 chinh phục trường đại học top đầu với phương pháp học hiệu quả
              </p>
              <motion.div 
                className="bg-white/15 backdrop-blur-lg p-8 rounded-2xl mb-10 border border-white/20 shadow-xl"
                variants={pulse}
                initial="initial"
                animate="animate"
              >
                <h3 className="text-xl font-bold mb-4 text-white">ĐẶT CHỖ SỚM - ƯU ĐÃI LỚN</h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  <p className="text-yellow-200 font-medium">DÀNH CHO {100 - remainingSeats} / 100 HỌC SINH ĐẶT CHỖ SỚM NHẤT</p>
                </div>
                
                <CountdownTimer 
                  title="Thời gian ưu đãi còn lại" 
                  targetDate={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 30 * 60 * 1000)} 
                  expiredMessage="Ưu đãi đã kết thúc!" 
                />
              </motion.div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-red-600 hover:bg-red-700 py-3 px-8 text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-red-700/20 transition-all duration-300 w-full sm:w-auto">
                    Đăng ký ngay
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/15 py-3 px-8 text-lg rounded-full transition-all duration-300 w-full sm:w-auto">
                    Tư vấn lộ trình
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl blur-xl opacity-70 animate-pulse"></div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 to-red-900 p-1 shadow-2xl">
                <motion.div 
                  className="w-full h-[500px] bg-gray-800 flex items-center justify-center text-white overflow-hidden"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {/* Dynamic particle background */}
                  {isClient && Array.from({ length: 30 }).map((_, index) => {
                    const size = Math.random() * 5 + 2;
                    const delay = Math.random() * 5;
                    const duration = Math.random() * 20 + 10;
                    const initialX = Math.random() * 100;
                    const initialY = Math.random() * 100;
                    
                    return (
                      <div
                        key={`particle-${index}`}
                        className="absolute rounded-full bg-white/20"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          left: `${initialX}%`,
                          top: `${initialY}%`,
                          animation: `floatParticle ${duration}s linear infinite`,
                          animationDelay: `${delay}s`
                        }}
                      />
                    );
                  })}
                  
                  <motion.div 
                    className="text-center relative z-10"
                    variants={fadeIn}
                  >
                    <motion.div 
                      className="text-6xl font-bold mb-4"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        textShadow: ["0 0 10px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.5)"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      2K8
                    </motion.div>
                    <motion.div 
                      className="text-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      Chinh phục đại học
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-lg"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: ["0 10px 25px -5px rgba(239, 68, 68, 0.4)", "0 20px 25px -5px rgba(239, 68, 68, 0.7)", "0 10px 25px -5px rgba(239, 68, 68, 0.4)"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <p className="font-bold text-sm">Sắp hết, chỉ còn {remainingSeats} suất!</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              THỰC TẾ PHŨ PHÀNG
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">Những thách thức mà thí sinh 2K8 phải đối mặt trong kỳ thi sắp tới</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-red-600">2008 thuộc thế hệ "bùng nổ dân số"</h3>
              <p className="text-gray-600 relative z-10">Gần 1,2 triệu thí sinh tranh suất vào đại học mơ ước. Chỉ những thí sinh có sự chuẩn bị chu đáo mới có khả năng cạnh tranh vào trường top</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Siết chặt dạy thêm, học thêm</h3>
              <p className="text-gray-600 relative z-10">Học sinh thiếu hụt các nguồn ôn tập quen thuộc, dễ rơi vào trạng thái hoang mang, học lan man, thiếu khoa học</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Thay đổi xu hướng ra đề</h3>
              <p className="text-gray-600 relative z-10">Mọi "lối tắt" học tủ, học mẹo đều vô dụng. Xuất hiện loạt câu hỏi mới lạ, kiến thức tích hợp liên môn, bài toán thực tế hóc búa.</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">Đề thi phân hóa mạnh</h3>
              <p className="text-gray-600 relative z-10">Điểm cao, trường top chỉ dành cho những thí sinh có năng lực thực sự. Tăng độ phân hóa thuộc phân khúc điểm trên 5.</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-purple-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-1 rounded-lg blur-md bg-gradient-to-r from-yellow-400 to-red-600 opacity-70"></div>
              <h3 className="relative bg-white px-6 py-4 rounded-lg text-2xl font-bold">Kỳ thi mới, luật chơi mới, 2k8 không có chỗ cho sự mơ hồ</h3>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Đăng ký tư vấn ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-full -mt-32 -mr-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-50 to-transparent rounded-full -mb-32 -ml-32 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              ÔN THI LỘ TRÌNH "CHẤT"
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">X2 hiệu quả, Tiết kiệm 30% thời gian ôn luyện với phương pháp độc quyền</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-green-200 to-red-200 transform -translate-y-1/2 hidden md:block"></div>
            
            {roadmapItems.map((item, index) => (
              <RoadmapItem 
                key={index}
                title={item.title}
                description={item.description}
                color={item.color}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-10 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-8 text-center relative inline-block">
              Ưu điểm vượt trội
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-600"></div>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chương trình được biên soạn bám sát cấu trúc</h4>
                  <p className="text-gray-600">Liên tục cập nhật theo từng kỳ thi, đảm bảo sinh viên luôn được học với tài liệu mới nhất</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Đội ngũ giáo viên luyện thi hàng đầu</h4>
                  <p className="text-gray-600">18+ năm kinh nghiệm, huấn luyện phương pháp kỹ năng & chiến lược làm bài hiệu quả</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Phòng luyện & thi thử iTest độc quyền</h4>
                  <p className="text-gray-600">Giúp học sinh trải nghiệm như thi thật, làm quen với môi trường thi trước khi bước vào kỳ thi chính thức</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Phối hợp với đại diện các trường Đại học</h4>
                  <p className="text-gray-600">Liên tục cập nhật các thay đổi & tư vấn định hướng cho học sinh về chuyên ngành và trường đại học phù hợp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-50 rounded-full filter blur-3xl opacity-70 -mr-32 -mb-32"></div>
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-70 -ml-32"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              ĐỘI NGŨ GIÁO VIÊN HÀNG ĐẦU
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">Đồng hành cùng các thầy cô giàu kinh nghiệm, tận tâm với nghề và đam mê giảng dạy</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {teachers.map((teacher, index) => (
              <TeacherCard 
                key={index}
                name={teacher.name}
                image={teacher.image}
                achievement={teacher.achievement}
                description={teacher.description}
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="p-6 inline-block bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 shadow-sm max-w-2xl">
              <h3 className="font-bold text-xl mb-2 text-gray-800">Tham gia cùng giáo viên hàng đầu</h3>
              <p className="text-gray-600 mb-4">Cùng học tập và trao đổi trực tiếp với những giáo viên giàu kinh nghiệm nhất trong lĩnh vực luyện thi đại học</p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mt-2">
                Xem thêm giáo viên
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Reviews */}
      <section id="reviews" className="py-20 bg-white relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/images/dots-pattern.png')] bg-repeat opacity-5"></div> */}
        <div className="absolute inset-0 bg-gray-100 bg-opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              HỌC SINH CHIA SẺ THÀNH CÔNG
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">Những câu chuyện truyền cảm hứng từ các học sinh đã chinh phục thành công kỳ thi đại học</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student, index) => (
              <StudentReview 
                key={index}
                name={student.name}
                school={student.school}
                score={student.score}
                examType={student.examType}
                avatar={student.avatar}
              />
            ))}
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col justify-center items-center p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Bạn sẽ là người tiếp theo?</h3>
              <p className="text-gray-600 mb-6">Hãy để HOCMAI đồng hành cùng bạn trên con đường chinh phục kỳ thi đại học sắp tới!</p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full py-3 px-6 text-white font-medium transition-all duration-300 hover:-translate-y-1">
                Đăng ký học thử
              </Button>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="p-6 inline-block bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-amber-100 shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-amber-900">98.5% học sinh hài lòng về lộ trình học tập</h3>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-yellow-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">Tham gia cùng hơn 5000+ học sinh 2K8 đã đăng ký khóa học tại HOCMAI</p>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-full py-3 px-8 text-white font-medium transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Xem thêm đánh giá
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-red-900 z-0"></div>
        <div className="absolute inset-0 bg-pattern opacity-20 mix-blend-overlay z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-yellow-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">Còn {remainingSeats} suất cuối cùng</span>
              <h2 className="text-4xl font-bold mb-4 text-white relative inline-block">
                ĐĂNG KÝ NGAY HÔM NAY
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-200 mt-6 max-w-2xl mx-auto">Bứt phá điểm số trong kỳ thi ĐGNL/ĐGTD và xét tuyển đại học 2025</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-12 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-center text-white">ĐẶT CHỖ SỚM - ƯU ĐÃI LỚN</h3>
              <div className="flex justify-center items-center mb-4">
                <div className="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full animate-pulse">
                  GIẢM GIÁ ĐẾN 30% CHỈ TRONG HÔM NAY
                </div>
              </div>
              <CountdownTimer 
                title="Thời gian ưu đãi còn lại" 
                targetDate={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 30 * 60 * 1000)} 
                expiredMessage="Ưu đãi đã kết thúc!" 
              />
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-6">Quyền lợi khi đăng ký</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lộ trình học tập cá nhân hóa</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tài liệu độc quyền theo cấu trúc đề thi mới</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Hướng dẫn học tập 1-1 từ chuyên gia</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Thi thử trên nền tảng iTest độc quyền</span>
                    </li>
                  </ul>
                </div>
                
                <div className="md:w-3/5 p-10">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Thông tin đăng ký</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Bạn là</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="role" 
                              value="parent"
                              checked={role === "parent"}
                              onChange={() => setRole("parent")}
                              className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span>Phụ huynh</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="role" 
                              value="student"
                              checked={role === "student"}
                              onChange={() => setRole("student")}
                              className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span>Học sinh</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Khối lớp</label>
                        <select 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          required
                        >
                          <option value="">Chọn khối lớp</option>
                          <option value="10">Lớp 10</option>
                          <option value="11">Lớp 11</option>
                          <option value="12">Lớp 12</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Họ tên</label>
                      <Input 
                        type="text" 
                        placeholder="Nhập họ tên" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Số điện thoại</label>
                        <Input 
                          type="tel" 
                          placeholder="Nhập số điện thoại" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                        <Input 
                          type="email" 
                          placeholder="Nhập email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Kỳ thi quan tâm</label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                      >
                        <option value="">Chọn kỳ thi</option>
                        <option value="hsa">Luyện thi ĐGNL ĐHQG HN (HSA)</option>
                        <option value="hcm">Luyện thi ĐGNL ĐHQG HCM (HCM)</option>
                        <option value="tsa">Luyện thi ĐGNL ĐGTD ĐHBK (TSA)</option>
                        <option value="ielts">Luyện thi IELTS</option>
                        <option value="other">Tôi cần tư vấn thêm kỳ thi</option>
                      </select>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      ĐĂNG KÝ NGAY - NHẬN TƯ VẤN MIỄN PHÍ
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Bạn sẽ nhận được tư vấn miễn phí từ đội ngũ chuyên gia <br/> 
                      của HOCMAI trong vòng 24 giờ sau khi đăng ký
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Đăng ký thành công modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký thành công!</h3>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 mb-8">
                Cảm ơn bạn đã đăng ký khóa học tại HOCMAI. Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
              <Button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-8 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 