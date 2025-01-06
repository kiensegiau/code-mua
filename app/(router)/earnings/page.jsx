"use client";
import React from "react";
import Header from "../_components/Header";
import SideNav from "../_components/SideNav";
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  ArrowRight,
  MessageCircle,
  Facebook,
  Phone,
} from "lucide-react";

function EarningsPage() {
  const features = [
    {
      icon: DollarSign,
      title: "Chia sẻ 50% doanh thu",
      description:
        "Nhận ngay 50% giá trị khóa học cho mỗi học viên bạn giới thiệu thành công",
    },
    {
      icon: Users,
      title: "Không giới hạn số lượng",
      description:
        "Càng nhiều học viên, thu nhập càng cao. Không có giới hạn về số lượng giới thiệu",
    },
    {
      icon: TrendingUp,
      title: "Thu nhập thụ động",
      description:
        "Xây dựng nguồn thu nhập thụ động, nhận hoa hồng mỗi khi có người mua khóa học",
    },
    {
      icon: Gift,
      title: "Ưu đãi hấp dẫn",
      description: "Nhận thêm nhiều ưu đãi đặc biệt khi đạt các mốc doanh số",
    },
  ];

  const contacts = [
    {
      icon: Phone,
      name: "Zalo",
      value: "0123.456.789",
      href: "https://zalo.me/0123456789",
      color: "bg-blue-500",
    },
    {
      icon: Facebook,
      name: "Facebook",
      value: "Code MUA",
      href: "https://facebook.com/codemua",
      color: "bg-[#1877f2]",
    },
    {
      icon: MessageCircle,
      name: "Telegram",
      value: "@codemua",
      href: "https://t.me/codemua",
      color: "bg-[#0088cc]",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="w-64 hidden md:block fixed h-[calc(100vh-4rem)] top-16">
          <SideNav />
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-64 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] bg-clip-text text-transparent mb-4">
                Kiếm Tiền Cùng Code MUA
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                Trở thành đối tác của chúng tôi và nhận ngay 50% doanh thu từ
                mỗi khóa học được bán ra thông qua bạn
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-[#ff4d4f]/10">
                        <Icon className="h-6 w-6 text-[#ff4d4f]" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#ff4d4f]/10 to-[#f5222d]/10 rounded-2xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Bắt đầu Kiếm Tiền Ngay Hôm Nay
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Chỉ cần chia sẻ link giới thiệu của bạn, chúng tôi sẽ lo phần
                còn lại. Hệ thống tự động theo dõi và ghi nhận tất cả các giao
                dịch.
              </p>
              <button className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
                Tham Gia Ngay
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#ff4d4f] mb-2">
                  50%
                </div>
                <div className="text-gray-400">Tỷ lệ chia sẻ doanh thu</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#ff4d4f] mb-2">
                  24/7
                </div>
                <div className="text-gray-400">Hỗ trợ đối tác</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#ff4d4f] mb-2">
                  1M+
                </div>
                <div className="text-gray-400">Đã chi trả cho đối tác</div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gray-800/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Liên Hệ Với Chúng Tôi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contacts.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                    >
                      <div className={`p-3 rounded-lg ${contact.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300">
                          {contact.name}
                        </div>
                        <div className="text-white font-medium">
                          {contact.value}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EarningsPage;
