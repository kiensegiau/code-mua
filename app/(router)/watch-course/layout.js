"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function WatchCourseLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header tối giản cho trang xem khóa học */}
      <div className="bg-[#141414] h-14 flex items-center px-4 fixed top-0 left-0 right-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main content - chiếm toàn màn hình */}
      <div className="pt-14">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}

export default WatchCourseLayout;
