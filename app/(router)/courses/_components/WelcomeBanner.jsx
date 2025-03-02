"use client";
import React, { memo } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import {
  Sparkles,
  Rocket,
  BookOpen,
  Search,
  Star,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Wrap component bằng memo để tránh render không cần thiết
const WelcomeBanner = memo(function WelcomeBanner() {
  const { user } = useAuth();

  // Giảm độ phức tạp của animation để cải thiện hiệu suất
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Giảm stagger delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Giảm y offset để giảm bớt tải động hoạ
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, // Giảm thời gian animation
      },
    },
  };

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#121212] rounded-xl border border-gray-800 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout="position" // Giúp tránh reflow
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white/5" />

      {/* Blob decorations - static để giảm tải */}
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#ff4d4f]/10 rounded-full blur-3xl" />
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#ff4d4f]/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div className="max-w-2xl" variants={containerVariants}>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-200 mb-3"
            variants={itemVariants}
          >
            {user ? (
              <>
                Chào mừng trở lại,{" "}
                <span className="text-[#ff4d4f]">
                  {user.displayName || "bạn"}!
                </span>
              </>
            ) : (
              "Khám phá kiến thức mới"
            )}
          </motion.h1>

          <motion.p
            className="text-gray-400 text-sm md:text-base mb-6"
            variants={itemVariants}
          >
            Học tập, phát triển và nâng cao kỹ năng của bạn với hơn 100+ khóa
            học chất lượng cao
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="relative mb-6 max-w-md"
            variants={itemVariants}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#2c2c2c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/30 text-sm text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {/* Static elements thay vì animation */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors hover:bg-gray-800/90">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#ff4d4f]" />
                <span className="text-gray-200 font-medium">100+</span>
              </div>
              <p className="text-gray-400 text-xs">Khóa học</p>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors hover:bg-gray-800/90">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-[#ff4d4f]" />
                <span className="text-gray-200 font-medium">50+</span>
              </div>
              <p className="text-gray-400 text-xs">Giảng viên</p>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors hover:bg-gray-800/90">
              <div className="flex items-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-[#ff4d4f]" />
                <span className="text-gray-200 font-medium">1000+</span>
              </div>
              <p className="text-gray-400 text-xs">Học viên</p>
            </div>
          </div>
        </motion.div>

        {/* Featured course card */}
        <motion.div
          className="hidden md:block w-72 lg:w-80 bg-[#2c2c2c] rounded-lg border border-gray-700 overflow-hidden shadow-lg mt-6 md:mt-0"
          variants={itemVariants}
        >
          <div className="h-28 bg-gradient-to-r from-[#ff4d4f]/80 to-[#ff7875]/80 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-12 h-12 text-white opacity-20" />
            </div>
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              Khóa học nổi bật
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-gray-200 font-semibold mb-1">
              Luyện thi THPT Quốc Gia
            </h3>
            <p className="text-gray-400 text-xs mb-3">
              Chuẩn bị tốt nhất cho kỳ thi quan trọng
            </p>
            <Link href="/courses/grade-12">
              <button className="w-full py-2 text-sm bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white rounded-md flex items-center justify-center gap-1">
                Khám phá ngay <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default WelcomeBanner;
