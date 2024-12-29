"use client";
import { useEffect, useState, useCallback } from "react";
import { Collapse, List, Spin } from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import GlobalApi from "../../../_utils/GlobalApi";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseContent from "./components/CourseContent";

const { Panel } = Collapse;

const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  ssr: false,
});

export default function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [key, setKey] = useState(0);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("video"); // 'video' | 'document'
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);

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

  const handleLessonClick = (lesson, chapter) => {
    console.log("Lesson clicked:", lesson);
    setActiveLesson(lesson);
    setActiveChapter(chapter);
    // Thêm logic chuyển hướng hoặc xử lý khác nếu cần
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/sign-in");
    toast.success("Đăng xuất thành công");
  }, [router]);

  // Xử lý khi video kết thúc
  const handleVideoEnd = useCallback(() => {
    // Tìm video tiếp theo trong danh sách
    if (activeLesson?.materials) {
      let foundNext = false;
      let nextVideo = null;

      for (const material of activeLesson.materials) {
        if (material.type === "video") {
          for (let i = 0; i < material.files.length; i++) {
            if (foundNext) {
              nextVideo = material.files[i];
              break;
            }
            if (material.files[i].r2FileId === activeVideo?.r2FileId) {
              foundNext = true;
            }
          }
        }
      }

      // Tự động chuyển sang video tiếp theo nếu có
      if (nextVideo) {
        setActiveVideo(nextVideo);
        setIsPlaying(true);
        // Lưu tiến độ video hiện tại
        setVideoProgress((prev) => ({
          ...prev,
          [activeVideo.r2FileId]: 100,
        }));
      }
    }
  }, [activeLesson, activeVideo]);

  // Xử lý cập nhật tiến độ xem video
  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      if (activeVideo) {
        setVideoProgress((prev) => ({
          ...prev,
          [activeVideo.r2FileId]: (time / activeVideo.duration) * 100,
        }));
      }
    },
    [activeVideo]
  );

  // Component hiển thị danh sách video
  const VideoList = () => (
    <div className="space-y-4">
      {activeLesson?.materials?.map((material, index) => {
        if (material.type === "video") {
          return (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium flex justify-between items-center">
                <span>Video {index + 1}</span>
                <span className="text-sm text-gray-500">
                  {material.files.length} video
                </span>
              </div>
              <div className="divide-y">
                {material.files.map((file, fileIndex) => (
                  <button
                    key={fileIndex}
                    onClick={() => {
                      setActiveVideo(file);
                      setIsPlaying(true);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      activeVideo?.r2FileId === file.r2FileId
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {activeVideo?.r2FileId === file.r2FileId ? (
                          <PlayCircleOutlined className="text-blue-500" />
                        ) : videoProgress[file.r2FileId] === 100 ? (
                          <CheckOutlined className="text-green-500" />
                        ) : (
                          <PlayCircleOutlined className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{file.title}</div>
                        <div className="text-sm text-gray-500">
                          {file.duration}
                        </div>
                      </div>
                      {videoProgress[file.r2FileId] > 0 &&
                        videoProgress[file.r2FileId] < 100 && (
                          <div className="flex-shrink-0 w-12 text-xs text-gray-500">
                            {Math.round(videoProgress[file.r2FileId])}%
                          </div>
                        )}
                    </div>
                    {/* Progress bar */}
                    {videoProgress[file.r2FileId] > 0 && (
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            videoProgress[file.r2FileId] === 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${videoProgress[file.r2FileId]}%` }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!courseInfo) {
    return (
      <div className="text-center py-10 bg-white text-gray-800">
        Bài giảng đang được cập nhật, vui lòng quay lại sau
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0">
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

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Content viewer */}
        <div className="flex-grow flex flex-col">
          {/* Tab switcher */}
          <div className="bg-white border-b">
            <div className="flex space-x-4 px-4">
              <button
                onClick={() => setActiveTab("video")}
                className={`py-3 px-4 border-b-2 font-medium ${
                  activeTab === "video"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Video bài giảng
              </button>
              <button
                onClick={() => setActiveTab("document")}
                className={`py-3 px-4 border-b-2 font-medium ${
                  activeTab === "document"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Tài liệu học tập
              </button>
            </div>
          </div>

          {/* Content viewer */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "video" && videoUrl ? (
              <div className="relative h-full">
                <VideoPlayer
                  key={`${videoUrl}-${key}`}
                  fileId={videoUrl}
                  onEnded={handleVideoEnd}
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay={isPlaying}
                  startTime={videoProgress[videoUrl] || 0}
                />
                {/* Video controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    {activeVideo && (
                      <>
                        <h3 className="font-medium">{activeVideo.title}</h3>
                        <div className="text-sm opacity-75">
                          {Math.floor(currentTime / 60)}:
                          {String(Math.floor(currentTime % 60)).padStart(
                            2,
                            "0"
                          )}{" "}
                          /{activeVideo.duration}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Vui lòng chọn {activeTab === "video" ? "video" : "tài liệu"}{" "}
                  để xem
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Thay thế CourseSidebar bằng CourseContent */}
        <CourseContent
          chapters={courseInfo?.chapters || []}
          activeLesson={activeLesson}
          activeChapter={activeChapter}
          onLessonClick={handleLessonClick}
        />
      </div>
    </div>
  );
}
