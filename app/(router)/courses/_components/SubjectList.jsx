"use client";
import React from "react";
import { motion } from "framer-motion";
import SubjectCard from "./SubjectCard";

function SubjectList({ subjects }) {
  if (!subjects || subjects.length === 0) {
    return (
      <motion.div
        className="bg-[#1f1f1f] p-8 rounded-xl border border-gray-800 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-400">Chưa có môn học nào</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <SubjectCard subject={subject} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SubjectList; 