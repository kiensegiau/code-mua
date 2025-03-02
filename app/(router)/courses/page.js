"use client";
import React, { useEffect } from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";
import { motion } from "framer-motion";
import { Sparkles, Leaf } from "lucide-react";

function Courses() {
  // Scroll to top khi trang được load, thêm empty array vào dependency
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []); // Dependency array trống để đảm bảo chỉ chạy một lần

  // Tối ưu animations để giảm tải cho CPU
  const decorElementVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
      // Thêm layout="position" để tránh việc reflow liên tục
      layout="position"
    >
      {/* Decorative elements - static thay vì animated để giảm tải CPU */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Giảm bớt số lượng animated elements */}
      <motion.div
        className="absolute top-32 right-10 text-[#ff4d4f]/50 hidden lg:block"
        initial={{ opacity: 0.3 }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Sparkles size={32} />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pb-16"
      >
        {/* Banner */}
        <WelcomeBanner />

        {/* Course List Container */}
        <motion.div
          className="mt-8 md:mt-12 bg-gradient-to-b from-black/30 to-transparent p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CourseList />
        </motion.div>

        {/* Page bottom decoration - static element thay vì animation */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Các khóa học được cập nhật thường xuyên</p>
          <div className="w-16 h-1 bg-[#ff4d4f]/30 mx-auto mt-2 rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Courses;
