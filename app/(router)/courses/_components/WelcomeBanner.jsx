"use client";
import React, { memo, useCallback, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useTheme } from "@/app/_context/ThemeContext";
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
import { useRouter } from "next/navigation";

// Wrap component bằng memo để tránh render không cần thiết
const WelcomeBanner = memo(function WelcomeBanner() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const isLightTheme = theme === "light";

  // Giảm độ phức tạp của animation để cải thiện hiệu suất
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03, // Giảm stagger delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 }, // Giảm y offset để giảm bớt tải động hoạ
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Giảm thời gian animation
      },
    },
  };

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Thực hiện tìm kiếm
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [searchQuery, router]
  );

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-xl theme-card border theme-border WelcomeBanner welcome-section
        ${
          isLightTheme
            ? "welcome-banner-bg-light"
            : "welcome-banner-bg-dark border-gray-800"
        }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout="position" // Giúp tránh reflow
    >
      {/* Grid background - static */}
      <div
        className={`absolute inset-0 ${
          isLightTheme ? "bg-grid-black/5" : "bg-grid-white/5"
        }`}
      />

      {/* Blob decorations - static để giảm tải */}
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#ff4d4f]/10 rounded-full blur-3xl" />
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#ff4d4f]/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div className="max-w-2xl" variants={containerVariants}>
          <motion.h1
            className={`text-2xl md:text-3xl font-bold mb-3 welcome-text ${
              isLightTheme ? "text-gray-800" : "text-gray-200"
            }`}
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
            className={`text-sm md:text-base mb-6 welcome-subtext ${
              isLightTheme ? "text-gray-600" : "text-gray-400"
            }`}
            variants={itemVariants}
          >
            Học tập, phát triển và nâng cao kỹ năng của bạn với hơn 100+ khóa
            học chất lượng cao
          </motion.p>

          {/* Search bar */}
          <motion.form
            className="relative mb-6 max-w-md"
            variants={itemVariants}
            onSubmit={handleSearchSubmit}
          >
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isLightTheme ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/30 text-sm placeholder:text-gray-500 theme-input
                  ${
                    isLightTheme
                      ? "bg-white border border-gray-300 text-gray-800"
                      : "bg-[#2c2c2c] border border-gray-700 text-gray-200"
                  }`}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </motion.form>

          {/* Stats - Sử dụng static elements thay vì animation */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {/* Static elements thay vì animation */}
            <motion.div
              variants={itemVariants}
              className={`rounded-lg p-4 border transition-colors welcome-card
              ${
                isLightTheme
                  ? "bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:bg-white/90"
                  : "bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:border-gray-600 hover:bg-gray-800/90"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#ff4d4f]" />
                <span
                  className={`font-medium welcome-text ${
                    isLightTheme ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  100+
                </span>
              </div>
              <p
                className={`text-xs welcome-subtext ${
                  isLightTheme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Khóa học
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`rounded-lg p-4 border transition-colors welcome-card
              ${
                isLightTheme
                  ? "bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:bg-white/90"
                  : "bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:border-gray-600 hover:bg-gray-800/90"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-[#ff4d4f]" />
                <span
                  className={`font-medium welcome-text ${
                    isLightTheme ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  50+
                </span>
              </div>
              <p
                className={`text-xs welcome-subtext ${
                  isLightTheme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Giảng viên
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`rounded-lg p-4 border transition-colors welcome-card
              ${
                isLightTheme
                  ? "bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:bg-white/90"
                  : "bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:border-gray-600 hover:bg-gray-800/90"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-[#ff4d4f]" />
                <span
                  className={`font-medium welcome-text ${
                    isLightTheme ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  1000+
                </span>
              </div>
              <p
                className={`text-xs welcome-subtext ${
                  isLightTheme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Học viên
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured course card - Tối ưu hóa animation */}
        <motion.div
          className={`hidden md:block w-72 lg:w-80 rounded-lg overflow-hidden shadow-lg mt-6 md:mt-0 welcome-card
            ${
              isLightTheme
                ? "bg-white border border-gray-200"
                : "bg-[#2c2c2c] border border-gray-700"
            }`}
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
            <h3
              className={`font-semibold mb-1 welcome-text ${
                isLightTheme ? "text-gray-800" : "text-gray-200"
              }`}
            >
              Luyện thi THPT Quốc Gia
            </h3>
            <p
              className={`text-xs mb-3 welcome-subtext ${
                isLightTheme ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Chuẩn bị tốt nhất cho kỳ thi quan trọng
            </p>
            <Link href="/courses/grade-12">
              <button className="w-full py-2 text-sm bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white rounded-md flex items-center justify-center gap-1 transition-colors">
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
