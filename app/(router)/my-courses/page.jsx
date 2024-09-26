"use client";
import { useEffect, useState } from "react";
import { useAuth } from '@/app/_context/AuthContext';
import GlobalApi from '@/app/_utils/GlobalApi';
import Header from "../_components/Header";
import Sidebar from "../_components/SideNav";
import { Card, Spin, Empty, Skeleton, message } from "antd";
import Link from "next/link";
import { BookOpen, Clock } from 'lucide-react';

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user && user.uid) {
        try {
          setLoading(true);
          const courses = await GlobalApi.getEnrolledCourses(user.uid);
          setEnrolledCourses(courses);
          message.success('Đã tải danh sách khóa học thành công');
        } catch (error) {
          console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
          message.error('Không thể tải danh sách khóa học');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Khóa học của tôi</h1>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="w-full">
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Card>
              ))}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Link href={`/watch-course/${course.id}`} key={course.id}>
                  <Card
                    hoverable
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                    cover={
                      <div className="h-48 overflow-hidden">
                        <img 
                          alt={course.title} 
                          src={course.thumbnailUrl || '/placeholder-image.jpg'} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<span className="text-lg font-semibold text-gray-800">{course.title}</span>}
                      description={
                        <div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <BookOpen size={16} className="mr-1" />
                            <span className="mr-3">{course.totalLessons} bài học</span>
                            <Clock size={16} className="mr-1" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-600">Bạn chưa đăng ký khóa học nào</span>
              }
            >
              <Link href="/courses">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Khám phá khóa học
                </button>
              </Link>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;