import { Lock, Play, ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

function CourseContentSection({ courseInfo, isUserAlreadyEnrolled, watchMode, setActiveChapterIndex }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Nội dung khóa học</h2>
      {courseInfo && courseInfo.chapters && Array.isArray(courseInfo.chapters) ? (
        <div className="space-y-2">
          {courseInfo.chapters.map((chapter, index) => (
            <div key={chapter.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div 
                className='py-2 px-3 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-all'
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className='flex items-center space-x-2'>
                  <span className='h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold'>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-700 text-sm">{chapter.title}</span>
                </span>
                {activeIndex === index ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </div>
              {activeIndex === index && (
                <div className='p-3 bg-white'>
                  {chapter.lessons && Array.isArray(chapter.lessons) && chapter.lessons.map((lesson, lessonIndex) => (
                    <div 
                      key={lesson.id} 
                      className='flex items-center space-x-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-all'
                      onClick={() => watchMode && setActiveChapterIndex(index)}
                    >
                      {watchMode ? (
                        <Play className='h-5 w-5 text-green-500' />
                      ) : (
                        isUserAlreadyEnrolled ? (
                          <Play className='h-5 w-5 text-green-500' />
                        ) : (
                          <Lock className='h-5 w-5 text-gray-400' />
                        )
                      )}
                      <span className="text-sm text-gray-600">{lesson.title}</span>
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