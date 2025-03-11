"use client";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
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
import { toast } from "sonner";

// Dữ liệu tĩnh nên được đặt bên ngoài component để tránh tạo lại khi render
const FEATURES = [
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

const CONTACTS = [
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

const FAQ = [
  {
    question: "Thời gian cookie theo dõi kéo dài bao lâu?",
    answer:
      "Cookie theo dõi của chúng tôi có hiệu lực trong 30 ngày. Điều này có nghĩa là nếu người dùng nhấp vào liên kết của bạn và hoàn tất việc mua hàng trong vòng 30 ngày, bạn vẫn sẽ nhận được hoa hồng.",
  },
  {
    question: "Code MUA có đảm bảo tính minh bạch không?",
    answer:
      "Tuyệt đối! Chúng tôi cam kết 100% minh bạch trong toàn bộ quá trình tính hoa hồng. Bạn có thể theo dõi mọi giao dịch, lịch sử thanh toán và doanh số theo thời gian thực thông qua bảng điều khiển đối tác. Ngoài ra, chúng tôi cung cấp báo cáo chi tiết hàng tháng về hiệu suất giới thiệu của bạn.",
  },
  {
    question: "Có cam kết pháp lý nào bảo vệ tôi khi làm đối tác không?",
    answer:
      "Có, khi tham gia làm đối tác, bạn sẽ được ký hợp đồng hợp tác chính thức với Code MUA. Hợp đồng này đảm bảo quyền lợi của bạn, quy định rõ mức hoa hồng 50%, chu kỳ thanh toán, và các điều khoản bảo vệ. Chúng tôi tuân thủ nghiêm ngặt tất cả quy định về bảo mật thông tin và quyền riêng tư theo pháp luật Việt Nam hiện hành.",
  },
];

const TESTIMONIALS = [
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

const HOW_IT_WORKS = [
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

// Các animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Tách thành các component nhỏ để dễ quản lý
const FeatureCard = memo(({ feature }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-[#ff4d4f]/20 to-[#ff4d4f]/10 p-3 rounded-lg mr-4">
          <Icon className="w-6 h-6 text-[#ff4d4f]" />
        </div>
        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
      </div>
      <p className="text-gray-300 text-sm">{feature.description}</p>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

const ContactItem = memo(({ contact }) => {
  const Icon = contact.icon;

  return (
    <motion.a
      variants={ITEM_VARIANTS}
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
    >
      <div
        className={`${contact.color} w-10 h-10 rounded-full flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-gray-400 text-xs">{contact.name}</div>
        <div className="text-white font-medium">{contact.value}</div>
      </div>
    </motion.a>
  );
});

ContactItem.displayName = "ContactItem";

const AccordionItem = memo(
  ({ item, index, activeQuestion, setActiveQuestion }) => {
    const handleClick = useCallback(() => {
      setActiveQuestion(activeQuestion === index ? null : index);
    }, [activeQuestion, index, setActiveQuestion]);

    return (
      <motion.div
        variants={ITEM_VARIANTS}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 overflow-hidden"
      >
        <button
          onClick={handleClick}
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
    );
  }
);

AccordionItem.displayName = "AccordionItem";

const Testimonial = memo(({ testimonial }) => {
  return (
    <motion.div
      variants={ITEM_VARIANTS}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-gray-400 text-sm">{testimonial.role}</div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < testimonial.rating ? "text-yellow-400" : "text-gray-600"
                }`}
                fill={i < testimonial.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        <div className="ml-auto bg-green-500/20 px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-green-400">
            {testimonial.earnings}
          </span>
        </div>
      </div>
      <p className="text-gray-300 text-sm italic">{testimonial.quote}</p>
    </motion.div>
  );
});

Testimonial.displayName = "Testimonial";

const HowItWorksItem = memo(({ item, index }) => {
  return (
    <motion.div variants={ITEM_VARIANTS} className="flex gap-4 sm:gap-6">
      <div className="flex-shrink-0 relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center z-10 relative">
          {item.icon}
        </div>
        {index < HOW_IT_WORKS.length - 1 && (
          <div className="absolute top-12 sm:top-14 bottom-0 left-1/2 w-0.5 -ml-[1px] bg-gradient-to-b from-white/20 to-transparent h-full"></div>
        )}
      </div>
      <div className="pt-1.5">
        <h3 className="text-white font-medium mb-1">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
      </div>
    </motion.div>
  );
});

HowItWorksItem.displayName = "HowItWorksItem";

// Component chính
function EarningsPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterPartner = useCallback(() => {
    toast.success("Đã gửi yêu cầu đăng ký đối tác thành công!");
  }, []);

  const handleContactRequest = useCallback(() => {
    toast.success("Đã gửi yêu cầu liên hệ thành công!");
  }, []);

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

      {/* Main content */}
      <div className="w-full flex-1 z-10">
        <main className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="max-w-[1200px] mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Trở thành đối tác & kiếm{" "}
                <span className="text-[#ff4d4f]">50% doanh thu</span>
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto mb-8 sm:mb-10">
                Chia sẻ kiến thức, tạo thu nhập thụ động cùng chúng tôi trong
                chương trình đối tác giới thiệu học viên
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRegisterPartner}
                  className="bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] hover:from-[#ff7875] hover:to-[#ff4d4f] text-white font-medium px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Đăng ký ngay
                </button>
                <button
                  onClick={handleContactRequest}
                  className="bg-transparent border border-white/20 hover:border-white/40 text-white font-medium px-6 py-3 rounded-lg transition-all"
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Lợi ích khi trở thành đối tác
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                  Chương trình đối tác giới thiệu học viên mang đến nhiều giá
                  trị cho cả bạn và người học
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {FEATURES.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20 bg-gradient-to-br from-[#1f1f1f]/80 to-[#141414]/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/5"
            >
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Cách thức hoạt động
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                  Chỉ 3 bước đơn giản để bắt đầu kiếm thu nhập
                </p>
              </div>

              <div className="space-y-8 sm:space-y-10">
                {HOW_IT_WORKS.map((item, index) => (
                  <HowItWorksItem key={index} item={item} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Đối tác nói gì về chúng tôi
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                  Khám phá câu chuyện thành công từ các đối tác
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {TESTIMONIALS.map((testimonial, index) => (
                  <Testimonial key={index} testimonial={testimonial} />
                ))}
              </div>
            </motion.div>

            {/* Contact & Support */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Liên hệ & Hỗ trợ
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                  Đội ngũ hỗ trợ đối tác của chúng tôi luôn sẵn sàng hỗ trợ bạn
                  24/7
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CONTACTS.map((contact, index) => (
                    <ContactItem key={index} contact={contact} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              variants={CONTAINER_VARIANTS}
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
                {FAQ.map((item, index) => (
                  <AccordionItem
                    key={index}
                    item={item}
                    index={index}
                    activeQuestion={activeQuestion}
                    setActiveQuestion={setActiveQuestion}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <div className="bg-gradient-to-r from-[#ff4d4f]/20 to-[#ff7875]/10 backdrop-blur-sm rounded-xl p-8 sm:p-10 border border-[#ff4d4f]/20 text-center">
                <motion.h2
                  variants={ITEM_VARIANTS}
                  className="text-2xl sm:text-3xl font-bold text-white mb-4"
                >
                  Sẵn sàng tạo thu nhập thụ động?
                </motion.h2>
                <motion.p
                  variants={ITEM_VARIANTS}
                  className="text-gray-300 mb-6 max-w-2xl mx-auto"
                >
                  Gia nhập cộng đồng đối tác Code MUA ngay hôm nay và bắt đầu
                  hành trình kiếm thu nhập thụ động
                </motion.p>
                <motion.button
                  variants={ITEM_VARIANTS}
                  onClick={handleRegisterPartner}
                  className="bg-gradient-to-r from-[#ff4d4f] to-[#f5222d] hover:from-[#ff7875] hover:to-[#ff4d4f] text-white font-medium px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Đăng ký trở thành đối tác
                </motion.button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default memo(EarningsPage);
