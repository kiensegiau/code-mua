"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Camera,
  Moon,
  Sun,
  Facebook,
  Github,
  Google,
  Twitter,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "security", label: "Bảo mật", icon: Lock },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "appearance", label: "Giao diện", icon: Palette },
    { id: "billing", label: "Thanh toán", icon: CreditCard },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const getTabClassName = (tabId) => {
    return `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      activeTab === tabId ? "bg-[#ff4d4f] text-white" : "hover:bg-white/5"
    }`;
  };

  const getConnectedButtonClassName = (isConnected) => {
    return `px-4 py-2 rounded-lg transition-colors ${
      isConnected
        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
        : "bg-[#ff4d4f]/10 text-[#ff4d4f] hover:bg-[#ff4d4f]/20"
    }`;
  };

  const getToggleClassName = (enabled) => {
    return `w-12 h-6 rounded-full transition-colors ${
      enabled ? "bg-[#ff4d4f]" : "bg-gray-700"
    } relative`;
  };

  const getToggleKnobClassName = (enabled) => {
    return `absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
      enabled ? "translate-x-6" : "translate-x-0"
    }`;
  };

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Cài đặt tài khoản</h1>
          <p className="text-gray-400">
            Quản lý thông tin và tùy chỉnh tài khoản của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                variants={itemVariants}
                onClick={() => setActiveTab(tab.id)}
                className={getTabClassName(tab.id)}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="bg-[#1f1f1f] rounded-2xl p-6">
            {activeTab === "profile" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden">
                      <img
                        src="https://via.placeholder.com/96"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff4d4f] rounded-full flex items-center justify-center hover:bg-[#ff4d4f]/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Nguyễn Văn A</h3>
                    <p className="text-gray-400">Học sinh lớp 12</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      placeholder="example@email.com"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      placeholder="0123456789"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Trường học
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      placeholder="THPT Chu Văn An"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button className="px-6 py-2.5 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors">
                    Lưu thay đổi
                  </button>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">Đổi mật khẩu</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors"
                      />
                    </div>
                    <button className="px-6 py-2.5 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors">
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">Xác thực 2 lớp</h3>
                  <div className="flex items-center justify-between p-4 bg-[#141414] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-[#ff4d4f]" />
                      <div>
                        <p className="font-medium">Bảo mật 2 lớp qua SMS</p>
                        <p className="text-sm text-gray-400">
                          Bảo vệ tài khoản bằng mã xác thực gửi qua tin nhắn
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-[#ff4d4f] text-[#ff4d4f] rounded-lg hover:bg-[#ff4d4f] hover:text-white transition-colors">
                      Kích hoạt
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">Tài khoản liên kết</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Google, name: "Google", connected: true },
                      { icon: Facebook, name: "Facebook", connected: false },
                      { icon: Github, name: "Github", connected: false },
                    ].map((account) => (
                      <div
                        key={account.name}
                        className="flex items-center justify-between p-4 bg-[#141414] rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <account.icon className="w-6 h-6" />
                          <span>{account.name}</span>
                        </div>
                        <button
                          className={getConnectedButtonClassName(
                            account.connected
                          )}
                        >
                          {account.connected ? "Đã kết nối" : "Kết nối"}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">Tùy chọn thông báo</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Thông báo khóa học",
                        description:
                          "Nhận thông báo về bài học mới và cập nhật khóa học",
                        enabled: true,
                      },
                      {
                        title: "Thông báo bài tập",
                        description: "Nhận thông báo về bài tập và deadline",
                        enabled: true,
                      },
                      {
                        title: "Thông báo tin tức",
                        description: "Nhận thông báo về tin tức và sự kiện mới",
                        enabled: false,
                      },
                      {
                        title: "Email marketing",
                        description: "Nhận email về khuyến mãi và ưu đãi",
                        enabled: false,
                      },
                    ].map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#141414] rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-400">
                            {notification.description}
                          </p>
                        </div>
                        <button
                          className={getToggleClassName(notification.enabled)}
                        >
                          <span
                            className={getToggleKnobClassName(
                              notification.enabled
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">Tùy chỉnh giao diện</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[#141414] rounded-lg">
                      <div className="flex items-center space-x-3">
                        {darkMode ? (
                          <Moon className="w-6 h-6" />
                        ) : (
                          <Sun className="w-6 h-6" />
                        )}
                        <div>
                          <p className="font-medium">Chế độ tối</p>
                          <p className="text-sm text-gray-400">
                            Điều chỉnh giao diện sáng/tối
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={getToggleClassName(darkMode)}
                      >
                        <span className={getToggleKnobClassName(darkMode)} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-400">
                        Ngôn ngữ
                      </label>
                      <select className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-400">
                        Font chữ
                      </label>
                      <select className="w-full px-4 py-2.5 bg-[#141414] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors">
                        <option value="system">Mặc định hệ thống</option>
                        <option value="serif">Serif</option>
                        <option value="sans">Sans-serif</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-xl font-semibold">
                    Thông tin thanh toán
                  </h3>
                  <div className="p-4 bg-[#141414] rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-3 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <p className="font-medium">Gói Premium - Còn 280 ngày</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#141414] rounded-lg border border-gray-800">
                      <h4 className="text-lg font-semibold mb-4">
                        Phương thức thanh toán
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                          <img src="/visa.png" alt="Visa" className="h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ****4242</p>
                          <p className="text-sm text-gray-400">Hết hạn 12/24</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[#141414] rounded-lg border border-gray-800">
                      <h4 className="text-lg font-semibold mb-4">
                        Lịch sử thanh toán
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Gói Premium - 1 năm</p>
                            <p className="text-sm text-gray-400">20/03/2024</p>
                          </div>
                          <p className="font-medium">1,990,000đ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-2.5 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors">
                      Nâng cấp gói
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
