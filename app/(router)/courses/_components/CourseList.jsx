"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import CourseItem from "./CourseItem";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Star,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useCourseList } from "@/app/_hooks/useGlobalApi";
import dynamic from "next/dynamic";

// Component LazyLoadedCourseItem để lazy load từng course item
const LazyLoadedCourseItem = ({ course, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px", // Preload trước khi người dùng cuộn tới
  });

  return (
    <div
      ref={ref}
      className="h-full"
      style={{
        animationName: inView ? "fadeIn" : "",
        animationDuration: "0.3s",
        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
        animationFillMode: "forwards",
        opacity: inView ? "" : "0",
      }}
    >
      {inView ? (
        <CourseItem course={course} />
      ) : (
        <div className="h-full aspect-video bg-gray-800/50 rounded-xl animate-pulse-custom"></div>
      )}
    </div>
  );
};

// Wrap bằng memo để tránh re-render khi parent component thay đổi
const CourseList = React.memo(function CourseList({ grade = null }) {
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Sử dụng useCourseList hook để fetch và cache data
  const { data: courses, isLoading, error } = useCourseList({ grade });

  const subjects = [
    { value: "math", label: "Toán học", icon: <Star className="w-4 h-4" /> },
    {
      value: "physics",
      label: "Vật lý",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: "chemistry",
      label: "Hóa học",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: "biology",
      label: "Sinh học",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: "literature",
      label: "Ngữ văn",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      value: "english",
      label: "Tiếng Anh",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      value: "history",
      label: "Lịch sử",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      value: "geography",
      label: "Địa lý",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      value: "informatics",
      label: "Tin học",
      icon: <BookOpen className="w-4 h-4" />,
    },
    { value: "others", label: "Khác", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const toggleSubject = useCallback((subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  }, []);

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
    // Hạn chế tần suất gọi event listener để tránh reflow liên tục
    const handleResize = () => {
      // Debounce resize event để tránh gọi quá nhiều lần
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
      }
      window.resizeTimeout = setTimeout(() => {
        updateItemsPerPage();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
      }
    };
  }, [updateItemsPerPage]);

  // Phân loại khóa học theo môn học - sử dụng useMemo để cache kết quả
  const coursesBySubject = useMemo(() => {
    if (!courses) return [];

    return subjects.map((subject) => ({
      id: subject.value,
      title: subject.label,
      icon: subject.icon,
      courses: courses.filter((course) => {
        if (course.subject && course.subject === subject.value) {
          return true;
        }
        if (
          subject.value === "others" &&
          (!course.subject || !subjects.find((s) => s.value === course.subject))
        ) {
          return true;
        }
        return false;
      }),
    }));
  }, [courses, subjects]);

  // Chỉ hiển thị các môn có khóa học
  const subjectsWithCourses = useMemo(
    () =>
      subjects.filter((subject) =>
        coursesBySubject.some(
          (category) =>
            category.id === subject.value && category.courses.length > 0
        )
      ),
    [coursesBySubject, subjects]
  );

  // Simple loading state - static thay vì animation để giảm tải
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((index) => (
          <div key={index} className="space-y-4 animate-pulse-custom">
            <div className="h-6 bg-gray-800 rounded w-48"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-video bg-gray-800 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Có lỗi khi tải dữ liệu
        </h3>
        <p className="text-gray-400 max-w-md">
          Đã xảy ra lỗi khi tải khóa học. Vui lòng thử lại sau!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {subjectsWithCourses.map((subject, subjectIndex) => {
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
          <div
            key={subject.value}
            className="space-y-5 opacity-0 animate-fadeIn"
            style={{ animationDelay: `${subjectIndex * 0.1}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-[#ff4d4f]/10 flex items-center justify-center text-[#ff4d4f]">
                  {category.icon}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {subject.label}
                </h2>
                <div className="ml-2 text-xs text-gray-400">
                  ({category.courses.length} khóa học)
                </div>
              </div>

              {hasMore && (
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="text-[#ff4d4f] hover:text-[#ff4d4f]/80 flex items-center gap-1.5 text-sm sm:text-base font-medium py-1 px-3 rounded-full bg-[#ff4d4f]/10 hover:bg-[#ff4d4f]/20 transition-colors hover-scale"
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

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5">
              {displayedCourses
                .slice(
                  0,
                  displayedCourses.length - (hasMore && !isExpanded ? 1 : 0)
                )
                .map((course, courseIndex) => (
                  <LazyLoadedCourseItem
                    key={course.id}
                    course={course}
                    index={courseIndex}
                  />
                ))}

              {hasMore && !isExpanded && (
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="group h-full bg-gradient-to-br from-[#1f1f1f] to-[#252525] rounded-xl overflow-hidden border border-dashed border-gray-700 hover:border-[#ff4d4f] transition-colors duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer hover-scale"
                >
                  <div className="w-10 h-10 rounded-full bg-[#ff4d4f]/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#ff4d4f]" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm text-[#ff4d4f] font-medium">
                      Xem thêm {category.courses.length - itemsPerPage} khóa học
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Nhấn để mở rộng danh sách
                    </p>
                  </div>
                </button>
              )}
            </div>

            {isExpanded && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => toggleSubject(subject.value)}
                  className="flex items-center gap-2 text-white bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 px-4 py-2 rounded-full text-sm font-medium shadow-md hover-scale"
                >
                  Thu gọn danh sách
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {coursesBySubject.length > 0 &&
        coursesBySubject.every((cat) => cat.courses.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 bg-[#ff4d4f]/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#ff4d4f]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-400 max-w-md">
              Chúng tôi đang cập nhật thêm các khóa học. Vui lòng quay lại sau!
            </p>
          </div>
        )}
    </div>
  );
});

export default CourseList;
