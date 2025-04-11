"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  runTransaction,
  collection,
} from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import ConfirmEnrollModal from "../../../courses/_components/ConfirmEnrollModal";

function CourseEnrollSection({ courseInfo, isEnrolling }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const coursePrice = courseInfo?.price || 0;
  const userBalance = profile?.balance || 0;
  
  // Kiểm tra người dùng có VIP không
  const isUserVip = React.useMemo(() => {
    if (!profile) return false;
    
    // Kiểm tra trạng thái VIP và thời hạn
    const isVip = profile.isVip === true;
    const hasValidExpiration = profile.vipExpiresAt && new Date(profile.vipExpiresAt) > new Date();
    
    return isVip && hasValidExpiration;
  }, [profile]);

  // Kiểm tra kỹ xem khóa học đã được đăng ký chưa hoặc người dùng là VIP
  const isEnrolled = React.useMemo(() => {
    // Nếu là người dùng VIP, luôn coi như đã đăng ký
    if (isUserVip) return true;
    
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
  }, [profile?.enrolledCourses, courseInfo?.id, isUserVip]);

  // Kiểm tra điều kiện đăng ký
  const canEnroll = React.useMemo(() => {
    // Nếu là VIP, không cần kiểm tra điều kiện đăng ký
    if (isUserVip) return true;
    
    if (!user || !profile || !courseInfo) return false;
    if (isEnrolled) return false;
    if (coursePrice > userBalance) return false;
    return true;
  }, [user, profile, courseInfo, isEnrolled, coursePrice, userBalance, isUserVip]);

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
      
      // Kiểm tra xem người dùng có VIP không
      const isVip = profile.isVip === true;
      const hasValidExpiration = profile.vipExpiresAt && new Date(profile.vipExpiresAt) > new Date();
      
      // Nếu người dùng VIP, luôn cho phép truy cập
      if (isVip && hasValidExpiration) {
        return true;
      }

      // Kiểm tra lại số dư nếu không phải VIP
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

    // Nếu là VIP hoặc đã đăng ký, chuyển thẳng đến trang học
    if (isUserVip || isEnrolled) {
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

      // Kiểm tra nếu là người dùng VIP thì không cần thanh toán, chuyển thẳng đến trang học
      const isVip = profile.isVip === true && profile.vipExpiresAt && new Date(profile.vipExpiresAt) > new Date();
      if (isVip) {
        toast.success("Truy cập khóa học thành công với tài khoản VIP!");
        
        // Đóng modal trước khi chuyển trang
        setShowConfirmModal(false);
        
        setTimeout(() => {
          router.push(`/watch-course/${courseInfo.id}`);
        }, 1000);
        
        return;
      }

      // Lưu courseId thay vì object phức tạp
      const courseId = courseInfo.id;

      const userDocRef = doc(db, "users", profile.id);
      const courseRef = doc(db, "courses", courseInfo.id);

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
          title: courseInfo.title || "",
          coverImage: courseInfo.coverImage || "",
          progress: 0,
          lastAccessed: null,
        });
      });

      toast.success("Đăng ký khóa học thành công!");

      // Đóng modal trước khi chuyển trang
      setShowConfirmModal(false);

      // Thêm setTimeout để đảm bảo toast message hiển thị trước khi chuyển trang
      setTimeout(() => {
        router.push(`/watch-course/${courseInfo.id}`);
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
      <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 p-6">
        {isUserVip && (
          <div className="mb-4 p-2 bg-gradient-to-r from-[#ffd700]/20 to-[#ffa500]/20 border border-[#ffd700]/40 rounded-md">
            <p className="text-[#ffd700] font-medium text-center">
              Bạn đang sử dụng tài khoản VIP - Truy cập tất cả khóa học
            </p>
          </div>
        )}
        
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

          {user && !isUserVip && (
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
          
          {user && isUserVip && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Hết hạn VIP</p>
              <p className="text-base font-medium text-[#ffd700]">
                {new Date(profile?.vipExpiresAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}
        </div>

        <Button
          className={`w-full text-white mb-4
            ${
              enrolling || verifying
                ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed"
                : !canEnroll && !isEnrolled && !isUserVip
                ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed" 
                : isUserVip
                ? "bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffa500] hover:to-[#ff8c00] text-black"
                : "bg-[#ff4d4f] hover:bg-[#ff4d4f]/90"
            }`}
          onClick={handleEnrollClick}
          disabled={enrolling || verifying || (!canEnroll && !isEnrolled && !isUserVip)}
        >
          {enrolling
            ? "Đang xử lý..."
            : verifying
            ? "Đang xác minh..."
            : isUserVip
            ? "Xem khóa học ngay (VIP)"
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
