"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  runTransaction,
  collection,
} from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import { toast } from "sonner";
import GlobalApi from "@/app/_utils/GlobalApi";
import Image from "next/image";

// Lazy load các icon để giảm kích thước bundle ban đầu
const BookOpen = dynamic(
  () => import("lucide-react").then((mod) => mod.BookOpen),
  { ssr: false }
);
const Clock = dynamic(() => import("lucide-react").then((mod) => mod.Clock), {
  ssr: false,
});
const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), {
  ssr: false,
});
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => mod.CheckCircle),
  { ssr: false }
);
const Star = dynamic(() => import("lucide-react").then((mod) => mod.Star), {
  ssr: false,
});
const TrendingUp = dynamic(
  () => import("lucide-react").then((mod) => mod.TrendingUp),
  { ssr: false }
);

// Dynamic import cho Modal để giảm kích thước bundle ban đầu
const ConfirmEnrollModal = dynamic(() => import("./ConfirmEnrollModal"), {
  ssr: false,
  loading: () => <div className="hidden">Loading...</div>,
});

// Lazy load Tooltip component
const TooltipProvider = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Provider),
  { ssr: false }
);
const TooltipRoot = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Root),
  { ssr: false }
);
const TooltipTrigger = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Trigger),
  { ssr: false }
);
const TooltipContent = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Content),
  { ssr: false }
);
const TooltipArrow = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Arrow),
  { ssr: false }
);
const TooltipPortal = dynamic(
  () => import("@radix-ui/react-tooltip").then((mod) => mod.Portal),
  { ssr: false }
);

