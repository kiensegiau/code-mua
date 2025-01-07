"use client";

import React from "react";
import Header from "../../_components/Header";
import SideNav from "../../_components/SideNav";
import CourseList from "../_components/CourseList";

function Grade11Courses() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="w-64 hidden md:block fixed h-[calc(100vh-4rem)] top-16">
          <SideNav />
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-64 px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Khóa học lớp 11
              </h1>
              <p className="text-gray-400">
                Các khóa học dành cho học sinh lớp 11
              </p>
            </div>

            <CourseList grade="11" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Grade11Courses;
