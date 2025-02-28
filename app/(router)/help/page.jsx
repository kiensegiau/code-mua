"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import {
  Facebook,
  MessageCircle,
  Send,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  HelpCircle,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HelpPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Scroll-triggered animations control
  const controls = useAnimation();
  const supportControls = useAnimation();
  const categoryControls = useAnimation();

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    // Start animations immediately when component mounts
    controls.start("visible");
    supportControls.start("visible");
    categoryControls.start("visible");
    
    const handleScroll = () => {
      // These will add additional animation effects on scroll
      // but content will be visible from the start
      if (window.scrollY > 100) {
        controls.start("visible");
      }
      
      if (window.scrollY > 300) {
        supportControls.start("visible");
      }
      
      if (window.scrollY > 500) {
        categoryControls.start("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial scroll handler to check initial position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, supportControls, categoryControls]);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesLoaded = async (container) => {
    console.log("Particles container loaded", container);
  };

  const particlesConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      color: {
        value: "#ff4d4f",
      },
      links: {
        color: "#ff4d4f",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  const contactMethods = [
    {
      icon: Facebook,
      title: 'Facebook',
      description: 'Theo dõi và nhắn tin qua Facebook',
      link: 'https://facebook.com/your-page',
      color: 'bg-blue-500/10 text-blue-500',
      buttonText: 'Truy cập Facebook'
    },
    {
      icon: MessageCircle,
      title: 'Zalo',
      description: 'Nhắn tin nhanh qua Zalo',
      link: 'https://zalo.me/your-number',
      color: 'bg-blue-400/10 text-blue-400',
      buttonText: 'Mở Zalo'
    },
    {
      icon: Send,
      title: 'Telegram',
      description: 'Liên hệ qua Telegram',
      link: 'https://t.me/your-username',
      color: 'bg-sky-400/10 text-sky-400',
      buttonText: 'Mở Telegram'
    }
  ];

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'Câu hỏi thường gặp',
      description: 'Tìm câu trả lời nhanh cho các vấn đề phổ biến',
      items: [
        'Làm sao để bắt đầu học?',
        'Cách thanh toán học phí',
        'Quên mật khẩu',
        'Vấn đề kỹ thuật'
      ]
    },
    {
      icon: FileText,
      title: 'Hướng dẫn sử dụng',
      description: 'Tài liệu chi tiết về cách sử dụng platform',
      items: [
        'Hướng dẫn xem video',
        'Cách làm bài tập',
        'Tải tài liệu',
        'Theo dõi tiến độ'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Hỗ trợ trực tiếp',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn',
      items: [
        'Chat trực tuyến',
        'Gọi điện thoại',
        'Gửi email',
        'Đặt lịch hẹn'
      ]
    }
  ];

  // Button hover animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  // List item hover animation
  const listItemVariants = {
    initial: { x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesConfig}
        />
      </div>

      {/* Floating elements in the background with improved animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              background: `radial-gradient(circle, rgba(255,77,79,0.15) 0%, rgba(255,77,79,0) 70%)`,
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, 20, -20, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section with parallax effect */}
      <motion.div 
        className="relative bg-gradient-to-b from-[#1f1f1f] to-[#141414] py-16 md:py-24"
        style={{ opacity: opacityTransform }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Đội ngũ hỗ trợ chuyên nghiệp, nhiệt tình 24/7. Hãy liên hệ với chúng tôi qua các kênh bên dưới.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Decorative element with scroll parallax */}
        <motion.div 
          className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-r from-[#141414] via-[#ff4d4f]/10 to-[#141414] opacity-30"
          style={{ y: yParallax }}
        />
      </motion.div>

      {/* Contact Methods with enhanced animations */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="visible"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer relative z-10"
              >
                <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4 hover:rotate-12 transition-all duration-300`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#ff4d4f] transition-colors group"
                >
                  <span className="group-hover:underline">{method.buttonText}</span>
                  <span className="transform transition-transform group-hover:translate-x-1">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Support Info with scroll reveal */}
      <div className="py-12 md:py-16 bg-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="visible"
            animate={supportControls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={itemVariants} 
              className="space-y-4 hover:bg-[#292929] p-4 rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-[#ff4d4f] group">
                <Phone className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <h3 className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">Hotline</h3>
              </div>
              <p className="text-2xl font-bold hover:text-[#ff4d4f] transition-colors duration-300">
                1900 xxxx
              </p>
              <p className="text-gray-400">Hỗ trợ 24/7 cho mọi vấn đề của bạn</p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="space-y-4 hover:bg-[#292929] p-4 rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-[#ff4d4f] group">
                <Mail className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <h3 className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">Email</h3>
              </div>
              <p className="text-2xl font-bold hover:text-[#ff4d4f] transition-colors duration-300">
                support@example.com
              </p>
              <p className="text-gray-400">Phản hồi trong vòng 24 giờ</p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="space-y-4 hover:bg-[#292929] p-4 rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-[#ff4d4f] group">
                <Clock className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <h3 className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">Giờ làm việc</h3>
              </div>
              <p className="text-2xl font-bold hover:text-[#ff4d4f] transition-colors duration-300">
                8:00 - 22:00
              </p>
              <p className="text-gray-400">Từ thứ 2 đến Chủ nhật</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Support Categories with interactive elements */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="visible"
            animate={categoryControls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {supportCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:bg-[#252525] relative z-10"
              >
                <div className="w-12 h-12 rounded-lg bg-[#ff4d4f]/10 text-[#ff4d4f] flex items-center justify-center mb-4 hover:rotate-[360deg] transition-all duration-700 ease-in-out">
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li 
                      key={i} 
                      className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer group transition-colors duration-300"
                    >
                      <ChevronRight className="w-4 h-4 text-[#ff4d4f] group-hover:text-[#ff7070] transition-colors duration-300 group-hover:translate-x-1 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Feedback button that follows scroll */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button
          className="bg-[#ff4d4f] text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-[#ff3538] hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Hỗ trợ ngay</span>
        </button>
      </motion.div>
    </div>
  );
} 