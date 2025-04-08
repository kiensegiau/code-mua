"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, DollarSign } from "lucide-react";

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

function HighlightsSection() {
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
            Bạn là ai?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Chọn đối tượng phù hợp với bạn để bắt đầu hành trình học tập
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="bg-[var(--card-background)] p-8 rounded-xl shadow-lg"
              variants={itemVariants}
            >
              <div className={`w-16 h-16 ${highlight.color} rounded-lg flex items-center justify-center mb-6`}>
                <highlight.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{highlight.title}</h3>
              <p className="text-gray-400 mb-6">{highlight.description}</p>
              <Link
                href={highlight.href}
                className="inline-flex items-center text-[#ff4d4f] font-medium hover:underline"
              >
                {highlight.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HighlightsSection; 