"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

function EmptyState() {
  return (
    <motion.div
      className="bg-[var(--card-background)] rounded-xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 bg-[#ff4d4f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-[#ff4d4f]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Bạn chưa có khóa học nào</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Bạn chưa đăng ký bất kỳ khóa học nào. Hãy khám phá các khóa học chất lượng
        của chúng tôi và bắt đầu hành trình học tập của bạn.
      </p>
      <Link
        href="/courses"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4d4f] text-white rounded-lg font-medium hover:bg-[#ff4d4f]/90 transition-colors"
      >
        Khám phá khóa học
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </motion.div>
  );
}

export default EmptyState; 