// Tối ưu hóa component với React.memo
const CourseItem = memo(function CourseItem({ course }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const coursePrice = course?.price || 0;
  const userBalance = profile?.balance || 0;

  // Kiểm tra kỹ xem khóa học đã được đăng ký chưa
  const isEnrolled = useMemo(() => {
    if (!profile?.enrolledCourses || !course?.id) {
      return false;
    }

    // Kiểm tra trong mảng enrolledCourses
    return profile.enrolledCourses.some((c) => {
      // Kiểm tra cả hai trường hợp:
      // 1. c là string (courseId)
      // 2. c là object (có courseId)
      return typeof c === "string" ? c === course.id : c.courseId === course.id;
    });
  }, [profile?.enrolledCourses, course?.id]);

  // Kiểm tra điều kiện đăng ký
  const canEnroll = useMemo(() => {
    if (!user || !profile || !course) return false;
    if (isEnrolled) return false;
    if (coursePrice > userBalance) return false;
    return true;
  }, [user, profile, course, isEnrolled, coursePrice, userBalance]);

  const handleCourseClick = useCallback(() => {
    if (isEnrolled) {
      router.push(`/watch-course/${course.id}`);
    } else {
      router.push(`/course-preview/${course.id}`);
    }
  }, [course?.id, isEnrolled, router]);

  const verifyEnrollment = useCallback(async () => {
    try {
      setVerifying(true);

      // Kiểm tra lại user và profile
      if (!user || !profile) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        router.push("/sign-in");
        return false;
      }

      // Kiểm tra khóa học tồn tại
      if (!course?.id) {
        toast.error("Không tìm thấy thông tin khóa học");
        return false;
      }

      // Kiểm tra lại số dư
      const latestProfile = await GlobalApi.getUserProfile(user.uid);

      if (!latestProfile) {
        toast.error("Không thể lấy thông tin người dùng");
        return false;
      }

      const latestBalance = latestProfile.balance || 0;
      if (coursePrice > latestBalance) {
        toast.error("Số dư không đủ để mua khóa học này");
        return false;
      }

      // Kiểm tra lại trạng thái đăng ký
      const isAlreadyEnrolled = latestProfile.enrolledCourses?.some((c) => {
        return typeof c === "string"
          ? c === course.id
          : c.courseId === course.id;
      });

      if (isAlreadyEnrolled) {
        toast.error("Bạn đã đăng ký khóa học này rồi");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi xác minh đăng ký:", error);
      toast.error("Có lỗi xảy ra khi xác minh thông tin");
      return false;
    } finally {
      setVerifying(false);
    }
  }, [user, profile, course, coursePrice, router]);

  const handleEnrollClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      // Kiểm tra điều kiện cơ bản
      if (!canEnroll) {
        if (coursePrice > userBalance) {
          toast.error("Số dư không đủ để mua khóa học này");
        } else if (isEnrolled) {
          toast.error("Bạn đã đăng ký khóa học này rồi");
        } else {
          toast.error("Không thể đăng ký khóa học lúc này");
        }
        return;
      }

      setShowConfirmModal(true);
    },
    [user, canEnroll, coursePrice, userBalance, isEnrolled, router]
  );

  const handleConfirmEnroll = useCallback(async () => {
    try {
      setEnrolling(true);

      // Xác minh lại toàn bộ điều kiện
      const isVerified = await verifyEnrollment();
      if (!isVerified) return;

      // Xác định courseId đúng - hỗ trợ cả id và _id
      const courseId = course.id || course._id;
      
      // Xác định userId đúng - hỗ trợ cả uid và id
      const userId = user.uid || user.id;
      
      console.log("Đăng ký khóa học với thông tin:", {
        courseId,
        userId,
        courseInfo: {
          title: course.title,
          price: coursePrice
        }
      });
      
      // Gọi API đăng ký khóa học thay vì sử dụng transaction Firebase trực tiếp
      const response = await GlobalApi.enrollCourse(userId, courseId);
      console.log("Phản hồi API đăng ký khóa học:", response);

      toast.success("Đăng ký khóa học thành công!");

      // Đóng modal trước khi chuyển trang
      setShowConfirmModal(false);

      // Thêm setTimeout để đảm bảo toast message hiển thị trước khi chuyển trang
      setTimeout(() => {
        router.push(`/watch-course/${courseId}`);
      }, 1000);
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đăng ký khóa học");
    } finally {
      setEnrolling(false);
    }
  }, [course, coursePrice, user, router, verifyEnrollment]);

  // Sử dụng CSS thuần thay vì Framer Motion
  const placeholderStyles = {
    animation: "pulse 3s infinite ease-in-out",
  };

  return (
    <>
      <TooltipProvider>
        <div onClick={handleCourseClick} className="cursor-pointer h-full">
          <div className="h-full flex flex-col bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 hover-translate-up">
            {/* Thumbnail section */}
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
              {/* Placeholder với gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] to-[#191919] flex items-center justify-center">
                {!course.thumbnailUrl && (
                  <div className="text-center relative">
                    {/* Hiệu ứng glow phía sau - tối ưu hóa */}
                    <div className="absolute -inset-3 bg-[#ff4d4f]/10 rounded-full blur-xl animate-pulse-custom"></div>

                    {/* Tạo hình trang trí ở các góc - static để giảm tải */}
                    <div className="absolute -top-24 -right-24 w-40 h-40 bg-[#ff4d4f]/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-[#ff4d4f]/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff4d4f]/20 to-[#ff4d4f]/5 flex items-center justify-center mx-auto mb-3 border border-[#ff4d4f]/20">
                        <BookOpen className="w-8 h-8 text-[#ff4d4f]/50" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[#ff4d4f]/70 font-medium text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#ff4d4f]/90 to-[#ff7875]/90">
                          Hoc Mai
                        </p>
                        <p className="text-xs text-gray-500 px-4">
                          Khóa học sẽ hiển thị tại đây
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hiệu ứng dạng lưới - static */}
              {!course.thumbnailUrl && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                                   linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              )}

              {/* Lazy loading cho hình ảnh */}
              {course.thumbnailUrl && (
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title || "Khóa học"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}

              {/* Show enrolled badge if enrolled - tối ưu hóa animation */}
              {isEnrolled && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-[#ff4d4f] rounded-full p-2 animate-fadeInScale">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}

              {/* Price tag - static thay vì animation */}
              <div className="absolute top-3 right-3 bg-[#ff4d4f] text-white text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm">
                {course.price > 0
                  ? `${course.price.toLocaleString("vi-VN")} VND`
                  : "Miễn phí"}
              </div>

              {/* Level badge - static thay vì animation */}
              <div className="absolute top-3 left-3 bg-gray-800/90 text-gray-200 text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{course.level}</span>
              </div>
            </div>

            {/* Content section with consistent spacing */}
            <div className="flex-1 p-3 flex flex-col justify-between min-h-[180px]">
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <h2 className="font-semibold text-gray-200 text-base mb-1 line-clamp-2 group-hover:text-[#ff4d4f] transition-colors">
                    {course.title}
                  </h2>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    className="bg-gray-900 text-white p-2 rounded-md text-sm shadow-lg max-w-[300px]"
                    sideOffset={5}
                  >
                    {course.title}
                    <TooltipArrow className="fill-gray-900" />
                  </TooltipContent>
                </TooltipPortal>
              </TooltipRoot>

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                    {course.subname || "Khóa học online"}
                  </p>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    className="bg-gray-900 text-white p-2 rounded-md text-sm shadow-lg max-w-[300px]"
                    sideOffset={5}
                  >
                    {course.subname || "Khóa học online"}
                    <TooltipArrow className="fill-gray-900" />
                  </TooltipContent>
                </TooltipPortal>
              </TooltipRoot>

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

              {/* Enroll/Start Learning button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEnrolled) {
                    router.push(`/watch-course/${course.id}`);
                  } else {
                    handleEnrollClick(e);
                  }
                }}
                disabled={!isEnrolled && (enrolling || verifying || !canEnroll)}
                className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover-scale
                  ${
                    isEnrolled
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : enrolling || verifying
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : canEnroll
                      ? "bg-[#ff4d4f] text-white hover:bg-[#ff4d4f]/90"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isEnrolled
                  ? "Vào học ngay"
                  : enrolling
                  ? "Đang xử lý..."
                  : verifying
                  ? "Đang xác minh..."
                  : !canEnroll
                  ? coursePrice > userBalance
                    ? "Số dư không đủ"
                    : isEnrolled
                    ? "Đã đăng ký"
                    : "Không thể đăng ký"
                  : "Đăng ký ngay"}
              </button>
            </div>
          </div>
        </div>
      </TooltipProvider>

      {showConfirmModal && (
        <ConfirmEnrollModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmEnroll}
          course={course}
          userBalance={userBalance}
          loading={enrolling || verifying}
        />
      )}
    </>
  );
});

export default CourseItem;
