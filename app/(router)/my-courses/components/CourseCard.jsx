"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock, BarChart, Award } from "lucide-react";

function CourseCard({ course }) {
  const {
    id,
    title,
    description,
    thumbnail,
    progress,
    totalLessons,
    completedLessons,
    lastAccessed,
    instructor,
  } = course;

  // Tính toán phần trăm hoàn thành
  const completionPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  // Định dạng ngày truy cập cuối
  const formatLastAccessed = (date) => {
    if (!date) return "Chưa truy cập";
    const lastDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return lastDate.toLocaleDateString("vi-VN");
  };

  return (
    <motion.div
      className="bg-[var(--card-background)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/course-preview/${id}`}>
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
              <p className="text-sm text-gray-300 mt-1">
                Giảng viên: {instructor}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {description}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Tiến độ</span>
            <span className="text-[#ff4d4f] font-medium">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#ff4d4f] h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Course stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <Play className="h-4 w-4 text-[#ff4d4f] mx-auto mb-1" />
            <div className="text-xs text-gray-400">
              {completedLessons}/{totalLessons} bài học
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <Clock className="h-4 w-4 text-[#ff4d4f] mx-auto mb-1" />
            <div className="text-xs text-gray-400">
              {formatLastAccessed(lastAccessed)}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <Award className="h-4 w-4 text-[#ff4d4f] mx-auto mb-1" />
            <div className="text-xs text-gray-400">
              {completionPercentage >= 100 ? "Hoàn thành" : "Đang học"}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/course-preview/${id}`}
            className="w-full bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {completionPercentage >= 100 ? "Xem lại" : "Tiếp tục học"}
            <Play className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard; 