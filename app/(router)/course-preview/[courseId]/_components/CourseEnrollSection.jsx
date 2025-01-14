"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CourseEnrollSection({ courseInfo, onEnroll, isEnrolling }) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const isEnrolled = profile?.enrolledCourses?.some(
    (course) => course.courseId === courseInfo.id
  );

  const handleEnrollClick = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (isEnrolled) {
      router.push(`/watch-course/${courseInfo.id}`);
      return;
    }

    // Kiểm tra số dư
    if (courseInfo.price > (profile?.balance || 0)) {
      toast.error("Số dư không đủ để mua khóa học này");
      return;
    }

    onEnroll();
  };

  return (
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
        className="w-full bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white mb-4"
        onClick={handleEnrollClick}
        disabled={isEnrolling}
      >
        {isEnrolling
          ? "Đang xử lý..."
          : isEnrolled
          ? "Tiếp tục học"
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
  );
}

export default CourseEnrollSection;
