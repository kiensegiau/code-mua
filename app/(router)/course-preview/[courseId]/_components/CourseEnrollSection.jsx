"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import ConfirmEnrollModal from "../../../courses/_components/ConfirmEnrollModal";
import GlobalMongoApi from "@/app/_utils/GlobalMongoApi";

function CourseEnrollSection({ courseInfo, isEnrolling }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const coursePrice = courseInfo?.price || 0;
  const userBalance = profile?.balance || 0;

  // Kiểm tra kỹ xem khóa học đã được đăng ký chưa
  const isEnrolled = React.useMemo(() => {
    if (!profile?.enrolledCourses || !courseInfo?.id) {
      return false;
    }

    // Kiểm tra trong mảng enrolledCourses
    return profile.enrolledCourses.some((c) => {
      // Kiểm tra cả hai trường hợp:
      // 1. c là string (courseId)
      // 2. c là object (có courseId)
      return typeof c === "string"
        ? c === courseInfo.id
        : c.courseId === courseInfo.id;
    });
  }, [profile?.enrolledCourses, courseInfo?.id]);

  // Kiểm tra điều kiện đăng ký
  const canEnroll = React.useMemo(() => {
    if (!user || !profile || !courseInfo) return false;
    if (isEnrolled) return false;
    if (coursePrice > userBalance) return false;
    return true;
  }, [user, profile, courseInfo, isEnrolled, coursePrice, userBalance]);

  const verifyEnrollment = async () => {
    try {
      setVerifying(true);

      // Kiểm tra lại user và profile
      if (!user || !profile) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        router.push("/sign-in");
        return false;
      }

      // Kiểm tra khóa học tồn tại
      if (!courseInfo?.id) {
        toast.error("Không tìm thấy thông tin khóa học");
        return false;
      }

      // Kiểm tra lại số dư
      if (coursePrice > userBalance) {
        toast.error("Số dư không đủ để mua khóa học này");
        return false;
      }

      // Kiểm tra lại trạng thái đăng ký
      const isAlreadyEnrolled = profile.enrolledCourses?.some((c) => {
        const isEnrolled =
          typeof c === "string"
            ? c === courseInfo.id
            : c.courseId === courseInfo.id;
        return isEnrolled;
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
  };

  const handleEnrollClick = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (isEnrolled) {
      router.push(`/watch-course/${courseInfo.id}`);
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
      setEnrolling(true);

      // Xác minh lại toàn bộ điều kiện
      const isVerified = await verifyEnrollment();
      if (!isVerified) return;

      // Gọi API để đăng ký khóa học qua MongoDB
      const response = await axios.post(`/api/courses/${courseInfo.id}/purchase`);
      
      if (response.data.success) {
        toast.success("Đăng ký khóa học thành công!");
        
        // Đóng modal trước khi chuyển trang
        setShowConfirmModal(false);
        
        // Cập nhật profile từ MongoDB
        const updatedProfile = await GlobalMongoApi.getUserProfile(user.uid);
        
        // Thêm setTimeout để đảm bảo toast message hiển thị trước khi chuyển trang
        setTimeout(() => {
          router.push(`/watch-course/${courseInfo.id}`);
        }, 1000);
      } else {
        toast.error(response.data.message || "Không thể đăng ký khóa học, vui lòng thử lại sau");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      toast.error(error.response?.data?.message || error.message || "Có lỗi xảy ra khi đăng ký khóa học");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {courseInfo.price > 0
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(courseInfo.price)
                : "Miễn phí"}
            </h3>
            {courseInfo.originalPrice &&
              courseInfo.originalPrice > courseInfo.price && (
                <p className="text-sm text-gray-400 line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(courseInfo.originalPrice)}
                </p>
              )}
          </div>

          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Số dư hiện tại</p>
              <p className="text-base font-medium text-[#ff4d4f]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(profile?.balance || 0)}
              </p>
            </div>
          )}
        </div>

        <Button
          className={`w-full text-white mb-4
            ${
              enrolling || verifying
                ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed"
                : !canEnroll && !isEnrolled
                ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed"
                : "bg-[#ff4d4f] hover:bg-[#ff4d4f]/90"
            }`}
          onClick={handleEnrollClick}
          disabled={enrolling || verifying || (!canEnroll && !isEnrolled)}
        >
          {enrolling
            ? "Đang xử lý..."
            : verifying
            ? "Đang xác minh..."
            : isEnrolled
            ? "Tiếp tục học"
            : !canEnroll
            ? coursePrice > userBalance
              ? "Số dư không đủ"
              : "Không thể đăng ký"
            : "Đăng ký ngay"}
        </Button>

        <div className="space-y-4">
          <h4 className="font-medium text-white">Khóa học bao gồm:</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• {courseInfo.totalLessons} bài giảng</li>
            <li>• Thời lượng {courseInfo.duration}</li>
            <li>• Truy cập không giới hạn</li>
            <li>• Giáo trình đầy đủ</li>
            <li>• Chứng chỉ hoàn thành</li>
          </ul>
        </div>
      </div>

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
        course={courseInfo}
        userBalance={userBalance}
        loading={enrolling || verifying}
      />
    </>
  );
}

export default CourseEnrollSection;
