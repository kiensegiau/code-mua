"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/app/_context/ThemeContext";

function WatchCourseLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
      {/* Layout riêng cho watch-course không có sidebar và header chung */}
      <main className="w-full">
        {isMounted ? (
          children
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#ff4d4f] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  );
}

export default WatchCourseLayout;
