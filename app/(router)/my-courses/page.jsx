"use client";
import { useEffect, useState } from "react";
import { useAuth } from '@/app/_context/AuthContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import Header from "../_components/Header";
import Sidebar from "../_components/SideNav";
import { toast } from "sonner";
import Link from "next/link";
import { BookOpen, Clock, Search } from 'lucide-react';
import Image from "next/image";

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const courses = await GlobalApi.getEnrolledCourses(user.uid);
          setEnrolledCourses(courses);
          toast.success('Đã tải danh sách khóa học');
        } catch (error) {
          console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
          toast.error('Không thể tải danh sách khóa học');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const filteredCourses = enrolledCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>
        <div className="flex-1 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Khóa học của tôi</h1>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-[300px] rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="h-40 bg-gray-200 animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredCourses.map((course) => (
                  <Link href={`/watch-course/${course.id}`} key={course.id} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={course.thumbnailUrl || '/placeholder-image.jpg'}
                          alt={course.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.totalLessons} bài học</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Image
                    src="/empty-courses.png"
                    alt="No courses"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Không tìm thấy khóa học nào phù hợp'
                    : 'Bạn chưa đăng ký khóa học nào'}
                </h3>
                <Link href="/courses">
                  <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm md:text-base">
                    Khám phá khóa học
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCourses;