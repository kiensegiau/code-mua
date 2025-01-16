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
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { auth, db } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";
import SideNav from "./SideNav";
import { doc, onSnapshot } from "firebase/firestore";

function Header() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
console.log(profile);

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/sign-in");
  };
console.log(profile);

  return (
    <>
      <div className="px-3 md:px-4 py-2 bg-[#141414] flex justify-between items-center border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
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
              KHOAHOC<span className="text-[#ff4d4f]">.LIVE</span>
            </span>
          </Link>
        </div>

        {/* Search bar - Desktop */}
        <div className="flex-1 px-4 lg:px-6">
          <div className="relative max-w-[680px] mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1f1f1f] border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20 text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Icon - Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>

          {/* Số dư - Desktop */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700">
              <Wallet className="h-4 w-4 text-[#ff4d4f]" />
              <span className="text-sm font-medium text-gray-300">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(profile?.balance || 0)}
              </span>
            </div>
          )}

          {/* Notifications */}
          <button className="relative hover:bg-gray-800 p-1.5 rounded-lg transition-colors">
            <Bell className="text-gray-400 h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4d4f] rounded-full"></span>
          </button>

          {user ? (
            <div className="relative">
              {/* User Menu Button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#ff4d4f]" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-300">
                  {profile?.fullName?.split(" ").pop() || "User"}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-[#1f1f1f] rounded-lg shadow-lg border border-gray-800 py-1">
                  {/* Số dư - Mobile */}
                  <div className="md:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
                    <Wallet className="h-4 w-4 text-[#ff4d4f]" />
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(profile?.balance || 0)}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#ff4d4f]"
                  >
                    <User className="h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                  <Link
                    href="/my-courses"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#ff4d4f]"
                  >
                    <Book className="h-4 w-4" />
                    <span>Khóa học của tôi</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-[#ff4d4f]"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#ff4d4f] hover:bg-[#ff4d4f]/10"
                  >
                    <LogOut className="h-4 w-4" />
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
        <div className="fixed top-[48px] left-0 right-0 p-2 bg-[#141414] border-b border-gray-800 z-40 md:hidden">
          <div className="flex items-center gap-2 bg-gray-800/50 py-1.5 px-3 rounded-full border border-gray-700">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, môn học, giáo viên..."
              className="bg-transparent outline-none w-full text-sm text-gray-300 placeholder:text-gray-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[48px] left-0 bottom-0 w-64 bg-[#141414] z-40 md:hidden overflow-y-auto border-r border-gray-800">
          <SideNav />
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
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
