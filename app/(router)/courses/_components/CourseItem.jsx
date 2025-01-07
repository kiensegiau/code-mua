"use client";

import React from "react";
import { BookOpen, Clock, Users, Award, TrendingUp } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

function CourseItem({ course }) {
  return (
    <Tooltip.Provider>
      <div className="relative">
        <div
          className="bg-[#1f1f1f] rounded-lg border border-gray-800 
          hover:border-[#ff4d4f]/30 transition-all duration-300 h-full flex flex-col group"
        >
          <div className="relative">
            {/* Thumbnail with consistent aspect ratio */}
            <div className="relative aspect-video">
              <img
                src={
                  course?.coverImage && course.coverImage.startsWith("http")
                    ? course.coverImage
                    : "/default-course-image.jpg"
                }
                alt={course.title || "Course banner"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Price tag */}
            <div className="absolute top-3 right-3 bg-[#ff4d4f] text-white text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm">
              {course.price > 0
                ? `${course.price.toLocaleString("vi-VN")} VND`
                : "Miễn phí"}
            </div>

            {/* Level badge */}
            <div className="absolute top-3 left-3 bg-gray-800/90 text-gray-200 text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{course.level}</span>
            </div>
          </div>

          {/* Content section with consistent spacing */}
          <div className="flex-1 p-3 flex flex-col">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <h2 className="font-semibold text-gray-200 text-base mb-1 line-clamp-2 group-hover:text-[#ff4d4f] transition-colors cursor-pointer">
                  {course.title}
                </h2>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white p-2 rounded-md text-sm shadow-lg max-w-[300px]"
                  sideOffset={5}
                >
                  {course.title}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <p className="text-xs text-gray-400 mb-2 line-clamp-1 cursor-pointer">
                  {course.subname || "Khóa học online"}
                </p>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white p-2 rounded-md text-sm shadow-lg max-w-[300px]"
                  sideOffset={5}
                >
                  {course.subname || "Khóa học online"}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            {/* Teacher info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                <Users className="w-3 h-3 text-[#ff4d4f]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-300">
                  {course.teacher}
                </p>
                <p className="text-[10px] text-gray-400">Giảng viên</p>
              </div>
            </div>

            {/* Course stats */}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-gray-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {course.duration || "100+"} giờ
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {course.totalLessons || "100+"} bài học
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

export default CourseItem;
