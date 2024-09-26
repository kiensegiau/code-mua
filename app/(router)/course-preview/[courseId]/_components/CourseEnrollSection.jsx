import { useAuth } from '@/app/_context/AuthContext'
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext } from 'react'
import { toast } from "sonner"
import { db } from '@/app/_utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserMemberContext from '@/app/_context/UserMemberContext';  // Điều chỉnh đường dẫn nếu cần

function CourseEnrollSection({courseInfo,isUserAlreadyEnrolled}) {
    // const membership=false;
    const {user} = useAuth();
    const userMemberContext = useContext(UserMemberContext);
    const {isMember = false, setIsMember = () => {}} = userMemberContext ?? {};


    const router=useRouter();

    useEffect(()=>{
      console.log("isUserAlreadyEnrolled",isUserAlreadyEnrolled)
    },[isUserAlreadyEnrolled])
    // Enroll to the Course
    const onEnrollCourse = async () => {
      if (user && user.uid) {
        try {
          const isEnrolled = await GlobalApi.isUserEnrolled(user.uid, courseInfo.id);
          if (isEnrolled) {
            toast.info("Bạn đã đăng ký khóa học này rồi");
            return;
          }
          
          const enrollmentId = await GlobalApi.enrollCourse(user.uid, courseInfo.id);
          if (enrollmentId) {
            toast.success("Đăng ký khóa học thành công", {
              description: "Bạn đã đăng ký khóa học này",
            });
            router.push('/watch-course/' + courseInfo.id);
          }
        } catch (error) {
          console.error("Lỗi khi đăng ký khóa học:", error);
          toast.error("Đã xảy ra lỗi khi đăng ký khóa học. Vui lòng thử lại.");
        }
      } else {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      }
    }
  return (
    <div className='p-3 text-center rounded-sm bg-primary mb-3'>
       
        <h2 className='text-[22px] font-bold text-white'>
            Đăng ký khóa học
        </h2>

        {user ? (
          <div className='flex flex-col gap-3 mt-3'>
            <h2 className='text-white font-light'>
              {isUserAlreadyEnrolled ? 'Bạn đã đăng ký khóa học này' : 'Bắt đầu học và xây dựng dự án ngay bây giờ'}
            </h2>
            {isUserAlreadyEnrolled ? (
              <Link href={'/watch-course/' + courseInfo.id}>
                <Button className="bg-white text-primary hover:bg-white hover:text-primary">
                  Tiếp tục học
                </Button>
              </Link>
            ) : (
              <Button
                className="bg-white text-primary hover:bg-white hover:text-primary"
                onClick={onEnrollCourse}
              >
                Đăng ký ngay
              </Button>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-3 mt-3'>
            <h2 className='text-white font-light'>Đăng nhập để đăng ký khóa học</h2>
            <Link href={'/sign-in'}>
              <Button className="bg-white text-primary hover:bg-white hover:text-primary">
                Đăng nhập
              </Button>
            </Link>
          </div>
        )}
    </div>
  )
}

export default CourseEnrollSection