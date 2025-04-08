"use client";
import React from "react";
import { motion } from "framer-motion";
import SettingsSection from "./SettingsSection";
import SettingsForm from "./SettingsForm";

function SettingsContent({ activeSection }) {
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <SettingsSection
            title="Thông tin cá nhân"
            description="Cập nhật thông tin cá nhân của bạn"
          >
            <SettingsForm onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                  />
                </div>
              </div>
            </SettingsForm>
          </SettingsSection>
        );
      case "notifications":
        return (
          <SettingsSection
            title="Thông báo"
            description="Quản lý cài đặt thông báo"
          >
            <SettingsForm onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email thông báo</h3>
                    <p className="text-sm text-gray-400">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff4d4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d4f]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Thông báo đẩy</h3>
                    <p className="text-sm text-gray-400">
                      Nhận thông báo đẩy trên trình duyệt
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff4d4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d4f]"></div>
                  </label>
                </div>
              </div>
            </SettingsForm>
          </SettingsSection>
        );
      case "security":
        return (
          <SettingsSection
            title="Bảo mật"
            description="Quản lý bảo mật tài khoản"
          >
            <SettingsForm onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Đổi mật khẩu</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Xác thực hai yếu tố</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        Bật xác thực hai yếu tố để tăng cường bảo mật
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ff4d4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d4f]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </SettingsForm>
          </SettingsSection>
        );
      default:
        return (
          <SettingsSection
            title="Thông tin cá nhân"
            description="Cập nhật thông tin cá nhân của bạn"
          >
            <SettingsForm onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
            </SettingsForm>
          </SettingsSection>
        );
    }
  };

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderContent()}
    </motion.div>
  );
}

export default SettingsContent; 