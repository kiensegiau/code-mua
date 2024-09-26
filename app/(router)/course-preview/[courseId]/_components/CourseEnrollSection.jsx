import React, { useState } from 'react';
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CourseEnrollSection({ courseInfo, isUserAlreadyEnrolled }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

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
    <button
      onClick={handleEnrollCourse}
      disabled={isEnrolling}
      className={`w-full py-3 px-4 rounded-full font-semibold text-white ${
        isUserAlreadyEnrolled
          ? "bg-green-500 hover:bg-green-600"
          : "bg-blue-500 hover:bg-blue-600"
      } transition duration-300 ease-in-out ${isEnrolling ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isEnrolling ? "Đang xử lý..." : (isUserAlreadyEnrolled ? "Tiếp tục học" : "Đăng ký khóa học")}
    </button>
  );
}

export default CourseEnrollSection;
