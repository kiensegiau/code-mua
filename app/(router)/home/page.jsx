"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  lazy,
  Suspense,
} from "react";
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
  Target,
  Heart,
  Brain,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

// Lazy load Particles để tăng hiệu suất tải trang ban đầu
const ParticlesBackground = lazy(() =>
  import("./components/ParticlesBackground")
);

// Tách và memoize các components con để tránh re-render
const ProgressBar = memo(({ scaleX }) => (
  <motion.div
    className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d4f] origin-left z-50"
    style={{ scaleX }}
  />
));
ProgressBar.displayName = "ProgressBar";

const StatItem = memo(({ value, label }) => (
  <motion.div
    className="bg-gray-800/50 rounded-xl p-3 sm:p-6 text-center relative group"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    }}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.div
      className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff4d4f] mb-1 sm:mb-2"
      whileHover={{ scale: 1.05 }}
    >
      {value}
    </motion.div>
    <div className="text-xs sm:text-sm text-gray-400">{label}</div>
  </motion.div>
));
StatItem.displayName = "StatItem";

const FeatureItem = memo(({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <motion.div
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
});
FeatureItem.displayName = "FeatureItem";

const HighlightItem = memo(({ item, index }) => {
  const Icon = item.icon;
  return (
    <motion.div
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
});
HighlightItem.displayName = "HighlightItem";

function HomePage() {
  // Theo dõi việc client đã tải chưa để sử dụng hiệu ứng và window
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesLoaded = async (container) => {};

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
        staggerChildren: 0.1, // Giảm thời gian stagger để tăng tốc độ hiển thị
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 }, // Giảm khoảng cách transform để tăng tốc độ hoạt ảnh
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Giảm thời gian animation
        ease: "easeOut",
      },
    },
  };

  // Tối ưu bằng cách memoize các dữ liệu tĩnh
  const features = useMemo(
    () => [
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
    ],
    []
  );

  const stats = useMemo(
    () => [
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
    ],
    []
  );

  const highlights = useMemo(
    () => [
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
    ],
    []
  );

  const studentTestimonials = [
    {
      name: "Nguyễn Hoàng Minh",
      school: "THPT Chu Văn An",
      content: "Hệ thống đánh giá năng lực giúp em hiểu rõ điểm mạnh, điểm yếu của bản thân. Sau 6 tháng học theo lộ trình được đề xuất, em đã đạt 8.5/10 trong kỳ thi đánh giá năng lực.",
      rating: 5
    },
    {
      name: "Trần Mai Anh",
      school: "THPT Lê Hồng Phong",
      content: "Phương pháp đánh giá 4D Framework giúp em phát triển toàn diện cả về kiến thức lẫn kỹ năng. Em đã tự tin hơn rất nhiều khi tham gia các kỳ thi và hoạt động ngoại khóa.",
      rating: 5
    },
    {
      name: "Lê Thành Nam",
      school: "THPT Nguyễn Huệ",
      content: "Nhờ hệ thống đánh giá tư duy, em đã khám phá ra năng khiếu của mình trong lĩnh vực STEM và đã định hướng được ngành học đại học phù hợp.",
      rating: 4
    }
  ];

  // 4D Framework theo CCR (Center for Curriculum Redesign)
  const frameworkCategories = [
    {
      title: "Kiến Thức",
      icon: BookOpen,
      color: "bg-blue-600",
      description: "Nội dung kiến thức trọng tâm cho kỳ thi THPT Quốc Gia",
      items: ["Kiến thức nền tảng", "Kiến thức liên môn", "Kiến thức chuyên sâu", "Ứng dụng thực tiễn"]
    },
    {
      title: "Kỹ Năng",
      icon: Target,
      color: "bg-green-600",
      description: "Phát triển kỹ năng cần thiết cho học tập và thi cử",
      items: ["Tư duy phản biện", "Sáng tạo", "Giao tiếp", "Hợp tác"]
    },
    {
      title: "Phẩm Chất",
      icon: Heart,
      color: "bg-red-600",
      description: "Rèn luyện đức tính cá nhân và phẩm chất học tập",
      items: ["Chánh niệm", "Tò mò", "Can đảm", "Kiên trì"]
    },
    {
      title: "Tư Duy Meta",
      icon: Brain,
      color: "bg-purple-600",
      description: "Phát triển năng lực tự nhận thức và điều chỉnh",
      items: ["Tư duy phát triển", "Tự điều chỉnh", "Học cách học", "Siêu nhận thức"]
    }
  ];

  // Dữ liệu đánh giá năng lực
  const assessmentFrameworks = [
    {
      title: "Đánh Giá Năng Lực",
      description: "Hệ thống đánh giá toàn diện theo chuẩn 4D Framework",
      features: [
        "Đánh giá toàn diện kiến thức, kỹ năng, phẩm chất và tư duy meta",
        "Phân tích điểm mạnh, điểm yếu của học sinh",
        "Đề xuất lộ trình phát triển cá nhân hóa",
        "Báo cáo chi tiết và trực quan"
      ]
    },
    {
      title: "Đánh Giá Tư Duy",
      description: "Công cụ đánh giá và phát triển tư duy bậc cao",
      features: [
        "Đánh giá khả năng tư duy phản biện",
        "Đo lường năng lực giải quyết vấn đề",
        "Phân tích tư duy sáng tạo",
        "Đánh giá khả năng tư duy hệ thống"
      ]
    },
    {
      title: "Đánh Giá Sẵn Sàng Đại Học",
      description: "Hệ thống đánh giá mức độ sẵn sàng cho giáo dục đại học",
      features: [
        "Đánh giá năng lực học thuật cốt lõi",
        "Phân tích kỹ năng tự học và nghiên cứu",
        "Đo lường khả năng thích ứng với môi trường đại học",
        "Gợi ý ngành học phù hợp dựa trên năng lực"
      ]
    }
  ];

  // Các khóa học theo chủ đề
  const courseCategories = [
    {
      title: "Khóa Học Theo Môn",
      image: "/images/subjects.jpg",
      description: "Các khóa học chuyên sâu theo từng môn học trong chương trình THPT",
      items: ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý"]
    },
    {
      title: "Khóa Luyện Thi Đánh Giá Năng Lực",
      image: "/images/competency.jpg",
      description: "Luyện thi đánh giá năng lực đại học quốc gia và các kỳ thi năng lực khác",
      items: ["Tư duy định lượng", "Tư duy định tính", "Ngôn ngữ", "Giải quyết vấn đề"]
    },
    {
      title: "Khóa Học Kỹ Năng",
      image: "/images/skills.jpg",
      description: "Phát triển các kỹ năng mềm cần thiết cho học tập và tương lai",
      items: ["Quản lý thời gian", "Phương pháp học tập hiệu quả", "Kỹ năng làm bài thi", "Kỹ năng thuyết trình"]
    },
  ];

  return (
    <div className={`${isClient ? "bg-[#141414]" : "bg-black"} min-h-screen`}>
      {/* Preload font quan trọng và font icon */}
      <Head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="/fonts/lucide-icons.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>

      {/* Progress Bar */}
      <ProgressBar scaleX={scaleX} />

      {/* Particles Background - Chỉ load khi client-side và có Suspense fallback */}
      <div className="absolute inset-0 z-0 pointer-events-none md:left-64 overflow-hidden">
        {isClient && (
          <Suspense fallback={null}>
            <ParticlesBackground />
          </Suspense>
        )}
      </div>

      {/* Floating elements - Tối ưu cho thiết bị di động */}
      <div className="fixed inset-0 pointer-events-none md:left-64 overflow-hidden">
        {isClient &&
          Array.from({
            length: isClient && window.innerWidth < 768 ? 2 : 3,
          }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-[#ff4d4f]/5 rounded-full hidden sm:block"
              animate={{
                x: [0, 50, 0], // Giảm khoảng cách di chuyển
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 10 + i * 2, // Giảm thời gian animation
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 3,
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
            />
          ))}
      </div>

      {/* Main Content - Thêm overflow-x-hidden để chặn thanh cuộn ngang và content-visibility */}
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Hero Section luôn hiển thị ngay lập tức */}
        <motion.div
          className="relative h-[250px] xs:h-[300px] md:h-[400px] bg-gradient-to-r from-[#3b82f6]/20 to-[#141414] flex items-center overflow-hidden mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#3b82f6]/5"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 6,
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
              Đánh Giá Năng Lực{" "}
              <span className="text-[#3b82f6] relative">
                Toàn Diện
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3b82f6]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
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
              Phát triển toàn diện theo khung năng lực 4D, chuẩn bị tốt nhất cho kỳ thi THPT Quốc Gia và Đánh giá năng lực đại học
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/assessment"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                Đánh giá năng lực ngay
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <StatItem key={index} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Các phần còn lại sử dụng content-visibility: auto để tối ưu hiệu suất render */}
        <div className="content-visibility-auto">
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
            {features.map((feature, index) => (
              <FeatureItem key={index} feature={feature} index={index} />
            ))}
          </div>

          {/* Highlights Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
            {highlights.map((item, index) => (
              <HighlightItem key={index} item={item} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="bg-gradient-to-r from-[#ff4d4f]/10 to-[#f5222d]/10 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center mx-2 sm:mx-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Sẵn sàng nâng cao điểm số?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-5 sm:mb-6 max-w-2xl mx-auto">
              Tham gia ngay hôm nay để trải nghiệm các khóa học chất lượng và
              cải thiện kết quả học tập của bạn
            </p>
            <Link
              href="/courses"
              className="bg-[#ff4d4f] hover:bg-[#f5222d] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              Bắt đầu học ngay
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </motion.div>

          {/* 4D Framework Categories */}
          <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Khung Năng Lực 4D Framework</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Phát triển toàn diện 4 chiều: Kiến thức, Kỹ năng, Phẩm chất và Tư duy Meta theo chuẩn quốc tế của Center for Curriculum Redesign
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                {frameworkCategories.map((category, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`${category.color} h-2`}></div>
                    <div className="p-6">
                      <div className={`${category.color} bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <category.icon className={`h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{category.title}</h3>
                      <p className="text-gray-400 mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {category.items.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className={`h-5 w-5 ${category.color.replace('bg-', 'text-')} mr-2 flex-shrink-0`} />
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Đánh Giá Năng Lực Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Hệ Thống Đánh Giá Năng Lực</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Nền tảng đánh giá toàn diện dựa trên Common Assessment Framework, giúp học sinh phát triển theo đúng tiềm năng
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {assessmentFrameworks.map((framework, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold mb-3 text-white">{framework.title}</h3>
                    <p className="text-gray-400 mb-4">{framework.description}</p>
                    <ul className="space-y-3">
                      {framework.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-[#3b82f6] mr-2 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link 
                        href={`/assessment/${framework.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center text-[#3b82f6] hover:text-[#60a5fa] font-medium"
                      >
                        Tìm hiểu thêm
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Course Categories */}
          <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Khóa Học Theo Chủ Đề</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Đa dạng khóa học phát triển toàn diện năng lực cho học sinh THPT
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {courseCategories.map((category, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-700 relative">
                      {isClient && (
                        <Image 
                          src={category.image || `/images/course-${index + 1}.jpg`}
                          alt={category.title}
                          fill
                          className="object-cover opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-300 mb-4">{category.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.items.slice(0, 4).map((item, i) => (
                          <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {item}
                          </span>
                        ))}
                        {category.items.length > 4 && (
                          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            +{category.items.length - 4}
                          </span>
                        )}
                      </div>
                      <Link 
                        href={`/courses/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center text-[#3b82f6] hover:text-[#60a5fa] font-medium"
                      >
                        Xem các khóa học
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Thêm padding dưới cùng để có khoảng cách với bottom navigation trên mobile */}
        <div className="h-6 sm:h-0"></div>
      </div>
    </div>
  );
}

export default HomePage;
