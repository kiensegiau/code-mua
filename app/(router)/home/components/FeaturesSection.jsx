"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, Award } from "lucide-react";

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

function FeaturesSection() {
  return (
    <section className="py-16 bg-[var(--background-color)]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Chúng tôi cung cấp giải pháp học tập toàn diện giúp học sinh đạt kết quả tốt nhất
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[var(--card-background)] p-6 rounded-xl shadow-lg"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-[#ff4d4f]/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#ff4d4f]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.list.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-[#ff4d4f] mr-2">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection; 