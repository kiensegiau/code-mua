import { UserMemberContext } from '@/app/_context/UserMemberContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import { toast } from "sonner"
function CourseEnrollSection({courseInfo,isUserAlreadyEnrolled}) {
    // const membership=false;
    const {user}=useUser();
  const {isMember,setIsMember}=useContext(UserMemberContext)

    const router=useRouter();

    useEffect(()=>{
      console.log("isUserAlreadyEnrolled",isUserAlreadyEnrolled)
    },[isUserAlreadyEnrolled])
    // Enroll to the Course
    const onEnrollCourse=()=>{
      GlobalApi.enrollToCourse(courseInfo?.slug,user?.primaryEmailAddress?.emailAddress).then(resp=>{
        console.log(resp);
        if(resp)
        {
           //Show Toast on Successfull Enroll
           toast("User Enrolled Successfull", {
            description: "User Enrolled to this Course",
          })
          window.location.reload()
          //Redirect to Watch Course
          router.push('/watch-course/'+resp.createUserEnrollCourse.id)
        }
        
      })
    }
  return (
    <div className='p-3 text-center rounded-sm bg-primary mb-3'>
       
        <h2 className='text-[22px] font-bold text-white'>
            Enroll to the Course</h2>

            {/* User has Membership and Already Login  */}
           { user&&(isMember||courseInfo.free)&&!isUserAlreadyEnrolled?<div className='flex flex-col gap-3 mt-3'>
                <h2 className='text-white font-light'>Enroll Now to Start Learning and Building the project</h2>
                <Button className="bg-white text-primary hover:bg-white
                hover:text-primary"
                onClick={()=>onEnrollCourse()}
                >Enroll Now</Button>
            </div>
            :!user?
            <div className='flex flex-col gap-3 mt-3'>
                <h2 className='text-white font-light'>Enroll Now to Start Learning and Building the project</h2>
                <Link href={'/sign-in'}><Button className="bg-white text-primary hover:bg-white
                hover:text-primary" >Enroll Now</Button>
                </Link>
            </div>
            
           : !isUserAlreadyEnrolled&&<div className='flex flex-col gap-3 mt-3'>
                <h2 className='text-white font-light'>
                    Buy Monthly Membership and Get Access to All Courses
                </h2>
                <Button className="bg-white text-primary hover:bg-white
                hover:text-primary">Buy Membership Just $2.99</Button>
            </div>}
            {/* Above Section User Does not Have membership or Not Signup/Login  */}

           {isUserAlreadyEnrolled&& 
           <div className='flex flex-col gap-3 mt-3'>
                <h2 className='text-white font-light'>
                    Continue to Learn Your Porject
                </h2>
               <Link href={'/watch-course/'+isUserAlreadyEnrolled}> <Button className="bg-white text-primary hover:bg-white
                hover:text-primary">Continue</Button>
                </Link>
            </div>}
    </div>
  )
}

export default CourseEnrollSection