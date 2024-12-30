import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CourseItem from './CourseItem';
import Link from 'next/link';
import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllCourses();
    
  }, []);

  const getAllCourses = async () => {
    try {
      const courses = await GlobalApi.getAllCourseList();
      console.log(courses);
      setCourseList(courses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courseList.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'paid') return course.price > 0;
    if (filter === 'free') return course.price === 0;
    return true;
  });

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between p-5 bg-white rounded-t-lg'>
        <h2 className='text-[20px] font-bold text-primary'>Tất cả khóa học</h2>
        
      </div>
      <div className='flex-1 overflow-auto p-5 bg-white rounded-b-lg'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {loading ? (
            [1,2,3,4,5,6].map((item, index) => (
              <div key={index} className='w-full h-[240px] rounded-xl m-2 bg-slate-200 animate-pulse'></div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Link href={`/course-preview/${course.id}`} key={course.id} className='h-full'>
                <div className='h-full'>
                  <CourseItem course={course} />
                </div>
              </Link>
            ))
          ) : (
            <p>Không có khóa học nào.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseList