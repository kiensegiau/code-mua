"use client";
import React from "react";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

function StatsSection() {
  return (
    <section className="py-16 bg-[var(--card-background)]">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#ff4d4f] mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection; 