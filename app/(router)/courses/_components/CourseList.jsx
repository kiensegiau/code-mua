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
import { logToServer } from '@/app/_utils/logger';
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
      logToServer('Bắt đầu lấy danh sách khóa học');
      const courses = await GlobalApi.getAllCourseList();
      console.log(courses);
      logToServer('Đã nhận được danh sách khóa học', { courseCount: courses.length });
      setCourseList(courses);
      logToServer('Đã cập nhật state courseList');
    } catch (error) {
      logToServer('Lỗi khi lấy danh sách khóa học', { error: error.message });
      console.error("Lỗi khi lấy danh sách khóa học:", error);
    } finally {
      setLoading(false);
      logToServer('Đã kết thúc quá trình lấy danh sách khóa học');
    }
  };

  const filteredCourses = courseList.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'paid') return course.price > 0;
    if (filter === 'free') return course.price === 0;
    return true;
  });

  return (
    <div className='p-5 bg-white rounded-lg mt-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-[20px] font-bold text-primary'>Tất cả khóa học</h2>
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="paid">Trả phí</SelectItem>
            <SelectItem value="free">Miễn phí</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
        {loading ? (
          [1,2,3,4,5,6].map((item, index) => (
            <div key={index} className='w-full h-[240px] rounded-xl m-2 bg-slate-200 animate-pulse'></div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Link href={`/course-preview/${course.id}`} key={course.id}>
              <div>
                <CourseItem course={course} />
              </div>
            </Link>
          ))
        ) : (
          <p>Không có khóa học nào.</p>
        )}
      </div>
    </div>
  )
}

export default CourseList