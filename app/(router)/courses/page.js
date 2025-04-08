"use client";
import React, { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";

// Lazy load các component để cải thiện thời gian tải trang
const WelcomeBanner = lazy(() => import("./_components/WelcomeBanner"));
const CourseList = lazy(() => import("./_components/CourseList"));

// Fallback components cho lazy loading
const WelcomeBannerFallback = () => (
  <div className="w-full h-64 rounded-xl bg-gray-800/50 animate-pulse"></div>
);

const CourseListFallback = () => (
  <div className="mt-8 md:mt-12 space-y-8">
    <div className="h-6 bg-gray-800 rounded w-48 animate-pulse"></div>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="aspect-video bg-gray-800 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

function Courses() {
  const { user } = useAuth();
  
  // Scroll to top khi trang được load, thêm empty array vào dependency
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    // Preload các component sau khi trang đã load
    const timer = setTimeout(() => {
      import("./_components/WelcomeBanner");
      import("./_components/CourseList");
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Dependency array trống để đảm bảo chỉ chạy một lần

  // Tối ưu animations để giảm tải cho CPU
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative"
      // Thêm layout="position" để tránh việc reflow liên tục
      layout="position"
    >
      {/* Decorative elements - static thay vì animated để giảm tải CPU */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#ff4d4f]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Giảm bớt số lượng animated elements */}
      <div className="absolute top-32 right-10 text-[#ff4d4f]/50 hidden lg:block">
        <Sparkles size={32} />
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {/* Banner */}
        <Suspense fallback={<WelcomeBannerFallback />}>
          <WelcomeBanner />
        </Suspense>

        {/* Course List Container */}
        <div className="mt-8 md:mt-12 bg-gradient-to-b from-black/30 to-transparent p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm">
          <Suspense fallback={<CourseListFallback />}>
            <CourseList />
          </Suspense>
        </div>

        {/* Page bottom decoration - static element thay vì animation */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Các khóa học được cập nhật thường xuyên</p>
          <div className="w-16 h-1 bg-[#ff4d4f]/30 mx-auto mt-2 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default Courses;
