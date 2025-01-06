import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Tag, Clock, Users, Award } from "lucide-react";

function CourseEnrollSection({ courseInfo, isUserAlreadyEnrolled }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Lấy thông tin user profile khi component mount hoặc user thay đổi
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await GlobalApi.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleEnrollCourse = async () => {
    if (loading) return;

    try {
      if (!user?.uid) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/sign-in");
        return;
      }

      setLoading(true);

      // Thực hiện đăng ký trực tiếp vì user đã tồn tại
      const result = await GlobalApi.enrollCourse(user.uid, courseInfo.id);

      if (result) {
        toast.success(
          <div className="space-y-2">
            <p>Đăng ký khóa học thành công!</p>
            <p className="text-sm">Khóa học: {courseInfo.title}</p>
          </div>
        );

        // Delay chuyển trang
        setTimeout(() => {
          router.push(`/watch-course/${courseInfo.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    router.push(`/watch-course/${courseInfo.id}`);
  };

  return (
    <div className="w-full">
      {/* Pricing Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#ff4d4f]">
            {courseInfo.price > 0
              ? `${courseInfo.price.toLocaleString("vi-VN")} VND`
              : "Miễn phí"}
          </span>
          {courseInfo.originalPrice &&
            courseInfo.originalPrice > courseInfo.price && (
              <span className="text-lg text-gray-400 line-through">
                {courseInfo.originalPrice.toLocaleString("vi-VN")} VND
              </span>
            )}
        </div>
        {courseInfo.price > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Tag className="w-4 h-4 text-[#ff4d4f]" />
            <span className="text-sm text-gray-400">
              Trọn đời - Không phí định kỳ
            </span>
          </div>
        )}
      </div>

      {/* Course Stats */}
      <div className="bg-[#141414] rounded-lg p-4 mb-6 space-y-3 border border-gray-800">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#ff4d4f]" />
          <div>
            <p className="text-sm font-medium text-gray-300">Thời lượng</p>
            <p className="text-sm text-gray-400">
              {courseInfo.duration || "Chưa xác định"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#ff4d4f]" />
          <div>
            <p className="text-sm font-medium text-gray-300">Học viên</p>
            <p className="text-sm text-gray-400">
              {courseInfo.enrollments || 0} người đã đăng ký
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-[#ff4d4f]" />
          <div>
            <p className="text-sm font-medium text-gray-300">Chứng nhận</p>
            <p className="text-sm text-gray-400">Cấp chứng chỉ hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isUserAlreadyEnrolled ? (
        <Button
          onClick={handleStartLearning}
          className="w-full py-6 text-base font-medium bg-primary hover:bg-primary/90"
        >
          Tiếp tục học
        </Button>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleEnrollCourse}
            disabled={loading}
            className="w-full py-6 text-base font-medium bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : courseInfo.price > 0 ? (
              "Mua khóa học ngay"
            ) : (
              "Đăng ký học miễn phí"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              {courseInfo.price > 0 ? (
                <>
                  <span className="text-[#ff4d4f]">✓</span> Bảo hành hoàn tiền
                  trong 7 ngày
                </>
              ) : (
                "Học ngay hôm nay"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseEnrollSection;
