"use client";
import { Button } from "@/components/ui/button";
import {
  BellDot,
  Menu,
  Search,
  X,
  LogOut,
  User,
  Book,
  Settings,
  Bell,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useTheme } from "@/app/_context/ThemeContext";
import { auth, db } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";
import SideNav from "./SideNav";
import { doc, onSnapshot } from "firebase/firestore";
import { useMobileMenu } from "@/app/_context/MobileMenuContext";

function Header() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();

  const handleSignOut = async () => {
    try {
      // Gọi API để xóa cookie
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Xóa dữ liệu từ localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Đăng xuất khỏi Firebase
      auth.signOut();

      // Chuyển hướng về trang đăng nhập
      router.push("/sign-in");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <>
      <div className="px-3 md:px-4 py-2 bg-[var(--header-background)] flex justify-between items-center border-b border-[var(--border-color)] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="hover:bg-[var(--hover-color)] p-1.5 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-lg md:text-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff7875] text-transparent bg-clip-text tracking-wider">
              <span className="hidden md:inline">KHOAHOC</span>
              <span className="text-[#ff4d4f]">
                <span className="hidden md:inline">.</span>
                <span className="hidden md:inline">LIVE</span>
              </span>
            </span>
          </Link>
        </div>

        {/* Search bar - Desktop */}
        <div className="hidden md:flex flex-1 px-4 lg:px-6">
          <div className="relative max-w-[680px] mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[var(--input-background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20 text-sm text-[var(--text-color)] placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          {/* Search Icon - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden hover:bg-[var(--hover-color)] p-1.5 rounded-lg transition-colors"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>

          {/* Nút chuyển chế độ sáng/tối - Ẩn trên mobile */}
          <div className="hidden md:flex relative items-center">
            <button
              onClick={toggleTheme}
              className="flex items-center focus:outline-none"
              aria-label={
                theme === "dark"
                  ? "Chuyển sang chế độ sáng"
                  : "Chuyển sang chế độ tối"
              }
            >
              <div
                className={`w-12 h-6 rounded-full p-1 flex items-center ${
                  theme === "dark" ? "bg-slate-700" : "bg-blue-100"
                } transition-colors shadow-md`}
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full transform transition-transform shadow-sm ${
                    theme === "dark"
                      ? "translate-x-6 bg-indigo-400"
                      : "translate-x-0 bg-yellow-400"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="h-3 w-3 text-white" />
                  ) : (
                    <Sun className="h-3 w-3 text-amber-700" />
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Số dư - Desktop */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--card-background)]/50 rounded-full border border-[var(--border-color)]">
              <Wallet className="h-4 w-4 text-[#ff4d4f]" />
              <span className="text-sm font-medium text-[var(--text-color)]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(profile?.balance || 0)}
              </span>
            </div>
          )}

          {/* Số dư - Mobile - Thu gọn hơn */}
          {user && (
            <div className="md:hidden flex items-center px-1.5 py-1 bg-[var(--card-background)]/50 rounded-lg border border-[var(--border-color)]">
              <Wallet className="h-3.5 w-3.5 text-[#ff4d4f]" />
              <span className="text-xs font-medium text-[var(--text-color)] ml-1">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
                  .format(profile?.balance || 0)
                  .replace(/\s+₫/, "₫")}
              </span>
            </div>
          )}

          {/* Notifications */}
          <button className="relative hover:bg-[var(--hover-color)] p-1.5 rounded-lg transition-colors">
            <Bell className="text-gray-400 h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4d4f] rounded-full"></span>
          </button>

          {user ? (
            <div className="relative">
              {/* User Menu Button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:bg-[var(--hover-color)] p-1.5 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--card-background)] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#ff4d4f]" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-[var(--text-color)]">
                  {profile?.fullName?.split(" ").pop() || "User"}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-[var(--card-background)] rounded-lg shadow-lg border border-[var(--border-color)] py-1">
                  {/* Nút chuyển chế độ sáng/tối - Chỉ hiển thị trong menu trên mobile */}
                  <div className="md:hidden flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] border-b border-[var(--border-color)]">
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-400" />
                    )}
                    <button onClick={toggleTheme} className="w-full text-left">
                      {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                    </button>
                  </div>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="h-5 w-5 text-gray-400" />
                    <span>Hồ sơ</span>
                  </Link>
                  <Link
                    href="/my-courses"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Book className="h-5 w-5 text-gray-400" />
                    <span>Khóa học của tôi</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span>Cài đặt</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ff4d4f] hover:bg-[var(--hover-color)]"
                  >
                    <LogOut className="h-5 w-5 text-[#ff4d4f]" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                size="sm"
                className="h-8 text-sm bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="fixed top-[48px] left-0 right-0 p-2 bg-[var(--header-background)] border-b border-[var(--border-color)] z-40 md:hidden">
          <div className="flex items-center gap-2 bg-[var(--input-background)]/50 py-1.5 px-3 rounded-full border border-[var(--border-color)]">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
              className="bg-transparent outline-none w-full text-sm text-[var(--text-color)] placeholder:text-gray-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[48px] left-0 bottom-0 w-64 bg-[var(--sidebar-background)] z-40 md:hidden overflow-y-auto border-r border-[var(--border-color)]">
          <SideNav />
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => {
            closeMobileMenu();
            setIsUserMenuOpen(false);
          }}
        />
      )}

      {/* Spacer for fixed header */}
      <div className="h-[48px]"></div>
    </>
  );
}

export default Header;
