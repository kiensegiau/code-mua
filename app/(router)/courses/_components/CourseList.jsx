"use client";

import React, { useState, useEffect, useCallback } from "react";
import CourseItem from "./CourseItem";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";

function CourseList({ grade }) {
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [coursesBySubject, setCoursesBySubject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const subjects = [
    { value: "math", label: "Toán học" },
    { value: "physics", label: "Vật lý" },
    { value: "chemistry", label: "Hóa học" },
    { value: "biology", label: "Sinh học" },
    { value: "literature", label: "Ngữ văn" },
    { value: "english", label: "Tiếng Anh" },
    { value: "history", label: "Lịch sử" },
    { value: "geography", label: "Địa lý" },
    { value: "informatics", label: "Tin học" },
    { value: "others", label: "Khác" },
  ];

  const toggleSubject = (subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  // Cập nhật số lượng items dựa trên kích thước màn hình
  const updateItemsPerPage = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1536) {
      // 2xl
      setItemsPerPage(6);
    } else if (width >= 1280) {
      // xl
      setItemsPerPage(5);
    } else if (width >= 1024) {
      // lg
      setItemsPerPage(4);
    } else if (width >= 768) {
      // md
      setItemsPerPage(3);
    } else {
      setItemsPerPage(2);
    }
  }, []);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [updateItemsPerPage]);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.getAllCourseList();

      // Lọc khóa học theo lớp nếu có
      const filteredCourses = grade
        ? resp.filter((course) => course.grade === grade)
        : resp;

      // Phân loại khóa học theo môn
      const coursesGrouped = subjects.map((subject) => ({
        id: subject.value,
        title: subject.label,
        courses: filteredCourses.filter((course) => {
          if (course.subject && course.subject === subject.value) {
            return true;
          }
          if (
            subject.value === "others" &&
            (!course.subject ||
              !subjects.find((s) => s.value === course.subject))
          ) {
            return true;
          }
          return false;
        }),
      }));

      setCoursesBySubject(coursesGrouped);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ hiển thị các môn có khóa học
  const subjectsWithCourses = subjects.filter((subject) =>
    coursesBySubject.some(
      (category) => category.id === subject.value && category.courses.length > 0
    )
  );

  if (loading) {
    return (
      <div className="space-y-10">
        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-video bg-gray-800 rounded"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {subjectsWithCourses.map((subject) => {
        const category = coursesBySubject.find(
          (cat) => cat.id === subject.value
        );
        if (!category || !category.courses.length) return null;

        const isExpanded = expandedSubjects[subject.value];
        const displayedCourses = isExpanded
          ? category.courses
          : category.courses.slice(0, itemsPerPage);
        const hasMore = category.courses.length > itemsPerPage;

        return (
          <div key={subject.value} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {subject.label}
                  </h2>
                </div>
              </div>
              {hasMore && (
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="text-[#ff4d4f] hover:underline flex items-center gap-1 text-sm sm:text-base"
                >
                  {isExpanded ? "Thu gọn" : "Xem tất cả"}
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
              {displayedCourses
                .slice(
                  0,
                  displayedCourses.length - (hasMore && !isExpanded ? 1 : 0)
                )
                .map((course) => (
                  <CourseItem key={course.id} course={course} />
                ))}

              {hasMore && !isExpanded && (
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="group h-full min-h-[140px] sm:min-h-[160px] bg-[#1f1f1f] rounded-lg border border-dashed border-gray-700 hover:border-[#ff4d4f] transition-colors duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 group-hover:bg-[#ff4d4f]/10 flex items-center justify-center transition-colors duration-300">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#ff4d4f]" />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[10px] sm:text-xs text-gray-400 group-hover:text-[#ff4d4f] font-medium">
                      Xem thêm
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">
                      {category.courses.length - itemsPerPage} khóa học khác
                    </p>
                  </div>
                </button>
              )}
            </div>

            {isExpanded && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="flex items-center gap-2 text-[#ff4d4f] hover:underline text-sm sm:text-base"
                >
                  Thu gọn
                  <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

CourseList.defaultProps = {
  grade: null, // Không lọc theo lớp nếu không có prop grade
};

export default CourseList;
