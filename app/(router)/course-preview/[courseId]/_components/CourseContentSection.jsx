import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/_utils/firebase';

function CourseContentSection({ courseInfo, isUserAlreadyEnrolled, watchMode, setActiveLesson }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    if (courseInfo && courseInfo.chapters && courseInfo.chapters.length > 0) {
      setActiveChapterIndex(0);
      if (courseInfo.chapters[0].lessons && courseInfo.chapters[0].lessons.length > 0) {
        handleLessonClick(0, courseInfo.chapters[0].lessons[0]);
      }
    }
  }, [courseInfo]);

  const handleLessonClick = async (chapterIndex, lesson) => {
    console.log('Lesson clicked:', JSON.stringify(lesson, null, 2));
    setActiveChapterIndex(chapterIndex);
    setActiveLessonId(lesson.id);

    const fullLessonData = await getLessonData(courseInfo.id, courseInfo.chapters[chapterIndex].id, lesson.id);
    
    if (fullLessonData && fullLessonData.files && fullLessonData.files.length > 0) {
      const videoFile = fullLessonData.files.find(file => file.type.startsWith('video/'));
      if (videoFile) {
        setActiveLesson({...lesson, videoUrl: videoFile.firebaseUrl || videoFile.driveUrl});
      } else {
        setActiveLesson(lesson);
      }
    } else {
      setActiveLesson(lesson);
    }
  };

  const getLessonData = async (courseId, chapterId, lessonId) => {
    try {
      const lessonRef = doc(db, 'courses', courseId, 'chapters', chapterId, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        return lessonSnap.data();
      } else {
        console.error('Không tìm thấy dữ liệu bài học');
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài học:', error);
      return null;
    }
  };

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Nội dung khóa học</h2>
      {courseInfo && courseInfo.chapters && Array.isArray(courseInfo.chapters) ? (
        <div className="space-y-2">
          {courseInfo.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div 
                className='py-2 px-3 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-all'
                onClick={() => setActiveChapterIndex(activeChapterIndex === chapterIndex ? null : chapterIndex)}
              >
                <span className='flex items-center space-x-2'>
                  <span className='h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold'>
                    {chapterIndex + 1}
                  </span>
                  <span className="font-medium text-gray-700">{chapter.title}</span>
                </span>
                {activeChapterIndex === chapterIndex ? '▼' : '▶'}
              </div>
              {activeChapterIndex === chapterIndex && (
                <div className='p-3 bg-white'>
                  {chapter.lessons && Array.isArray(chapter.lessons) && chapter.lessons.map((lesson, lessonIndex) => (
                    <div 
                      key={lesson.id} 
                      className={`flex items-center space-x-3 py-2 px-3 rounded-md cursor-pointer transition-all ${
                        activeLessonId === lesson.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      } ${lesson.isLocked && !isUserAlreadyEnrolled ? 'opacity-50' : ''}`}
                      onClick={() => handleLessonClick(chapterIndex, lesson)}
                    >
                      <span className='h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-semibold'>
                        {lesson.isLocked && !isUserAlreadyEnrolled ? '🔒' : '✓'}
                      </span>
                      <span className="text-sm text-gray-600">{lesson.title}</span>
                      <span className="text-xs text-gray-400 ml-auto">{lesson.duration} phút</span>
                      {watchMode && (
                        <>
                          <span className="text-xs text-gray-400">↓ {lesson.downloads}</span>
                          <span className="text-xs text-gray-400">👁 {lesson.views}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 italic'>Không có nội dung cho khóa học này.</p>
      )}
    </div>
  );
}

export default CourseContentSection