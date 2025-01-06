import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/_context/AuthContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CourseEnrollSection({ courseInfo, isUserAlreadyEnrolled }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleEnrollCourse = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học');
      router.push('/sign-in');
      return;
    }

    try {
      const result = await GlobalApi.enrollCourse(user.uid, courseInfo.id);
      if (result) {
        toast.success('Đăng ký khóa học thành công!');
        router.push(`/watch-course/${courseInfo.id}`);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký khóa học:', error);
      toast.error('Có lỗi xảy ra khi đăng ký khóa học');
    }
  };

  const handleStartLearning = () => {
    router.push(`/watch-course/${courseInfo.id}`);
  };

  return (
    <div className="w-full">
      {isUserAlreadyEnrolled ? (
        <Button 
          onClick={handleStartLearning}
          className="w-full py-6 text-base md:text-lg font-medium bg-primary hover:bg-primary/90"
        >
          Tiếp tục học
        </Button>
      ) : (
        <Button
          onClick={handleEnrollCourse}
          className="w-full py-6 text-base md:text-lg font-medium bg-primary hover:bg-primary/90"
        >
          {courseInfo.price > 0 ? 'Mua khóa học' : 'Đăng ký học'}
        </Button>
      )}
      
      {!isUserAlreadyEnrolled && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {courseInfo.price > 0 
              ? 'Thanh toán an toàn & bảo mật'
              : 'Học ngay hôm nay'}
          </p>
        </div>
      )}
    </div>
  );
}

export default CourseEnrollSection;
