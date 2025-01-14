"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
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
import ConfirmEnrollModal from "./ConfirmEnrollModal";
import GlobalApi from "@/app/_utils/GlobalApi";

function CourseItem({ course }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const coursePrice = course?.price || 0;
  const userBalance = profile?.balance || 0;

  // Kiểm tra kỹ xem khóa học đã được đăng ký chưa
  const isEnrolled = useMemo(() => {
    if (!profile?.enrolledCourses || !course?.id) {
      console.log("Không có enrolledCourses hoặc course.id", {
        enrolledCourses: profile?.enrolledCourses,
        courseId: course?.id,
      });
      return false;
    }

    console.log("Kiểm tra đăng ký cho khóa học:", {
      courseId: course.id,
      courseTitle: course.title,
      enrolledCourses: profile.enrolledCourses,
    });

    // Kiểm tra trong mảng enrolledCourses
    const enrolled = profile.enrolledCourses.some((c) => {
      // Log chi tiết từng khóa học đã đăng ký
      console.log("Kiểm tra khóa học đã đăng ký:", {
        enrolledCourse: c,
        type: typeof c,
        courseIdToCheck: course.id,
        isMatch:
          typeof c === "string" ? c === course.id : c.courseId === course.id,
      });

      // Kiểm tra cả hai trường hợp:
      // 1. c là string (courseId)
      // 2. c là object (có courseId)
      return typeof c === "string" ? c === course.id : c.courseId === course.id;
    });

    console.log(
      `Kết quả kiểm tra đăng ký: ${enrolled ? "Đã đăng ký" : "Chưa đăng ký"}`
    );
    return enrolled;
  }, [profile?.enrolledCourses, course?.id, course?.title]);

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

  const verifyEnrollment = async () => {
    try {
      setVerifying(true);
      console.log("Bắt đầu xác minh đăng ký cho khóa học:", {
        courseId: course?.id,
        courseTitle: course?.title,
      });

      // Kiểm tra lại user và profile
      if (!user || !profile) {
        console.log("Không có user hoặc profile");
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        router.push("/sign-in");
        return false;
      }

      // Kiểm tra khóa học tồn tại
      if (!course?.id) {
        console.log("Không tìm thấy course.id");
        toast.error("Không tìm thấy thông tin khóa học");
        return false;
      }

      // Kiểm tra lại số dư
      const latestProfile = await GlobalApi.getUserProfile(user.uid);
      console.log("Thông tin profile mới nhất:", {
        profile: latestProfile,
        enrolledCourses: latestProfile?.enrolledCourses,
      });

      if (!latestProfile) {
        console.log("Không lấy được thông tin profile mới nhất");
        toast.error("Không thể lấy thông tin người dùng");
        return false;
      }

      const latestBalance = latestProfile.balance || 0;
      if (coursePrice > latestBalance) {
        console.log("Số dư không đủ", {
          coursePrice,
          latestBalance,
        });
        toast.error("Số dư không đủ để mua khóa học này");
        return false;
      }

      // Kiểm tra lại trạng thái đăng ký
      const isAlreadyEnrolled = latestProfile.enrolledCourses?.some((c) => {
        const isEnrolled =
          typeof c === "string" ? c === course.id : c.courseId === course.id;
        console.log("Kiểm tra khóa học trong profile mới:", {
          enrolledCourse: c,
          courseId: course.id,
          isEnrolled,
        });
        return isEnrolled;
      });

      if (isAlreadyEnrolled) {
        console.log("Đã tìm thấy khóa học trong danh sách đã đăng ký");
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
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    console.log("Click đăng ký khóa học", { coursePrice, userBalance });

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
  };

  const handleConfirmEnroll = async () => {
    try {
      console.log("Bắt đầu xử lý đăng ký khóa học");
      setEnrolling(true);

      // Xác minh lại toàn bộ điều kiện
      const isVerified = await verifyEnrollment();
      if (!isVerified) return;

      // Lưu courseId thay vì object phức tạp
      const courseId = course.id;

      console.log("Thông tin khóa học đăng ký:", { courseId });

      const userDocRef = doc(db, "users", profile.id);
      const courseRef = doc(db, "courses", course.id);

      // Thực hiện transaction để đảm bảo tính nhất quán
      await runTransaction(db, async (transaction) => {
        // 1. Đọc tất cả dữ liệu cần thiết
        const userDoc = await transaction.get(userDocRef);
        const courseDoc = await transaction.get(courseRef);

        if (!userDoc.exists()) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        if (!courseDoc.exists()) {
          throw new Error("Không tìm thấy thông tin khóa học");
        }

        const userData = userDoc.data();
        const courseData = courseDoc.data();
        const currentBalance = userData.balance || 0;

        // 2. Kiểm tra điều kiện
        if (coursePrice > currentBalance) {
          throw new Error("Số dư không đủ");
        }

        if (userData.enrolledCourses?.includes(courseId)) {
          throw new Error("Đã đăng ký khóa học này");
        }

        // 3. Thực hiện tất cả các thao tác ghi
        transaction.update(userDocRef, {
          balance: currentBalance - coursePrice,
          enrolledCourses: arrayUnion(courseId), // Lưu courseId thay vì object
        });

        transaction.update(courseRef, {
          totalStudents: (courseData.totalStudents || 0) + 1,
          updatedAt: new Date().toISOString(),
          enrolledUsers: arrayUnion(user.uid), // Thêm user vào danh sách học viên
        });

        // 4. Lưu thông tin chi tiết vào collection riêng
        const enrollmentRef = doc(collection(db, "enrollments"));
        transaction.set(enrollmentRef, {
          userId: user.uid,
          courseId: courseId,
          enrolledAt: new Date().toISOString(),
          price: coursePrice,
          title: course.title || "",
          coverImage: course.coverImage || "",
          progress: 0,
          lastAccessed: null,
        });
      });

      console.log("Đã cập nhật thành công");
      toast.success("Đăng ký khóa học thành công!");

      // Đóng modal trước khi chuyển trang
      setShowConfirmModal(false);

      // Thêm setTimeout để đảm bảo toast message hiển thị trước khi chuyển trang
      setTimeout(() => {
        router.push(`/watch-course/${course.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đăng ký khóa học");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <Tooltip.Provider>
        <div className="relative" onClick={handleCourseClick}>
          <div
            className="bg-[#1f1f1f] rounded-lg border border-gray-800 
            hover:border-[#ff4d4f]/30 transition-all duration-300 h-full flex flex-col group cursor-pointer"
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
                {isEnrolled && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-[#ff4d4f] rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
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
                  <h2 className="font-semibold text-gray-200 text-base mb-1 line-clamp-2 group-hover:text-[#ff4d4f] transition-colors">
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
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">
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

              {/* Enroll button */}
              {!isEnrolled && (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling || verifying || !canEnroll}
                  className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
                    ${
                      enrolling || verifying
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : canEnroll
                        ? "bg-[#ff4d4f] text-white hover:bg-[#ff4d4f]/90"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {enrolling
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
              )}
            </div>
          </div>
        </div>
      </Tooltip.Provider>

      <ConfirmEnrollModal
        isOpen={showConfirmModal}
        onClose={() => {
          console.log("Đóng modal");
          setShowConfirmModal(false);
        }}
        onConfirm={() => {
          console.log("Xác nhận đăng ký", { coursePrice, userBalance });
          handleConfirmEnroll();
        }}
        course={course}
        userBalance={userBalance}
        loading={enrolling || verifying}
      />
    </>
  );
}

export default CourseItem;
