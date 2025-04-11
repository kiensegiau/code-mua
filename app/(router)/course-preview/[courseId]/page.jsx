"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PlayCircle,
  Clock,
  BookOpen,
  Users,
  Target,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import CourseEnrollSection from "./_components/CourseEnrollSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import CourseContentSection from "./_components/CourseContentSection";

function CoursePreview({ params }) {
  const { user, profile, isVip } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeLesson, setActiveLesson] = useState(null);

  // Tải dữ liệu khóa học
  const getCourseById = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.getCourseById(params.courseId);
      setCourse(resp);
    } catch (error) {
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  useEffect(() => {
    getCourseById();
  }, [getCourseById]);

  // Kiểm tra người dùng đã đăng ký khóa học chưa hoặc là VIP
  const isUserEnrolled = useMemo(() => {
    // Kiểm tra người dùng VIP
    if (isVip) return true;
    
    if (!user || !profile?.enrolledCourses || !course?.id) return false;

    return profile.enrolledCourses.some((c) =>
      typeof c === "string" ? c === course.id : c.courseId === course.id
    );
  }, [user, profile?.enrolledCourses, course?.id, isVip]);

  // Xử lý chuyển tab
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Xử lý khi chọn bài học
  const handleLessonSelect = useCallback((lesson) => {
    setActiveLesson(lesson);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col w-full max-w-4xl">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-60 bg-gray-800 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5 mb-4"></div>
            </div>
            <div className="h-40 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Không tìm thấy thông tin khóa học
        </h2>
        <p className="text-gray-400 mb-6">
          Khóa học này có thể đã bị xóa hoặc không tồn tại
        </p>
        <button
          onClick={() => router.push("/courses")}
          className="px-4 py-2 bg-[#ff4d4f] text-white rounded-md hover:bg-[#ff4d4f]/90 transition-colors"
        >
          Quay lại danh sách khóa học
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Thêm thông báo VIP nếu người dùng là VIP */}
      {isVip && (
        <div className="mb-6 p-3 bg-gradient-to-r from-[#ffd700]/20 to-[#ffa500]/20 border border-[#ffd700]/40 rounded-md">
          <p className="text-[#ffd700] font-medium text-center">
            Bạn đang sử dụng tài khoản VIP - Truy cập tất cả khóa học không giới hạn
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {course.title}
        </h1>
        <p className="text-gray-400 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
          <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">
            {course.subject}
          </span>
          <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full">
            {course.grade}
          </span>
          <span className="px-3 py-1">
            <Users className="inline mr-1 h-4 w-4" /> {course.enrollments || 0}{" "}
            học viên
          </span>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Giới thiệu và nội dung khóa học */}
        <div className="col-span-2 space-y-6">
          {/* Video preview */}
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
            {activeLesson?.videoUrl ? (
              <video
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Image
                  src={course.coverImage || "/images/course-default.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-80" />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex space-x-6">
              <button
                onClick={() => handleTabChange("overview")}
                className={`py-3 font-medium border-b-2 ${
                  activeTab === "overview"
                    ? "border-[#ff4d4f] text-[#ff4d4f]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => handleTabChange("content")}
                className={`py-3 font-medium border-b-2 ${
                  activeTab === "content"
                    ? "border-[#ff4d4f] text-[#ff4d4f]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Nội dung
              </button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "overview" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Giới thiệu khóa học</h3>
                <p className="text-gray-400 mb-4">{course.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg">
                    <div className="flex items-start">
                      <Target className="w-5 h-5 mr-3 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-medium mb-2">Mục tiêu khóa học</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                          <li>• Nắm vững kiến thức cơ bản và nâng cao</li>
                          <li>• Giải quyết bài tập nhanh chóng hiệu quả</li>
                          <li>• Chuẩn bị tốt cho các kỳ thi quan trọng</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1a1a] p-4 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-400 mt-1" />
                      <div>
                        <h4 className="font-medium mb-2">Sau khóa học</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                          <li>• Nắm chắc các công thức và lý thuyết</li>
                          <li>• Có kỹ năng giải quyết vấn đề hiệu quả</li>
                          <li>• Tự tin khi thi cử và làm bài tập</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Thông tin giảng viên</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                    {course.instructorName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h4 className="font-medium">{course.instructorName}</h4>
                    <p className="text-gray-400 text-sm">
                      Giảng viên {course.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CourseContentSection
              courseInfo={course}
              isUserAlreadyEnrolled={isUserEnrolled}
              setActiveLesson={handleLessonSelect}
            />
          )}
        </div>

        {/* Đăng ký khóa học */}
        <div>
          <CourseEnrollSection courseInfo={course} isEnrolling={enrolling} />
        </div>
      </div>
    </div>
  );
}

export default CoursePreview;
