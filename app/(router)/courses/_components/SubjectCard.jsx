"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock, Users, Star } from "lucide-react";

function SubjectCard({ subject }) {
  const {
    id,
    name,
    description,
    thumbnail,
    totalLessons,
    duration,
    students,
    rating,
  } = subject;

  return (
    <motion.div
      className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/courses/${id}`}>
        <div className="relative">
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[#ff4d4f]" />
            <span className="text-sm text-gray-400">{totalLessons} bài học</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff4d4f]" />
            <span className="text-sm text-gray-400">{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#ff4d4f]" />
            <span className="text-sm text-gray-400">{students} học viên</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ff4d4f]" />
            <span className="text-sm text-gray-400">{rating}/5</span>
          </div>
        </div>

        <Link
          href={`/courses/${id}`}
          className="w-full bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Xem chi tiết
          <Play className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default SubjectCard; 