"use client";
import React from 'react';
import { motion } from 'framer-motion';
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

      {/* Floating elements in the background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-[#ff4d4f]/5 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 5,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#1f1f1f] to-[#141414] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Đội ngũ hỗ trợ chuyên nghiệp, nhiệt tình 24/7. Hãy liên hệ với chúng tôi qua các kênh bên dưới.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1f1f1f] rounded-xl p-6 hover:bg-[#1f1f1f]/80 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#ff4d4f] hover:text-[#ff4d4f]/90 transition-colors"
                >
                  <span>{method.buttonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Support Info */}
      <div className="py-12 md:py-16 bg-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ff4d4f]">
                <Phone className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Hotline</h3>
              </div>
              <p className="text-2xl font-bold">1900 xxxx</p>
              <p className="text-gray-400">Hỗ trợ 24/7 cho mọi vấn đề của bạn</p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ff4d4f]">
                <Mail className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-2xl font-bold">support@example.com</p>
              <p className="text-gray-400">Phản hồi trong vòng 24 giờ</p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ff4d4f]">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Giờ làm việc</h3>
              </div>
              <p className="text-2xl font-bold">8:00 - 22:00</p>
              <p className="text-gray-400">Từ thứ 2 đến Chủ nhật</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Support Categories */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {supportCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#1f1f1f] rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-[#ff4d4f]/10 text-[#ff4d4f] flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer">
                      <ChevronRight className="w-4 h-4 text-[#ff4d4f]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 