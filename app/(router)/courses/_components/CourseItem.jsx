import Image from 'next/image'
import React from 'react'
import { BookOpen, Clock, Users, Award, TrendingUp } from 'lucide-react'

function CourseItem({course}) {
  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-sm 
      hover:shadow-md transition-all duration-300 h-full flex flex-col group'>
        <div className='relative'>
          {/* Thumbnail with consistent aspect ratio */}
          <div className='relative aspect-video'>
            <Image 
              src={course?.imageUrl && course.imageUrl.startsWith('http') ? course.imageUrl : '/default-course-image.jpg'}
              alt={course.title || 'Course banner'}
              layout="fill"
              objectFit="cover"
              className='transition-transform duration-300 group-hover:scale-105'
            />
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Price tag */}
          <div className="absolute top-3 right-3 bg-white text-primary text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm">
            {course.price > 0 ? `${course.price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}
          </div>

          {/* Level badge */}
          <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{course.level}</span>
          </div>
        </div>

        {/* Content section with consistent spacing */}
        <div className='flex-1 p-4 flex flex-col'>
          <h2 className='font-semibold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
            {course.title}
          </h2>

          {/* Teacher info */}
          <div className='flex items-center gap-2 mb-3'>
            <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'>
              <Users className='w-4 h-4 text-gray-400' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-700'>{course.teacher}</p>
              <p className='text-xs text-gray-500'>Giảng viên</p>
            </div>
          </div>

          {/* Course stats */}
          <div className='grid grid-cols-2 gap-3 mt-auto pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4 text-gray-400' />
              <span className='text-sm text-gray-600'>{course.duration} giờ</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <BookOpen className='w-4 h-4 text-gray-400' />
              <span className='text-sm text-gray-600'>{course.totalLessons || '10+'} bài học</span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CourseItem