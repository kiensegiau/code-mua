import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useEnrollCourse } from "@/app/_hooks/useGlobalApi";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnrollButton = ({ course, onSuccess }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const enrollCourseMutation = useEnrollCourse();

  const handleEnrollClick = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      return;
    }

    try {
      setLoading(true);
      
      // Xác định courseId đúng
      const courseId = course.id || course._id;
      
      // Xác định userId đúng
      const userId = user.uid || user.id;
      
      // Thêm log chi tiết
      console.log("Đăng ký khóa học với dữ liệu:", { 
        courseId,
        course: course,
        userId,
        user: user
      });
      
      // Gọi API đăng ký khóa học
      await enrollCourseMutation.mutateAsync({
        courseId: courseId,
        userId: userId
      });
      
      toast.success("Đăng ký khóa học thành công!");
      
      // Gọi callback nếu có
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      
      // Log chi tiết lỗi
      console.log("Chi tiết lỗi:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      // Hiển thị thông báo lỗi
      toast.error(`Lỗi khi đăng ký khóa học: ${error.message || "Vui lòng thử lại sau"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnrollClick}
      disabled={loading}
      className="w-full bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang đăng ký...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          Đăng ký học
        </>
      )}
    </Button>
  );
};

export default EnrollButton; 