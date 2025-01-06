"use client";
import React from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Award,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Khóa học chất lượng",
      description:
        "Học từ những giảng viên giàu kinh nghiệm với nội dung cập nhật liên tục",
    },
    {
      icon: Users,
      title: "Cộng đồng lớn mạnh",
      description:
        "Tham gia cộng đồng hàng nghìn học viên để cùng nhau phát triển",
    },
    {
      icon: Star,
      title: "Học theo lộ trình",
      description: "Lộ trình học tập rõ ràng, từ cơ bản đến nâng cao",
    },
    {
      icon: Award,
      title: "Chứng chỉ giá trị",
      description: "Nhận chứng chỉ có giá trị sau khi hoàn thành khóa học",
    },
  ];

  const stats = [
    {
      value: "10K+",
      label: "Học viên",
    },
    {
      value: "100+",
      label: "Khóa học",
    },
    {
      value: "50+",
      label: "Giảng viên",
    },
    {
      value: "95%",
      label: "Đánh giá tích cực",
    },
  ];

  const highlights = [
    {
      icon: TrendingUp,
      title: "Học viên",
      description: "Nâng cao kỹ năng với các khóa học chất lượng",
      cta: "Xem khóa học",
      href: "/courses",
      color: "bg-blue-500",
    },
    {
      icon: DollarSign,
      title: "Cộng tác viên",
      description: "Kiếm thu nhập bằng cách giới thiệu khóa học",
      cta: "Tìm hiểu thêm",
      href: "/earnings",
      color: "bg-[#ff4d4f]",
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
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] bg-clip-text text-transparent mb-6">
                Nền Tảng Học Lập Trình Hàng Đầu
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Học lập trình trực tuyến với các khóa học chất lượng cao, giảng
                viên giàu kinh nghiệm và cộng đồng học viên năng động
              </p>
              <Link
                href="/courses"
                className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Khám phá khóa học
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-[#ff4d4f] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
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

            {/* Highlights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-8 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${item.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-4">{item.description}</p>
                    <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
                      {item.cta}
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#ff4d4f]/10 to-[#f5222d]/10 rounded-2xl p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Tham gia ngay hôm nay để trải nghiệm các khóa học chất lượng và
                phát triển sự nghiệp của bạn
              </p>
              <Link
                href="/courses"
                className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Bắt đầu học ngay
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
