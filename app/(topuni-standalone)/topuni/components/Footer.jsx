"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Placeholder khi chưa hydrate
  if (!isClient) {
    return (
      <div className="w-full bg-gray-100 h-64 animate-pulse"></div>
    );
  }
  
  return (
    <motion.footer 
      className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600 rounded-full opacity-10"></div>
        <div className="absolute top-40 -left-12 w-32 h-32 bg-indigo-600 rounded-full opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400 rounded-full opacity-5"></div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <motion.div 
            className="col-span-1 md:col-span-1"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-[50px] h-[50px] bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold rounded-xl shadow-lg">
                TU
              </div>
              <div className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                TopUni
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              TopUni - Đơn vị luyện thi đại học hàng đầu với đội ngũ giảng viên giàu kinh nghiệm, phương pháp giảng dạy hiệu quả và thành tích đầu vào đại học xuất sắc.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300">
                <FaFacebook className="text-white" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300">
                <FaYoutube className="text-white" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300">
                <FaTiktok className="text-white" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300">
                <FaInstagram className="text-white" />
              </Link>
            </div>
          </motion.div>
          
          {/* Links section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Liên kết
            </h3>
            <ul className="space-y-2">
              {["Trang chủ", "Về chúng tôi", "Khóa học", "Giảng viên", "Lịch khai giảng", "Học liệu"].map((item, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="text-gray-300 hover:text-white flex items-center transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaPhone className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="text-white font-medium">Hotline</p>
                  <p className="text-gray-300">1900 6868</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-300">contact@topuni.edu.vn</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="text-white font-medium">Địa chỉ</p>
                  <p className="text-gray-300">Số 8 Tôn Thất Thuyết, Mỹ Đình, Hà Nội</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          {/* Newsletter signup */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Đăng ký tư vấn
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Để lại thông tin để nhận tư vấn miễn phí về lộ trình học tập phù hợp
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-1 top-1 bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-lg text-white font-medium">
                Gửi
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div 
          className="my-8 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        ></motion.div>
        
        {/* Copyright */}
        <motion.div 
          className="mt-8 pt-6 text-center text-gray-400 text-sm"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} TopUni. Tất cả các quyền được bảo lưu.</p>
            <div className="mt-3 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-blue-300 transition-colors mx-2">Điều khoản sử dụng</Link>
              <span className="text-gray-600">|</span>
              <Link href="#" className="text-gray-400 hover:text-blue-300 transition-colors mx-2">Chính sách bảo mật</Link>
            </div>
          </div>
          
          {/* Back to top button */}
          <motion.a 
            href="#top" 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 fixed bottom-4 right-4 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 