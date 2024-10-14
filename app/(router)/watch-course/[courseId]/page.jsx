"use client";
import { useEffect, useState, useCallback } from "react";
import { Collapse, List, Spin } from "antd";
import { PlayCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import GlobalApi from "../../../_utils/GlobalApi";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const { Panel } = Collapse;

const VideoPlayer = dynamic(() => import('./components/VideoPlayer'), {
  ssr: false,
});

function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [key, setKey] = useState(0);
  const router = useRouter();

  const fetchCourseInfo = useCallback(async () => {
    try {
      setLoading(true);
      const course = await GlobalApi.getCourseById(params.courseId);
      setCourseInfo(course);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  useEffect(() => {
    fetchCourseInfo();
  }, [fetchCourseInfo]);

  useEffect(() => {
    if (courseInfo && courseInfo.chapters && courseInfo.chapters.length > 0) {
      const firstChapter = courseInfo.chapters[0];
      if (firstChapter.lessons && firstChapter.lessons.length > 0) {
        const firstLesson = firstChapter.lessons[0];
        handleLessonClick(firstLesson);
      }
    }
  }, [courseInfo]);

  const handleLessonClick = useCallback((lesson) => {
    console.log("Bài học được chọn:", lesson);
    setActiveLesson(lesson);
    setIsVideoLoading(true);

    const videoFile = lesson.files?.find(file => file.type === "application/vnd.apple.mpegurl" || file.type === "video/mp4");
    if (videoFile) {
      setVideoUrl(videoFile.r2FileId);
      setKey(prevKey => prevKey + 1); // Tăng key để buộc VideoPlayer re-render
    } else {
      setVideoUrl(null);
      toast.error("Không tìm thấy file video cho bài học này");
    }

    setIsVideoLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    router.push("/sign-in");
    toast.success('Đăng xuất thành công');
  }, [router]);

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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0">
        {/* Nội dung header */}
        <header className="bg-gray-900 text-white py-2 px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/courses"
              className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeftOutlined className="mr-2" />
              <span>Quay lại danh sách khóa học</span>
            </Link>
            <h1 className="text-lg font-bold">
              {courseInfo?.title?.toUpperCase()}
              {courseInfo?.instructor
                ? ` - ${courseInfo.instructor.toUpperCase()}`
                : ""}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                0% | 0/
                {courseInfo?.chapters?.reduce(
                  (total, chapter) => total + (chapter?.lessons?.length || 0),
                  0
                ) || 0}{" "}
                BÀI HỌC
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
      </div>
      
      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Video player */}
        <div className="flex-grow relative">
          {videoUrl ? (
            <VideoPlayer
              key={`${videoUrl}-${key}`}
              fileId={videoUrl}
              onError={(error) => toast.error(error.message)}
              autoPlay={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Vui lòng chọn một bài học để bắt đầu</p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          {/* Nội dung khóa học */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Nội dung khóa học
            </h2>
            <Collapse accordion className="custom-collapse border-0 bg-gray-100">
              {courseInfo.chapters.map((chapter, index) => (
                <Panel
                  key={index}
                  header={
                    <div className="flex justify-between items-center w-full text-gray-800">
                      <span className="font-semibold text-sm">{`${index + 1}. ${chapter.title}`}</span>
                      <span className="text-gray-500 text-xs">
                        {chapter.lessons ? `${chapter.lessons.length} bài học` : "Không có bài học"}
                      </span>
                    </div>
                  }
                  className="mb-1 rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  {chapter.lessons && Array.isArray(chapter.lessons) ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={chapter.lessons}
                      renderItem={(lesson, lessonIndex) => (
                        <List.Item
                          onClick={() => handleLessonClick(lesson)}
                          className="cursor-pointer hover:bg-gray-50 py-2 px-4 transition-colors"
                          style={{ paddingLeft: "15px" }}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <PlayCircleOutlined className="text-orange-500" />
                            <div className="flex justify-between items-center w-full">
                              <span className="text-sm text-gray-700">{`${
                                lessonIndex + 1
                              }. ${lesson.title}`}</span>
                              <span className="text-gray-400 text-xs">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <p className="text-gray-500 p-4">
                      Không có bài học trong chương này.
                    </p>
                  )}
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchCourse;
