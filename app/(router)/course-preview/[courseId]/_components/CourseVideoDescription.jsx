import React from 'react'
import VideoPlayer from './VideoPlayer'
import Markdown from 'react-markdown'
import { Button } from '@/components/ui/button'

function CourseVideoDescription({courseInfo,activeChapterIndex=0,watchMode=false,
  setChapterCompleted}) {
  return (
    <div>
        <h2 className='text-[20px] font-semibold'>{courseInfo.name}</h2>
        <h2 className='text-gray-500 text-[14px]
        mb-3'>{courseInfo.author}</h2>
        {/* Video Player  */}
        <VideoPlayer 
          videoUrl={courseInfo?.chapter && courseInfo.chapter.length > activeChapterIndex
            ? courseInfo.chapter[activeChapterIndex]?.video?.url
            : undefined}
          poster={!watchMode?courseInfo?.banner?.url:null}
        />
        
        {/* Description  */}
        {watchMode && courseInfo?.chapter && courseInfo.chapter.length > activeChapterIndex ? (
          <>
            <span className='flex justify-between items-center'>
              {courseInfo.chapter[activeChapterIndex]?.name}
              <Button onClick={() => setChapterCompleted(courseInfo.chapter[activeChapterIndex]?.id)}>
                Mark Completed
              </Button>
            </span>
            <Markdown className='text-[13px] font-light mt-2 leading-7'>
              {courseInfo.chapter[activeChapterIndex]?.shortDesc}
            </Markdown>
          </>
        ) : (
          <>
            <span>About This Course</span>
            <Markdown className='text-[13px] font-light mt-2 leading-7'>
              {courseInfo.description}
            </Markdown>
          </>
        )}
        
    </div>
  )
}

export default CourseVideoDescription