"use client";
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesLoaded = async (container) => {
    console.log("Particles container loaded", container);
  };

  const getParticlesConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    return {
      background: {
        color: {
          value: "transparent",
        },
      },
      particles: {
        color: {
          value: "#ff4d4f",
        },
        links: {
          color: "#ff4d4f",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: isMobile ? 0.5 : 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: isMobile ? 20 : isTablet ? 30 : 50,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    };
  };

  const particlesConfig =
    typeof window !== "undefined"
      ? getParticlesConfig()
      : {
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 0 },
            move: { enable: false },
          },
        };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: BookOpen,
      title: "Khóa học chất lượng",
      description:
        "Học từ những giáo viên giỏi với nội dung bám sát chương trình của Bộ GD&ĐT",
      list: [
        "Bám sát đề thi THPT Quốc gia",
        "Giáo viên dày dặn kinh nghiệm",
        "Video bài giảng chất lượng cao",
        "Tài liệu và đề thi thử phong phú",
      ],
    },
    {
      icon: Users,
      title: "Lớp học tương tác",
      description:
        "Tham gia lớp học trực tuyến với các bạn học sinh trên toàn quốc",
      list: [
        "Trao đổi, thảo luận trực tiếp",
        "Giải đáp thắc mắc nhanh chóng",
        "Làm bài tập nhóm hiệu quả",
        "Chia sẻ kinh nghiệm học tập",
      ],
    },
    {
      icon: Star,
      title: "Lộ trình chuẩn",
      description: "Chương trình học được thiết kế phù hợp cho từng khối lớp",
      list: [
        "Lớp 10 - Nền tảng vững chắc",
        "Lớp 11 - Nâng cao kiến thức",
        "Lớp 12 - Luyện thi đại học",
        "Ôn thi chuyên đề trọng tâm",
      ],
    },
    {
      icon: Award,
      title: "Cam kết đầu ra",
      description: "Đảm bảo kết quả học tập và điểm số được cải thiện",
      list: [
        "Tăng ít nhất 2 điểm sau khóa học",
        "Nắm chắc kiến thức trọng tâm",
        "Tự tin trong các kỳ thi",
        "Hoàn tiền nếu không hài lòng",
      ],
    },
  ];

  const stats = [
    {
      value: "20K+",
      label: "Học sinh",
    },
    {
      value: "150+",
      label: "Khóa học",
    },
    {
      value: "100+",
      label: "Giáo viên",
    },
    {
      value: "98%",
      label: "Đỗ Đại học",
    },
  ];

  const highlights = [
    {
      icon: TrendingUp,
      title: "Học sinh",
      description: "Nâng cao điểm số với các khóa học chất lượng",
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
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d4f] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Particles Background - Tối ưu cho thiết bị di động */}
      <div className="absolute inset-0 z-0 pointer-events-none md:left-64">
        {typeof window !== "undefined" && (
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesConfig}
            className="hidden sm:block"
          />
        )}
      </div>

      {/* Floating elements in the background - Giới hạn phạm vi và tối ưu cho di động */}
      <div className="fixed inset-0 pointer-events-none md:left-64">
        {[
          ...Array(
            typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3
          ),
        ].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-[#ff4d4f]/5 rounded-full hidden sm:block"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 5,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Hero Section - Cải thiện responsive */}
        <motion.div
          className="relative h-[250px] xs:h-[300px] md:h-[400px] bg-gradient-to-r from-[#ff4d4f]/20 to-[#141414] flex items-center overflow-hidden mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#ff4d4f]/5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="relative px-3 sm:px-4 md:px-8">
            <motion.h1
              className="text-3xl xs:text-4xl md:text-6xl font-bold mb-4 sm:mb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              Nền Tảng Học Trực Tuyến{" "}
              <span className="text-[#ff4d4f] relative">
                Hàng Đầu
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff4d4f]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-sm xs:text-base md:text-xl max-w-2xl mb-6 sm:mb-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              Khóa học online chất lượng cao dành cho học sinh THPT, giúp nâng
              cao điểm số và tự tin trong kỳ thi Đại học
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/courses"
                className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Khám phá khóa học
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section - Cải thiện grid cho mobile */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-12 px-2 sm:px-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 rounded-xl p-3 sm:p-6 text-center relative group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff4d4f] mb-1 sm:mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid - Cải thiện cho mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-gray-800/50 rounded-xl p-4 sm:p-6 hover:bg-gray-800/70 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <motion.div
                    className="p-2 sm:p-3 rounded-lg bg-[#ff4d4f]/10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#ff4d4f]" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {feature.list.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-xs sm:text-sm text-gray-400"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff4d4f] mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Highlights Section - Cải thiện cho mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-4 sm:p-8 transition-colors block"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <motion.div
                      className={`p-2 sm:p-3 rounded-lg ${item.color}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center text-white font-medium text-sm sm:text-base group-hover:gap-2 transition-all">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section - Cải thiện cho mobile */}
        <motion.div
          className="bg-gradient-to-r from-[#ff4d4f]/10 to-[#f5222d]/10 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center mx-2 sm:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Sẵn sàng nâng cao điểm số?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-5 sm:mb-6 max-w-2xl mx-auto">
            Tham gia ngay hôm nay để trải nghiệm các khóa học chất lượng và cải
            thiện kết quả học tập của bạn
          </p>
          <Link
            href="/courses"
            className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            Bắt đầu học ngay
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </motion.div>

        {/* Thêm padding dưới cùng để có khoảng cách với bottom navigation trên mobile */}
        <div className="h-6 sm:h-0"></div>
      </div>
    </>
  );
}

export default HomePage;
