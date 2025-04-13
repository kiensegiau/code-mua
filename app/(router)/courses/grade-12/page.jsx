"use client";

import React, { useEffect } from "react";
import CourseList from "../_components/CourseList";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Award, Target } from "lucide-react";

function Grade12Courses() {
  // Scroll to top khi trang được load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pb-16"
      >
        {/* Header */}
        <motion.div
          className="mt-4 md:mt-6 mb-8 bg-gradient-to-r from-[#1f1f1f] to-black/40 p-6 md:p-8 rounded-2xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ff4d4f]/10 rounded-xl flex items-center justify-center text-[#ff4d4f]">
              <GraduationCap size={24} />
            </div>
            <div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Khóa học lớp 12
              </motion.h1>
              <motion.p
                className="text-gray-400 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Các khóa học luyện thi tốt nghiệp THPT và đại học cho học sinh
                lớp 12
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              className="bg-black/20 p-4 rounded-xl flex items-center gap-3"
              whileHover={{ y: -5, backgroundColor: "rgba(255, 77, 79, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                <Target size={18} />
              </div>
              <div>
                <p className="text-white font-medium">Luyện thi THPT QG</p>
                <p className="text-gray-400 text-sm">
                  Ôn luyện chuyên sâu theo hướng dẫn mới 2025 của Bộ GD&ĐT
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/20 p-4 rounded-xl flex items-center gap-3"
              whileHover={{ y: -5, backgroundColor: "rgba(255, 77, 79, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                <Award size={18} />
              </div>
              <div>
                <p className="text-white font-medium">Đề thi thử đại học</p>
                <p className="text-gray-400 text-sm">
                  Đề thi thử từ các trường đại học hàng đầu
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/20 p-4 rounded-xl flex items-center gap-3"
              whileHover={{ y: -5, backgroundColor: "rgba(255, 77, 79, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-white font-medium">
                  Chiến lược thi hiệu quả
                </p>
                <p className="text-gray-400 text-sm">
                  Phương pháp ôn tập và làm bài thi tối ưu
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Course List Container */}
        <motion.div
          className="mt-8 md:mt-10 bg-gradient-to-b from-black/30 to-transparent p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CourseList grade="grade-12" />
        </motion.div>

        {/* Page bottom decoration */}
        <motion.div
          className="mt-16 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p>Các khóa học lớp 12 được cập nhật thường xuyên</p>
          <div className="w-16 h-1 bg-[#ff4d4f]/30 mx-auto mt-2 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Grade12Courses;
