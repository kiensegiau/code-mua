"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

function GradeHeader({ grade, description }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-12 h-12 bg-[#ff4d4f]/10 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[#ff4d4f]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Khối {grade}
          </h1>
          <p className="text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default GradeHeader; 