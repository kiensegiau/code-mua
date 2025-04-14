"use client";
import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";
import { MobileMenuProvider } from "@/app/_context/MobileMenuContext";

function Layout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (!themeInitialized) {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
        document.documentElement.classList.remove("light-theme");
      } else if (savedTheme === "light") {
        document.documentElement.classList.remove("dark-theme");
        document.documentElement.classList.add("light-theme");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark-theme");
          document.documentElement.classList.remove("light-theme");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark-theme");
          document.documentElement.classList.add("light-theme");
          localStorage.setItem("theme", "light");
        }
      }

      setThemeInitialized(true);
    }
  }, [themeInitialized]);

  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
        <Header />

        <div className="">
          {" "}
          {/* pt-16 để tránh nội dung bị che bởi header cố định */}
          {/* Sidebar - cố định bên trái, ẩn trên mobile */}
          <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)] top-16 z-40">
            <SideNav />
          </div>
          {/* Main content */}
          <div className="w-full md:pl-64">
            <main className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 pb-20 md:pb-6">
              <div className="max-w-[1920px] mx-auto">
                {isMounted ? (
                  children
                ) : (
                  <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-[#ff4d4f] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  );
}

export default Layout;
