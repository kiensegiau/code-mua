import Image from 'next/image'
import React from 'react'

function CourseItem({course}) {
  return (
    <div className='border rounded-md
    hover:shadow-md 
    hover:shadow-purple-300
    cursor-pointer'>
        <Image 
          src={course?.imageUrl && course.imageUrl.startsWith('http') ? course.imageUrl : '/default-course-image.jpg'}
          width={500}
          height={150}
          alt={course.title || 'Course banner'}
          className='rounded-t-md h-[130px] object-cover'
        />
        <div className='flex flex-col gap-1 p-2'>
            <h2 className='font-medium'>{course.title}</h2>
            <h2 className='text-[12px] text-gray-400'>{course.teacher}</h2>
            <div className='flex gap-2'>
                <Image src='/chapter.png'
                alt='chapter'
                width={20}
                height={20}
                />
                <h2 className='text-[14px] text-gray-400'>{course.duration} giờ</h2>
            </div>
            <h2 className='text-[15px]'>{course.price > 0 ? `${course.price} VND` : 'Miễn phí'}</h2>
            <p className='text-[12px] text-gray-500'>{course.level}</p>
        </div>
    </div>
  )
}

export default CourseItem