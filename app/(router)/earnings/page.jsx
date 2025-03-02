"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  ArrowRight,
  MessageCircle,
  Facebook,
  Phone,
  CheckCircle,
  ChevronDown,
  Star,
  BarChart,
  Award,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

function EarningsPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [steps, setSteps] = useState([1, 2, 3]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const faq = [
    {
      question: "Tôi sẽ được trả tiền như thế nào?",
      answer:
        "Mọi khoản thanh toán sẽ được chuyển vào tài khoản ngân hàng hoặc ví điện tử của bạn vào ngày 15 hàng tháng. Số tiền tối thiểu để rút là 500.000 VNĐ.",
    },
    {
      question: "Làm thế nào để theo dõi doanh thu của tôi?",
      answer:
        "Bạn có thể theo dõi doanh thu theo thời gian thực qua bảng điều khiển đối tác của chúng tôi. Hệ thống sẽ hiển thị chi tiết về số lượt truy cập, đăng ký và doanh thu.",
    },
    {
      question: "Tôi có cần kiến thức về lập trình để tham gia không?",
      answer:
        "Không, bạn không cần bất kỳ kiến thức kỹ thuật nào. Chỉ cần chia sẻ liên kết giới thiệu của bạn qua mạng xã hội, blog hoặc email là đủ để bắt đầu kiếm tiền.",
    },
    {
      question: "Thời gian cookie theo dõi kéo dài bao lâu?",
      answer:
        "Cookie theo dõi của chúng tôi có hiệu lực trong 30 ngày. Điều này có nghĩa là nếu người dùng nhấp vào liên kết của bạn và hoàn tất việc mua hàng trong vòng 30 ngày, bạn vẫn sẽ nhận được hoa hồng.",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Sinh viên Đại học",
      quote:
        "Chương trình đối tác của Code MUA đã giúp tôi có thêm nguồn thu nhập ổn định mỗi tháng. Chỉ với việc chia sẻ các khóa học với bạn bè và mạng lưới của mình, tôi đã kiếm được hơn 5 triệu đồng mỗi tháng.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      earnings: "5.2 triệu/tháng",
    },
    {
      name: "Lê Thị Hương",
      role: "Giáo viên THPT",
      quote:
        "Tôi thường giới thiệu các khóa học chất lượng cho học sinh của mình. Với chương trình đối tác của Code MUA, tôi không chỉ giúp học sinh tiếp cận kiến thức mà còn tạo ra thu nhập thụ động cho bản thân.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      earnings: "7.8 triệu/tháng",
    },
    {
      name: "Trần Văn Nam",
      role: "Blogger Công nghệ",
      quote:
        "Từ khi tham gia chương trình đối tác của Code MUA, doanh thu từ blog của tôi đã tăng gấp đôi. Việc giới thiệu các khóa học phù hợp với nội dung blog rất dễ dàng và mang lại hiệu quả cao.",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      rating: 4,
      earnings: "12.5 triệu/tháng",
    },
  ];

  const howItWorks = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Đăng ký tài khoản đối tác",
      description: "Điền thông tin cơ bản và xác thực tài khoản của bạn",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Nhận liên kết giới thiệu độc quyền",
      description: "Mỗi đối tác sẽ có mã giới thiệu riêng để theo dõi doanh số",
    },
    {
      icon: <ArrowUpRight className="w-6 h-6 text-blue-500" />,
      title: "Chia sẻ & Kiếm tiền",
      description:
        "Chia sẻ liên kết qua mạng xã hội, blog hoặc trực tiếp với mạng lưới của bạn",
    },
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#141414] to-[#1a1a1a] relative">
      {/* Background elements */}
      <div className="absolute top-0 inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] sm:w-[60%] h-[50%] sm:h-[60%] bg-[#ff4d4f]/5 rounded-full filter blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] sm:w-[60%] h-[50%] sm:h-[60%] bg-[#ff4d4f]/5 rounded-full filter blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute top-[50%] right-[10%] sm:top-[40%] sm:right-[20%] w-[40%] sm:w-[30%] h-[25%] sm:h-[30%] bg-[#ff4d4f]/5 rounded-full filter blur-[60px] sm:blur-[90px]"></div>
        <div className="absolute top-[40%] left-[20%] sm:top-[30%] sm:left-[30%] w-[50%] sm:w-[40%] h-[30%] sm:h-[40%] bg-purple-500/5 rounded-full filter blur-[70px] sm:blur-[110px]"></div>
        <div className="hidden sm:block absolute bottom-[10%] left-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full filter blur-[80px]"></div>
      </div>

      {/* Main content - expands to full width on mobile, accounts for sidebar on desktop */}
      <div className="w-full md:pl-64 flex-1 z-10">
        <main className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="max-w-[1200px] mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16 relative overflow-hidden"
            >
              {/* Background elements */}
              <div className="absolute -top-10 sm:-top-20 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#ff4d4f]/10 rounded-full filter blur-2xl sm:blur-3xl opacity-30" />
              <div className="absolute -bottom-10 sm:-bottom-20 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-[#f5222d]/10 rounded-full filter blur-2xl sm:blur-3xl opacity-30" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block mb-4 sm:mb-6"
                >
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#ff4d4f]/10 text-[#ff4d4f] rounded-full text-xs sm:text-sm font-medium">
                    Chương trình đối tác 2023
                  </span>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2 sm:px-3">
                  Kiếm Tiền Cùng Code MUA
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-3">
                  Trở thành đối tác của chúng tôi và nhận ngay{" "}
                  <span className="text-[#ff4d4f] font-semibold">
                    50% doanh thu
                  </span>{" "}
                  từ mỗi khóa học được bán ra thông qua bạn
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-wrap justify-center gap-3 sm:gap-4"
                >
                  <button className="bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/20 hover:-translate-y-1">
                    Tham Gia Ngay
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-all hover:bg-white/20">
                    Tìm hiểu thêm
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">
                Những con số ấn tượng
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/5 hover:border-[#ff4d4f]/20 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff4d4f] mb-1 sm:mb-2">
                    50%
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">
                    Tỷ lệ chia sẻ doanh thu
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/5 hover:border-[#ff4d4f]/20 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff4d4f] mb-1 sm:mb-2">
                    24/7
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">
                    Hỗ trợ đối tác
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/5 hover:border-[#ff4d4f]/20 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff4d4f] mb-1 sm:mb-2">
                    1M+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">
                    Đã chi trả cho đối tác
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/5 hover:border-[#ff4d4f]/20 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff4d4f] mb-1 sm:mb-2">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">
                    Đối tác tích cực
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Lợi ích khi trở thành đối tác
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
                  Chương trình đối tác của chúng tôi được thiết kế để mang lại
                  lợi ích tối đa cho bạn
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      variants={itemVariants}
                      key={index}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/5 hover:border-[#ff4d4f]/30 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5 group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#ff4d4f]/10 group-hover:bg-[#ff4d4f]/20 transition-colors">
                          <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-[#ff4d4f]" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-300 pl-12 sm:pl-16">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Cách thức hoạt động
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
                  Bắt đầu kiếm tiền chỉ với 3 bước đơn giản
                </p>
              </div>

              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-24 left-1/2 h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-[#ff4d4f] to-transparent hidden md:block transform -translate-x-1/2"></div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                  {howItWorks.map((step, index) => (
                    <motion.div
                      variants={itemVariants}
                      key={index}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/5 hover:border-[#ff4d4f]/20 transition-all hover:shadow-lg hover:shadow-[#ff4d4f]/5"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1f1f1f] border-4 border-[#ff4d4f]/20 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                        <span className="text-lg sm:text-xl font-bold text-[#ff4d4f]">
                          {index + 1}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="mb-3 sm:mb-4 flex justify-center">
                          {step.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Câu chuyện thành công
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
                  Nghe từ những đối tác đã thành công cùng chúng tôi
                </p>
              </div>

              <div className="relative w-full">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/5 p-1 w-full">
                  <div className="relative overflow-hidden rounded-lg sm:rounded-xl w-full">
                    <div
                      className="flex transition-transform duration-500 w-full"
                      style={{
                        transform: `translateX(-${currentTestimonial * 100}%)`,
                      }}
                    >
                      {testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className="w-full flex-shrink-0 p-3 sm:p-4 md:p-8"
                        >
                          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#ff4d4f]/20 flex-shrink-0">
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-center md:justify-start mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                      i < testimonial.rating
                                        ? "text-yellow-500"
                                        : "text-gray-600"
                                    }`}
                                    fill={
                                      i < testimonial.rating
                                        ? "#eab308"
                                        : "none"
                                    }
                                  />
                                ))}
                              </div>
                              <p className="text-sm sm:text-base text-gray-300 italic mb-3 sm:mb-4 text-center md:text-left">
                                "{testimonial.quote}"
                              </p>
                              <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                                <div className="text-center md:text-left mb-2 sm:mb-0">
                                  <h4 className="font-bold text-white">
                                    {testimonial.name}
                                  </h4>
                                  <p className="text-gray-400 text-xs sm:text-sm">
                                    {testimonial.role}
                                  </p>
                                </div>
                                <div className="text-center sm:text-right">
                                  <p className="text-xs sm:text-sm text-gray-400">
                                    Thu nhập trung bình
                                  </p>
                                  <p className="text-[#ff4d4f] text-sm sm:text-base font-bold">
                                    {testimonial.earnings}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        currentTestimonial === index
                          ? "bg-[#ff4d4f]"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
                  Những câu hỏi phổ biến về chương trình đối tác
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                {faq.map((item, index) => (
                  <motion.div
                    variants={itemVariants}
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setActiveQuestion(
                          activeQuestion === index ? null : index
                        )
                      }
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center"
                    >
                      <span className="font-medium text-white text-sm sm:text-base">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${
                          activeQuestion === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeQuestion === index && (
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-300">
                        {item.answer}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-r from-[#ff4d4f]/20 to-[#f5222d]/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-10 text-center mb-12 sm:mb-16 md:mb-20 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#ff4d4f]/30 filter blur-2xl sm:blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#ff4d4f]/30 filter blur-2xl sm:blur-3xl opacity-30"></div>
              </div>

              <div className="relative">
                <span className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm">
                  Bắt đầu ngay hôm nay
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Sẵn sàng tăng thu nhập của bạn?
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Chỉ cần chia sẻ link giới thiệu của bạn, chúng tôi sẽ lo phần
                  còn lại. Hệ thống tự động theo dõi và ghi nhận tất cả các giao
                  dịch.
                </p>
                <button className="bg-white text-[#ff4d4f] hover:bg-gray-100 px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-all hover:shadow-lg">
                  Đăng ký làm đối tác
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-8 sm:mb-10 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 border border-white/5"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-5 sm:mb-8">
                Liên Hệ Với Chúng Tôi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {contacts.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <motion.a
                      variants={itemVariants}
                      key={index}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-white/5 hover:border-white/20"
                    >
                      <div
                        className={`p-2 sm:p-3 rounded-md sm:rounded-lg ${contact.color}`}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300">
                          {contact.name}
                        </div>
                        <div className="text-sm sm:text-base text-white font-medium">
                          {contact.value}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EarningsPage;
