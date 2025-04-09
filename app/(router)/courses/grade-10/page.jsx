"use client";

import React, { useEffect } from "react";
import CourseList from "../_components/CourseList";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";

function Grade10Courses() {
  // Scroll to top khi trang được load, sử dụng behavior: "auto" thay vì "smooth"
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []); // Dependency array trống

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
      layout="position"
    >
      {/* Decorative elements - giảm bớt hiệu ứng để giảm tải render */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pb-16"
      >
        {/* Header */}
        <motion.div
          className="mt-4 md:mt-6 mb-8 bg-gradient-to-r from-[#1f1f1f] to-black/40 p-6 md:p-8 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ff4d4f]/10 rounded-xl flex items-center justify-center text-[#ff4d4f]">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Khóa học lớp 10
              </h1>
              <p className="text-gray-400 mt-1">
                Các khóa học dành riêng cho học sinh lớp 10, được thiết kế phù
                hợp với chương trình giáo dục mới
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              className="bg-black/20 p-4 rounded-xl flex items-center gap-3"
              whileHover={{ y: -5, backgroundColor: "rgba(255, 77, 79, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-white font-medium">Đa dạng môn học</p>
                <p className="text-gray-400 text-sm">
                  Toán, Lý, Hóa, Sinh, Văn, Anh...
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
                <p className="text-white font-medium">Giáo viên chất lượng</p>
                <p className="text-gray-400 text-sm">
                  Đội ngũ giảng viên giàu kinh nghiệm
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
                <p className="text-white font-medium">Bài tập & kiểm tra</p>
                <p className="text-gray-400 text-sm">
                  Luyện tập và đánh giá thường xuyên
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Course List Container */}
        <motion.div
          className="mt-8 md:mt-10 bg-gradient-to-b from-black/30 to-transparent p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CourseList grade="grade-10" />
        </motion.div>

        {/* Page bottom decoration - static element */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Các khóa học lớp 10 được cập nhật thường xuyên</p>
          <div className="w-16 h-1 bg-[#ff4d4f]/30 mx-auto mt-2 rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Grade10Courses;
