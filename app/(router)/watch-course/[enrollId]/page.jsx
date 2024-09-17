"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CourseVideoDescription from '../../course-preview/[courseId]/_components/CourseVideoDescription';
import CourseContentSection from '../../course-preview/[courseId]/_components/CourseContentSection';
import { toast } from 'sonner';

function WatchCourse({params}) {
  const {user}=useUser();
  const [courseInfo,setCourseInfo]=useState([]);
  const [completedChapter,setCompletedChapter]=useState([])
  const [activeChapterIndex,setActiveChapterIndex]=useState(0);
  useEffect(()=>{
    console.log('HERE')

  },[])
  useEffect(()=>{
    console.log('HERE')
    params&&user&&getUserEnrolledCourseDetail();
  },[params&&user])
  /**
   * Get User Enrolled Course Details by Id+Email
   */
  const getUserEnrolledCourseDetail=()=>{
    GlobalApi.getUserEnrolledCourseDetails(params.enrollId,
      user.primaryEmailAddress.emailAddress)
      .then(resp=>{
        setCompletedChapter(resp.userEnrollCourses[0].completedChapter) 
        setCourseInfo(resp.userEnrollCourses[0].courseList);
      })
  }

  /**
   * Save Completed Chapter Id 
   */
  const onChapterComplete=(chapterId)=>{
      GlobalApi.markChapterCompleted(params.enrollId,chapterId).then(resp=>{
        console.log(resp);
        if(resp)
        {
          toast('Chapter Marked as completed!');
          getUserEnrolledCourseDetail();
        }
      })
  }
  return courseInfo.name&&(
    <div className='grid grid-cols-1 md:grid-cols-3 p-5 gap-3'>
    {/* Title Video, Description */}
    <div className='col-span-2 bg-white p-3'> 
         <CourseVideoDescription courseInfo={courseInfo}
         activeChapterIndex={activeChapterIndex}
         watchMode={true}
         setChapterCompleted={(chapterId)=>onChapterComplete(chapterId)}
         />
    </div>

    {/* Course Content  */}
    <div>
      
         <CourseContentSection courseInfo={courseInfo}
          isUserAlreadyEnrolled={true}
          watchMode={true}
          completedChapter={completedChapter}
          setActiveChapterIndex={(index)=>setActiveChapterIndex(index)}
          />
    </div>
 </div>
  )
}

export default WatchCourse