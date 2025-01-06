import Image from 'next/image'
import React from 'react'

function CourseItem({course}) {
  return (
    <div className='border rounded-lg
    hover:shadow-md 
    hover:shadow-purple-300
    transition-all duration-300
    h-full bg-white'>
        <Image 
          src={course?.imageUrl && course.imageUrl.startsWith('http') ? course.imageUrl : '/default-course-image.jpg'}
          width={500}
          height={150}
          alt={course.title || 'Course banner'}
          className='rounded-t-lg w-full h-[120px] sm:h-[130px] object-cover'
        />
        <div className='flex flex-col gap-1.5 p-3'>
            <h2 className='font-medium text-sm sm:text-base line-clamp-2'>{course.title}</h2>
            <h2 className='text-[11px] sm:text-xs text-gray-400'>{course.teacher}</h2>
            <div className='flex items-center gap-1.5'>
                <Image src='/chapter.png'
                alt='chapter'
                width={16}
                height={16}
                className='w-4 h-4'
                />
                <h2 className='text-xs sm:text-sm text-gray-400'>{course.duration} giờ</h2>
            </div>
            <h2 className='text-sm sm:text-[15px] font-medium text-primary'>{course.price > 0 ? `${course.price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}</h2>
            <p className='text-[11px] sm:text-xs text-gray-500'>{course.level}</p>
        </div>
    </div>
  )
}

export default CourseItem