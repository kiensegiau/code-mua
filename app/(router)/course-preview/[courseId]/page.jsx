"use client";
import { useEffect, useState } from "react";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  GraduationCap,
  Users,
  Target,
  Laptop,
  CheckCircle,
  Star,
  Share2,
  ChevronRight
} from 'lucide-react';
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import CourseEnrollSection from "./_components/CourseEnrollSection";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const { user } = useAuth();
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[#ff4d4f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Thông tin' },
    { id: 'curriculum', label: 'Nội dung' },
    { id: 'reviews', label: 'Đánh giá' }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#141414]">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Course Preview Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-6 border border-gray-800">
                  <Image
                    src={courseInfo.previewImageUrl || '/default-course-preview.jpg'}
                    alt={courseInfo.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#ff4d4f]/10 transition-colors">
                      <PlayCircle className="w-8 h-8 text-[#ff4d4f]" />
                    </div>
                  </div>
                </div>

                {/* Course Title & Stats */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-200 mb-4">{courseInfo.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Mức độ: {courseInfo.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Thời lượng: {courseInfo.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Số lượng: {courseInfo.totalLessons} video</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Lượt xem: {courseInfo.enrollments || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
                  <div className="flex border-b border-gray-800">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          py-2 px-6 font-medium text-sm transition-colors relative
                          ${activeTab === tab.id 
                            ? 'text-[#ff4d4f] bg-[#ff4d4f]/10' 
                            : 'text-gray-400 hover:text-gray-200'
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-lg font-bold text-gray-200 mb-4">Mô tả</h2>
                        <div
                          dangerouslySetInnerHTML={{ __html: courseInfo.description }}
                          className="text-gray-400 mb-8"
                        />

                        <h2 className="text-lg font-bold text-gray-200 mb-4">Công nghệ sử dụng</h2>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {courseInfo.technologies?.map((tech, index) => (
                            <span key={index} className="px-3 py-1 bg-[#ff4d4f]/10 text-[#ff4d4f] rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-lg font-bold text-gray-200 mb-4">Yêu cầu</h2>
                        <div className="space-y-2">
                          {courseInfo.requirements?.map((req, index) => (
                            <div key={index} className="flex items-start gap-2 text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d4f] mt-2" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>

                        <h2 className="text-lg font-bold text-gray-200 mt-8 mb-4">Lợi ích</h2>
                        <div className="space-y-2">
                          {courseInfo.learningObjectives?.map((objective, index) => (
                            <div key={index} className="flex items-start gap-2 text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d4f] mt-2" />
                              <span>{objective}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 lg:sticky lg:top-[80px] h-fit">
                <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
                  <div className="p-6">
                    <CourseEnrollSection
                      courseInfo={courseInfo}
                      isUserAlreadyEnrolled={isUserEnrolled}
                    />

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Truy cập trọn đời</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Giáo trình chi tiết</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Bài tập thực hành</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Chứng chỉ hoàn thành</span>
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
