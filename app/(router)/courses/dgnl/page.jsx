"use client";

import React, { useEffect, useState } from "react";
import CourseList from "../_components/CourseList";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Award, Target, Brain } from "lucide-react";

function DGNLCourses() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Scroll to top khi trang được load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Dữ liệu cho mỗi loại ĐGNL
  const dgnlTypes = [
    {
      id: "all",
      name: "Tất cả",
      description: "Tất cả các kỳ thi đánh giá năng lực",
      icon: <GraduationCap size={18} />,
    },
    {
      id: "hanoi",
      name: "ĐGNL Hà Nội",
      description: "Kỳ thi ĐGNL do Đại học Quốc gia Hà Nội tổ chức",
      icon: <BookOpen size={18} />,
      features: [
        "Đề thi gồm 150 câu hỏi trắc nghiệm",
        "Thời gian làm bài 195 phút",
        "Gồm 3 phần: Toán học & tư duy định lượng, Ngôn ngữ & tư duy logic, Giải quyết vấn đề"
      ]
    },
    {
      id: "hcm",
      name: "ĐGNL TP.HCM",
      description: "Kỳ thi ĐGNL do Đại học Quốc gia TP.HCM tổ chức",
      icon: <Award size={18} />,
      features: [
        "Đề thi gồm 120 câu hỏi trắc nghiệm",
        "Thời gian làm bài 150 phút",
        "Điểm thi có giá trị trong 2 năm",
        "Gồm 3 phần: Sử dụng ngôn ngữ, Toán học & tư duy logíc, Giải quyết vấn đề"
      ]
    },
    {
      id: "bachkhoa",
      name: "ĐGNL Bách Khoa",
      description: "Kỳ thi ĐGTD do Đại học Bách Khoa Hà Nội tổ chức",
      icon: <Target size={18} />,
      features: [
        "Bài thi đánh giá tư duy (ĐGTD)",
        "Thời gian làm bài 150 phút",
        "Gồm 4 phần: Đọc hiểu, Toán học, Khoa học tự nhiên và Khoa học xã hội"
      ]
    },
    {
      id: "supham",
      name: "ĐGNL Sư Phạm",
      description: "Kỳ thi ĐGNL do Đại học Sư Phạm Hà Nội tổ chức",
      icon: <Brain size={18} />,
      features: [
        "Điểm ưu tiên áp dụng theo quy chế tuyển sinh hiện hành",
        "Kết quả có giá trị trong năm tuyển sinh",
        "Gồm 3 phần: Ngôn ngữ, Toán học & tư duy khoa học, Giải quyết vấn đề"
      ]
    }
  ];

  // Lấy thông tin tab hiện tại
  const activeTabData = dgnlTypes.find(tab => tab.id === activeTab);

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
                Đánh giá năng lực (ĐGNL)
              </motion.h1>
              <motion.p
                className="text-gray-400 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Các khóa học luyện thi đánh giá năng lực từ các trường đại học
              </motion.p>
            </div>
          </div>

          {/* ĐGNL Tab Navigation */}
          <div className="mt-8 border-b border-gray-800">
            <div className="flex flex-wrap -mb-px gap-1">
              {dgnlTypes.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? "text-[#ff4d4f] border-b-2 border-[#ff4d4f] bg-[#ff4d4f]/5"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {tab.icon}
                  </div>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Description */}
          {activeTabData && activeTabData.id !== "all" && (
            <div className="mt-6 bg-black/20 p-4 sm:p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-2">{activeTabData.name}</h2>
              <p className="text-gray-300 mb-4">{activeTabData.description}</p>
              
              {activeTabData.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {activeTabData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f] flex-shrink-0">
                        <span className="text-xs">•</span>
                      </div>
                      <p className="text-sm text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTabData && activeTabData.id === "all" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {dgnlTypes.filter(type => type.id !== "all").map((type) => (
                <motion.div
                  key={type.id}
                  className="bg-black/20 p-4 rounded-xl flex flex-col gap-3 cursor-pointer"
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 77, 79, 0.1)" }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveTab(type.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                      {type.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{type.name}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Course List Container */}
        <motion.div
          className="mt-8 md:mt-10 bg-gradient-to-b from-black/30 to-transparent p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CourseList subject="assessment" dgnlType={activeTab !== "all" ? activeTab : undefined} />
        </motion.div>

        {/* Page bottom decoration */}
        <motion.div
          className="mt-16 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p>Các khóa học đánh giá năng lực được cập nhật thường xuyên</p>
          <div className="w-16 h-1 bg-[#ff4d4f]/30 mx-auto mt-2 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default DGNLCourses; 