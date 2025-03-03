"use client";
import React, { useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  DollarSign,
  Award,
  Heart,
  BookOpen,
  Target,
  Zap,
  Star,
  Clock,
  Brain,
  Trophy,
  CheckCircle2,
  BarChart2,
  Lightbulb,
  School,
} from "lucide-react";

// Lazy load Particles component
const Particles = dynamic(
  () => import("react-tsparticles").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <></>,
  }
);

// Lazy load Particles initialization
const ParticlesBackground = lazy(() =>
  import("./components/ParticlesBackground")
);

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const stats = [
    { label: "Học sinh đỗ ĐH", value: "95%", icon: Trophy },
    { label: "Khóa học", value: "20+", icon: BookOpen },
    { label: "Giáo viên", value: "30+", icon: GraduationCap },
    { label: "Đánh giá", value: "4.8/5", icon: Star },
  ];

  const features = [
    {
      icon: DollarSign,
      title: "Học phí siêu tiết kiệm",
      description:
        "Chỉ từ 199k/môn học, rẻ hơn 70% so với học thêm truyền thống.",
    },
    {
      icon: Target,
      title: "Lộ trình chuẩn",
      description:
        "Học đúng trọng tâm, bài tập sát đề thi, tiết kiệm thời gian ôn luyện.",
    },
    {
      icon: Zap,
      title: "Phương pháp hiệu quả",
      description:
        "Kỹ thuật giải nhanh, công thức rút gọn, bí quyết làm bài thi.",
    },
    {
      icon: Heart,
      title: "Hỗ trợ tận tâm",
      description:
        "Giải đáp 24/7, kèm cặp từng học sinh, theo sát tiến độ học tập.",
    },
  ];

  const subjects = [
    {
      icon: Brain,
      title: "Toán học",
      topics: [
        "Đại số & Giải tích",
        "Hình học không gian",
        "Tổ hợp & Xác suất",
        "Số học",
      ],
    },
    {
      icon: Lightbulb,
      title: "Vật lý",
      topics: [
        "Dao động cơ",
        "Sóng ánh sáng",
        "Điện xoay chiều",
        "Vật lý hạt nhân",
      ],
    },
    {
      icon: School,
      title: "Hóa học",
      topics: [
        "Este & Lipit",
        "Amin & Amino acid",
        "Kim loại kiềm",
        "Hóa hữu cơ",
      ],
    },
    {
      icon: BookOpen,
      title: "Tiếng Anh",
      topics: [
        "Ngữ pháp trọng tâm",
        "Từ vựng theo chủ đề",
        "Kỹ năng làm bài",
        "Đề thi thử",
      ],
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Tiết kiệm thời gian",
      description:
        "Học online mọi lúc mọi nơi, không cần di chuyển, tập trung vào kiến thức trọng tâm.",
    },
    {
      icon: BarChart2,
      title: "Đánh giá thường xuyên",
      description:
        "Kiểm tra định kỳ, đánh giá chi tiết từng phần, biết rõ điểm mạnh điểm yếu.",
    },
    {
      icon: CheckCircle2,
      title: "Luyện đề sát thực",
      description:
        "Kho đề thi thử phong phú, cập nhật theo cấu trúc mới nhất của Bộ GD&ĐT.",
    },
    {
      icon: Trophy,
      title: "Cam kết đầu ra",
      description:
        "Đảm bảo tăng ít nhất 2 điểm sau khóa học hoặc học lại miễn phí.",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Hoàng Minh",
      school: "THPT Chu Văn An",
      content:
        "Từ học sinh trung bình yếu (5-6 điểm), sau 6 tháng học em đã đạt 8.5 điểm Toán và đỗ vào ĐH Bách Khoa.",
      avatar: "/avatars/student1.jpg",
    },
    {
      name: "Trần Mai Anh",
      school: "THPT Lê Hồng Phong",
      content:
        "Cách giảng dễ hiểu, nhiều bí quyết làm bài hay. Em đã đỗ vào ĐH Y Hà Nội với số điểm 27.5.",
      avatar: "/avatars/student2.jpg",
    },
    {
      name: "Lê Thành Nam",
      school: "THPT Phan Đình Phùng",
      content:
        "Học phí rẻ mà chất lượng quá tốt. Đề thi thử rất sát với đề thi thật, giúp em tự tin hơn nhiều.",
      avatar: "/avatars/student3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200 relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d4f] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Particles Background - Lazy loaded */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#141414]" />}>
          <ParticlesBackground />
        </Suspense>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-[#ff4d4f]/20 to-[#141414] flex items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-3 md:mb-4"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Đạt điểm cao{" "}
              <span className="text-[#ff4d4f] relative">
                dễ dàng hơn
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff4d4f]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </span>
            </motion.h1>
            <motion.p
              className="text-base md:text-xl text-gray-400 max-w-2xl"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Khóa học online chất lượng cao với giáo viên giỏi, phương pháp
              hiệu quả và chi phí hợp lý. Cam kết cải thiện điểm số cho mọi học
              sinh.
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Section with hover effects */}
        <motion.div
          className="py-10 md:py-16 bg-[#1f1f1f]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center relative group"
                  variants={itemVariants}
                >
                  <div className="flex justify-center mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center group-hover:bg-[#ff4d4f]/20 transition-colors">
                      <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-[#ff4d4f]" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-[#ff4d4f] mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Chúng tôi cung cấp nền tảng học tập hiện đại với chi phí phải
                chăng nhất, giúp bạn đạt điểm cao trong kỳ thi sắp tới.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1f1f1f] p-4 md:p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center mb-3 md:mb-4">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-[#ff4d4f]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Môn học chính
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Chương trình học được thiết kế theo chuẩn của Bộ Giáo dục, tập
                trung vào các môn thi tốt nghiệp THPT và đại học.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1f1f1f] p-4 md:p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center mb-3 md:mb-4">
                    <subject.icon className="w-5 h-5 md:w-6 md:h-6 text-[#ff4d4f]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                    {subject.title}
                  </h3>
                  <ul className="space-y-2">
                    {subject.topics.map((topic, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm md:text-base text-gray-400"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#ff4d4f] mr-2 flex-shrink-0" />
                        <span className="line-clamp-2">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-10 md:py-16 bg-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Lợi ích khi học online
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Phương pháp học hiện đại, tiết kiệm thời gian và chi phí, phù
                hợp với xu hướng giáo dục 4.0
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-[#141414] p-4 md:p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center mb-3 md:mb-4">
                    <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-[#ff4d4f]" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Học viên nói gì về chúng tôi?
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Hàng nghìn học viên đã thành công cùng chúng tôi. Hãy lắng nghe
                những chia sẻ từ các bạn.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1f1f1f] p-4 md:p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 mr-3 md:mr-4 overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/48";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400">
                        {testimonial.school}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 italic line-clamp-4 md:line-clamp-none">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-10 md:py-16 bg-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Những thắc mắc phổ biến về khóa học và cách thức học tập
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div
                className="space-y-3 md:space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-[#141414] p-4 md:p-6 rounded-xl">
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Làm sao để bắt đầu học?
                  </h3>
                  <p className="text-sm md:text-base text-gray-400">
                    Bạn chỉ cần đăng ký tài khoản, chọn khóa học phù hợp và bắt
                    đầu học ngay. Hệ thống sẽ gợi ý lộ trình học tập phù hợp với
                    trình độ của bạn.
                  </p>
                </div>
                <div className="bg-[#141414] p-4 md:p-6 rounded-xl">
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Học online có hiệu quả không?
                  </h3>
                  <p className="text-sm md:text-base text-gray-400">
                    Rất hiệu quả nếu bạn nghiêm túc học tập. Chúng tôi có hệ
                    thống theo dõi, đánh giá và gợi ý bài tập phù hợp với từng
                    học viên.
                  </p>
                </div>
                <div className="bg-[#141414] p-4 md:p-6 rounded-xl">
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Có được học thử không?
                  </h3>
                  <p className="text-sm md:text-base text-gray-400">
                    Có, mỗi khóa học đều có các bài học thử miễn phí để bạn trải
                    nghiệm trước khi quyết định đăng ký.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-10 md:py-16 bg-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8">
                Bắt đầu hành trình học tập của bạn ngay hôm nay với các khóa học
                chất lượng cao và chi phí hợp lý.
              </p>
              <a
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#ff4d4f] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-medium hover:bg-[#ff4d4f]/90 transition-colors text-sm md:text-base"
              >
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                Xem khóa học
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
