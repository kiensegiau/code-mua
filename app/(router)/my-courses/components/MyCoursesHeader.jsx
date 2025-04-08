"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";

function MyCoursesHeader({ searchQuery, setSearchQuery }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-400">
            Quản lý và tiếp tục học các khóa học bạn đã đăng ký
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full bg-[var(--card-background)] border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

export default MyCoursesHeader; 