import React, { useEffect, useState } from 'react'
import GlobalApi from '@/app/_utils/GlobalApi'
import CourseItem from './CourseItem'
import { Search, Filter, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function CourseList() {
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')

  useEffect(() => {
    getAllCourseList()
  }, [])

  const getAllCourseList = async () => {
    try {
      setLoading(true)
      const resp = await GlobalApi.getAllCourseList()
      
      // Xử lý response trực tiếp vì API trả về mảng
      const coursesWithDefaults = (Array.isArray(resp) ? resp : []).map(course => ({
        ...course,
        price: course.price || 0,
        level: course.level || 'Cơ bản',
        duration: course.duration || '0',
        totalLessons: course.totalLessons || 0,
        teacher: course.teacher || 'Giảng viên'
      }))

      setCourseList(coursesWithDefaults)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courseList.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesPrice = selectedPrice === 'all' 
      || (selectedPrice === 'free' && course.price === 0)
      || (selectedPrice === 'paid' && course.price > 0)
    
    return matchesSearch && matchesLevel && matchesPrice
  })

  const levels = ['Cơ bản', 'Trung bình', 'Nâng cao']

  return (
    <div>
      {/* Search and Filter Section */}
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        {/* Search Bar */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <input
            type='text'
            placeholder='Tìm kiếm khóa học...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-2'>
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className='px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white'
          >
            <option value='all'>Tất cả trình độ</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className='px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white'
          >
            <option value='all'>Tất cả giá</option>
            <option value='free'>Miễn phí</option>
            <option value='paid'>Có phí</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
          {[...Array(8)].map((_, index) => (
            <div key={index} className='bg-white rounded-xl overflow-hidden shadow-sm'>
              <div className='aspect-video bg-gray-200 animate-pulse' />
              <div className='p-4'>
                <div className='h-5 bg-gray-200 rounded animate-pulse mb-3' />
                <div className='h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-3' />
                <div className='flex justify-between mt-4'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-1/4' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-1/4' />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
          {filteredCourses.map((course, index) => (
            <Link href={`/course-preview/${course.id}`} key={index} className="block">
              <CourseItem course={course} />
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='mb-4'>
            <Image
              src='/empty-courses.png'
              alt='No courses'
              width={200}
              height={200}
              className='mx-auto'
            />
          </div>
          <h3 className='text-gray-600 mb-2'>
            {searchQuery 
              ? 'Không tìm thấy khóa học nào phù hợp'
              : 'Chưa có khóa học nào'}
          </h3>
          <p className='text-sm text-gray-500'>
            Vui lòng thử tìm kiếm với từ khóa khác
          </p>
        </div>
      )}
    </div>
  )
}

export default CourseList