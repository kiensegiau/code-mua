"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function HeroSection() {
  return (
    <motion.div
      className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-[#ff4d4f]/20 to-[#141414] flex items-center overflow-hidden mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 z-10">
        <motion.div
          className="max-w-3xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Học trực tuyến hiệu quả
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Nền tảng học trực tuyến hàng đầu với đội ngũ giáo viên chất lượng cao
            và phương pháp học tập hiệu quả.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4d4f] text-white rounded-lg font-medium hover:bg-[#ff4d4f]/90 transition-colors"
            >
              Khám phá khóa học
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HeroSection; 