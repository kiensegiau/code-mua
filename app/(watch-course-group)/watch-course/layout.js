"use client";
import React, { useEffect, useState, memo } from "react";
import { useTheme } from "@/app/_context/ThemeContext";

// Tạo component loading riêng để dễ bảo trì
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-[#ff4d4f] border-t-transparent rounded-full animate-spin"></div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const WatchCourseLayout = memo(({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
      {/* Layout riêng cho watch-course không có sidebar và header chung */}
      <main className="w-full">
        {isMounted ? children : <LoadingSpinner />}
      </main>
    </div>
  );
});

WatchCourseLayout.displayName = "WatchCourseLayout";

export default WatchCourseLayout;
