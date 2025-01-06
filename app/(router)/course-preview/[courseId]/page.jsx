"use client";
import { useEffect, useState } from "react";
import { Collapse, Button, List } from "antd";
import {
  PlayCircleOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import CourseEnrollSection from "./_components/CourseEnrollSection";
import Image from "next/image";

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const { user } = useAuth();
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const course = await GlobalApi.getCourseById(params.courseId);
        setCourseInfo(course);
        if (user) {
          const enrolled = await GlobalApi.isUserEnrolled(user.uid, params.courseId);
          setIsUserEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        toast.error("Không thể tải thông tin khóa học");
      }
    };

    fetchCourseInfo();
  }, [params.courseId, user]);

  if (!courseInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>
        <div className="flex-1 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Preview Image */}
            <div className="md:hidden mb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={courseInfo.previewImageUrl || '/default-course-preview.jpg'}
                  alt={courseInfo.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <PlayCircleOutlined className="text-2xl text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Course Info */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <h1 className="text-xl md:text-3xl font-bold mb-2">{courseInfo.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      <span>{courseInfo.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UnorderedListOutlined />
                      <span>{courseInfo.totalLessons} bài học</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <QuestionCircleOutlined />
                      <span>{courseInfo.level}</span>
                    </div>
                  </div>

                  <h2 className="text-lg md:text-2xl font-bold mb-4">Mô tả khoá học</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: courseInfo.description }}
                    className="prose max-w-none text-gray-600 text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Course Preview & Enroll Section */}
              <div className="w-full lg:w-1/3">
                {/* Desktop Preview Image */}
                <div className="hidden md:block mb-6">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl overflow-hidden shadow-lg">
                    <div className="relative aspect-video">
                      <Image
                        src={courseInfo.previewImageUrl || '/default-course-preview.jpg'}
                        alt={courseInfo.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <PlayCircleOutlined className="text-3xl text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enroll Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 md:p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-semibold text-primary">
                        {courseInfo.price > 0
                          ? `${courseInfo.price.toLocaleString('vi-VN')} VND`
                          : "Miễn phí"}
                      </h3>
                    </div>

                    <CourseEnrollSection
                      courseInfo={courseInfo}
                      isUserAlreadyEnrolled={isUserEnrolled}
                    />

                    <div className="mt-6 space-y-4 text-sm md:text-base text-gray-600">
                      <div className="flex items-center gap-3">
                        <QuestionCircleOutlined className="text-lg text-gray-400" />
                        <span>{courseInfo.level}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <UnorderedListOutlined className="text-lg text-gray-400" />
                        <span>Tổng số <strong>{courseInfo.totalLessons}</strong> bài học</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockCircleOutlined className="text-lg text-gray-400" />
                        <span>Thời lượng <strong>{courseInfo.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <LaptopOutlined className="text-lg text-gray-400" />
                        <span>Học mọi lúc, mọi nơi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
