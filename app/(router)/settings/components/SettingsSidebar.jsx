"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";

function SettingsSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Thông tin cá nhân",
      icon: <User className="w-5 h-5" />,
      href: "/settings/profile",
    },
    {
      name: "Thông báo",
      icon: <Bell className="w-5 h-5" />,
      href: "/settings/notifications",
    },
    {
      name: "Bảo mật",
      icon: <Lock className="w-5 h-5" />,
      href: "/settings/security",
    },
    {
      name: "Thanh toán",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/settings/billing",
    },
    {
      name: "Trợ giúp",
      icon: <HelpCircle className="w-5 h-5" />,
      href: "/settings/help",
    },
  ];

  return (
    <motion.div
      className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-[#ff4d4f] text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
          onClick={() => {/* TODO: Implement logout functionality */}}
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </motion.div>
  );
}

export default SettingsSidebar; 