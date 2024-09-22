import React, { useEffect, useRef } from 'react'
import VideoPlayer from './VideoPlayer'
import Markdown from 'react-markdown'
import { Button } from '@/components/ui/button'

function CourseVideoDescription({courseInfo, activeChapterIndex=0, activeLesson, watchMode=false,
  setChapterCompleted}) {
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    if (videoPlayerRef.current && activeLesson?.videoUrl) {
      videoPlayerRef.current.seekTo(0);
      videoPlayerRef.current.getInternalPlayer().play();
    }
  }, [activeLesson]);

  const openBackupVideo = () => {
    if (activeLesson?.files && activeLesson.files.length > 0) {
      const videoFile = activeLesson.files[0];
      if (videoFile.driveUrl) {
        window.open(videoFile.driveUrl, '_blank');
      } else if (videoFile.firebaseUrl) {
        window.open(videoFile.firebaseUrl, '_blank');
      }
    }
  };

  console.log('CourseVideoDescription props:', { courseInfo, activeChapterIndex, activeLesson, watchMode });
  console.log('CourseInfo structure:', JSON.stringify(courseInfo, null, 2));
  console.log('Active Lesson:', JSON.stringify(activeLesson, null, 2));
  return (
    <div>
        <h2 className='text-[20px] font-semibold'>{courseInfo.name}</h2>
        <h2 className='text-gray-500 text-[14px]
        mb-3'>{courseInfo.author}</h2>
        {/* Video Player  */}
        <VideoPlayer 
          ref={videoPlayerRef}
          videoUrl={activeLesson?.videoUrl || courseInfo?.chapters?.[activeChapterIndex]?.lessons?.[0]?.videoUrl}
          poster={!watchMode ? courseInfo?.banner?.url : null}
        />
        <Button onClick={openBackupVideo} className="mt-2 mb-4">Mở video dự phòng</Button>
        
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