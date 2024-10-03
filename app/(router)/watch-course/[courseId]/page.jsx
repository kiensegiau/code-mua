"use client";
import { useEffect, useState } from "react";
import { Collapse, List, Spin } from "antd";
import { PlayCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import GlobalApi from "../../../_utils/GlobalApi";
import CourseVideoPlayer from './components/CourseVideoPlayer';
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Thêm import này

const { Panel } = Collapse;

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const router = useRouter(); // Thêm hook useRouter

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        setLoading(true);
        const course = await GlobalApi.getCourseById(params.courseId);
        setCourseInfo(course);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khóa học:", error);
        toast.error("Không thể tải thông tin khóa học");
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [params.courseId]);

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    setIsVideoLoading(true);
    if (lesson.files && lesson.files.length > 0) {
      const videoFile = lesson.files.find(file => file.type === "video/mp4");
      if (videoFile) {
        setVideoUrl(videoFile.firebaseUrl);
      } else {
        setVideoUrl(null);
      }
    } else {
      setVideoUrl(null);
    }
    setIsVideoLoading(false);
  };

  const handleLogout = () => {
    // Thực hiện các bước đăng xuất ở đây
    // Ví dụ: xóa token từ localStorage
    localStorage.removeItem('token');
    // Chuyển hướng người dùng về trang đăng nhập
    router.push("/sign-in");
    // Hiển thị thông báo đăng xuất thành công
    toast.success('Đăng xuất thành công');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!courseInfo) {
    return <div className="text-center py-10 bg-white text-gray-800">Bài giảng đang được cập nhật, vui lòng quay lại sau</div>;
  }

  return (
    <div className="flex flex-col min-h-screen h-screen bg-white">
      <header className="bg-gray-900 text-white py-2 px-4">
        <div className="flex items-center justify-between">
          <Link href="/courses" className="flex items-center text-orange-500 hover:text-orange-600 transition-colors">
            <ArrowLeftOutlined className="mr-2" />
            <span>Quay lại danh sách khóa học</span>
          </Link>
          <h1 className="text-lg font-bold">
            {courseInfo?.title?.toUpperCase()}{courseInfo?.instructor ? ` - ${courseInfo.instructor.toUpperCase()}` : ''}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              0% | 0/{courseInfo?.chapters?.reduce((total, chapter) => total + (chapter?.lessons?.length || 0), 0) || 0} BÀI HỌC
            </span>
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              onClick={handleLogout}
            >
              ĐĂNG XUẤT
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white overflow-hidden">
        <div className="h-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="flex h-full">
            <div className="w-3/4 bg-white h-full">
              <div className="relative w-full h-full">
                <CourseVideoPlayer 
                  lesson={activeLesson} 
                  videoUrl={videoUrl} 
                  isLoading={isVideoLoading}
                />
              </div>
            </div>
            <div className="w-1/4 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Nội dung khóa học</h2>
                <Collapse accordion className="border-0 bg-gray-100">
                  {courseInfo.chapters.map((chapter, index) => (
                    <Panel
                      key={index}
                      header={
                        <div className="flex justify-between items-center text-gray-800">
                          <span className="font-semibold">{`${index + 1}. ${chapter.title}`}</span>
                          <span className="text-gray-500 text-sm">{chapter.lessons ? `${chapter.lessons.length} bài học` : 'Không có bài học'}</span>
                        </div>
                      }
                      className="mb-2 rounded-lg overflow-hidden border border-gray-200 bg-white"
                    >
                      {chapter.lessons && Array.isArray(chapter.lessons) ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={chapter.lessons}
                          renderItem={(lesson, lessonIndex) => (
                            <List.Item
                              onClick={() => handleLessonClick(lesson)}
                              className="cursor-pointer hover:bg-gray-50 py-2 px-4 transition-colors"
                              style={{ paddingLeft: '15px' }}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <PlayCircleOutlined className="text-orange-500" />
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-sm text-gray-700">{`${lessonIndex + 1}. ${lesson.title}`}</span>
                                  <span className="text-gray-400 text-xs">{lesson.duration}</span>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <p className="text-gray-500 p-4">Không có bài học trong chương này.</p>
                      )}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WatchCourse;
