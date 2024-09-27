import React, { useState, useEffect } from 'react';
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button, Spin } from "antd";

function CourseEnrollSection({ courseInfo, isUserAlreadyEnrolled }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isUserAlreadyEnrolled) {
      router.push(`/watch-course/${courseInfo.id}`);
    }
  }, [isUserAlreadyEnrolled, courseInfo.id, router]);

  const handleEnrollCourse = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      router.push("/login");
      return;
    }

    setIsEnrolling(true);

    try {
      await GlobalApi.enrollCourse(user.uid, courseInfo.id);
      toast.success("Đăng ký khóa học thành công!");
      setIsNavigating(true);
      router.push(`/watch-course/${courseInfo.id}`);
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      if (error.message === "Không tìm thấy thông tin người dùng") {
        toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      } else if (error.message === "Không tìm thấy thông tin khóa học") {
        toast.error("Không tìm thấy thông tin khóa học. Vui lòng thử lại sau.");
      } else {
        toast.error("Không thể đăng ký khóa học. Vui lòng thử lại sau.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <>
      <button
        onClick={handleEnrollCourse}
        disabled={isEnrolling || isNavigating || isUserAlreadyEnrolled}
        className={`w-full py-3 px-4 rounded-full font-semibold text-white ${
          isUserAlreadyEnrolled
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        } transition duration-300 ease-in-out ${(isEnrolling || isNavigating) ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isEnrolling ? "Đang xử lý..." : isNavigating ? "Đang chuyển trang..." : (isUserAlreadyEnrolled ? "Tiếp tục học" : "Đăng ký khóa học")}
      </button>
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </>
  );
}

export default CourseEnrollSection;
