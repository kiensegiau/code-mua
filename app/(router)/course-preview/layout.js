"use client";
import React from "react";
import SideNav from "../_components/SideNav";
import Header from "../_components/Header";
import { MobileMenuProvider } from "@/app/_context/MobileMenuContext";

function CoursePreviewLayout({ children }) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-[#141414] text-white">
        {/* Header - cố định ở trên cùng */}
        <Header />

        <div className="flex pt-16">
          {" "}
          {/* pt-16 để tránh nội dung bị che bởi header cố định */}
          {/* Sidebar - cố định bên trái, ẩn trên mobile */}
          <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)] top-16">
            <SideNav />
          </div>
          {/* Main content - đặc biệt cho trang xem trước khóa học */}
          <div className="w-full md:pl-64">
            <main className="px-0 md:px-0 py-0 md:py-0">{children}</main>
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  );
}

export default CoursePreviewLayout;
