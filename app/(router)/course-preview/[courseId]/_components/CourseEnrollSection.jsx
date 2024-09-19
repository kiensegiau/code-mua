import { useAuth } from '@/app/_context/AuthContext'
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext } from 'react'
import { toast } from "sonner"
import { db } from '@/app/_utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserMemberContext } from '@/app/_context/UserMemberContext'

function CourseEnrollSection({courseInfo,isUserAlreadyEnrolled}) {
    // const membership=false;
    const {user}=useAuth();
  const {isMember,setIsMember}=useContext(UserMemberContext)

    const router=useRouter();

    useEffect(()=>{
      console.log("isUserAlreadyEnrolled",isUserAlreadyEnrolled)
    },[isUserAlreadyEnrolled])
    // Enroll to the Course
    const onEnrollCourse = () => {
      if (user && user.email) {
        GlobalApi.enrollToCourse(courseInfo?.slug, user.email).then(resp => {
          console.log(resp);
          if (resp) {
            toast.success("Đăng ký khóa học thành công", {
              description: "Bạn đã đăng ký khóa học này",
            });
            router.push('/watch-course/' + resp.createUserEnrollCourse.id);
          }
        });
      } else {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      }
    }
  return (
    <div className='p-3 text-center rounded-sm bg-primary mb-3'>
       
        <h2 className='text-[22px] font-bold text-white'>
            Đăng ký khóa học
        </h2>

        {user && (courseInfo.free || isUserAlreadyEnrolled) ? (
          <div className='flex flex-col gap-3 mt-3'>
            <h2 className='text-white font-light'>Bắt đầu học và xây dựng dự án ngay bây giờ</h2>
            {isUserAlreadyEnrolled ? (
              <Link href={'/watch-course/' + isUserAlreadyEnrolled}>
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
        ) : !user ? (
          <div className='flex flex-col gap-3 mt-3'>
            <h2 className='text-white font-light'>Đăng ký ngay để bắt đầu học và xây dựng dự án</h2>
            <Link href={'/sign-in'}>
              <Button className="bg-white text-primary hover:bg-white hover:text-primary">
                Đăng nhập để đăng ký
              </Button>
            </Link>
          </div>
        ) : (
          <div className='flex flex-col gap-3 mt-3'>
            <h2 className='text-white font-light'>
              Mua gói thành viên hàng tháng và truy cập tất cả các khóa học
            </h2>
            <Button className="bg-white text-primary hover:bg-white hover:text-primary">
              Mua gói thành viên chỉ với 69.000 VND
            </Button>
          </div>
        )}
    </div>
  )
}

export default CourseEnrollSection