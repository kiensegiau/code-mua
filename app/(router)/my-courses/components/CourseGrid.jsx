"use client";
import React from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import EmptyState from "./EmptyState";

function CourseGrid({ courses, searchQuery }) {
  // Lọc khóa học dựa trên từ khóa tìm kiếm
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hiển thị trạng thái trống nếu không có khóa học
  if (filteredCourses.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {filteredCourses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default CourseGrid; 