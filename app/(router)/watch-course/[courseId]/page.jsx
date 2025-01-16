"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Collapse, List, Spin } from "antd";
import {
  PlayCircle,
  ArrowLeft,
  FileText,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Video,
  File,
  ArrowLeftCircle,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "../../../_utils/GlobalApi";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseContent from "./components/CourseContent";

const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  ssr: false,
});

export default function WatchCourse({ params }) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);

  const [expandedChapterIndex, setExpandedChapterIndex] = useState(-1);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState({});

  const router = useRouter();
  const courseContentRef = useRef();

  const handleVideoEnd = useCallback(() => {
    if (courseContentRef.current) {
      courseContentRef.current.handleVideoEnd();
    }
  }, []);

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

  const handleLessonClick = (lesson, chapter, file) => {
    setActiveLesson(lesson);
    setActiveChapter(chapter);

    if (file) {
      if (file.type.includes("video")) {
        setVideoUrl(file.proxyUrl);
        setActiveVideo(file);
        setIsPlaying(true);
        setKey((prev) => prev + 1);
      } else {
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}${file.proxyUrl}`,
          "_blank"
        );
      }
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/sign-in");
    toast.success("Đăng xuất thành công");
  }, [router]);

  // Xử lý cập nhật tiến độ xem video
  const handleTimeUpdate = useCallback(
    (time) => {
      if (videoUrl && activeVideo) {
        setVideoProgress((prev) => ({
          ...prev,
          [activeVideo.id]: (time / (activeVideo?.duration || 1)) * 100,
        }));
      }
    },
    [videoUrl, activeVideo]
  );

  const handleFileClick = (file) => {
    if (file.type?.includes("video")) {
      if (!activeLesson || !activeChapter) {
        console.warn("Missing activeLesson or activeChapter");
        return;
      }
      handleLessonClick(activeLesson, activeChapter, file);
    } else {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}${file.proxyUrl}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[#ff4d4f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#141414] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1f1f1f] border-b border-gray-800 flex-none">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center h-[52px]">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                href="/courses"
                className="flex items-center gap-2 text-gray-300 hover:text-[#ff4d4f] transition-colors flex-shrink-0 bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden xs:block font-medium">
                  Quay lại
                </span>
              </Link>

              <div className="h-4 w-[1px] bg-gray-800 hidden xs:block flex-shrink-0"></div>

              <div className="flex-1 min-w-0">
                <div className="hidden xs:block text-[11px] uppercase tracking-wider text-[#ff4d4f] font-medium mb-0.5">
                  Đang học
                </div>
                <h1 className="text-sm text-gray-100 truncate pr-4 font-medium">
                  {courseInfo?.title || "Đang tải..."}
                </h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="text-xs bg-gray-800/50 px-3 py-1.5 rounded-full hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[#ff4d4f] font-medium">
                    {
                      Object.values(videoProgress).filter((p) => p === 100)
                        .length
                    }
                  </span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-300">
                    {courseInfo?.chapters?.reduce(
                      (total, chapter) =>
                        total + (chapter?.lessons?.length || 0),
                      0
                    ) || 0}
                  </span>
                </div>
                <span className="text-gray-400">bài học</span>
              </div>

              <button
                onClick={handleLogout}
                className="text-white hover:text-white transition-colors whitespace-nowrap bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 px-3 py-1.5 rounded-full font-medium flex items-center gap-2 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:grid md:grid-cols-[1fr_380px] flex flex-col min-h-0 overflow-hidden">
        {/* Video Player Section */}
        <div className="flex-none md:flex md:flex-col md:h-full overflow-hidden">
          <div className="w-full aspect-video bg-[#1f1f1f] relative">
            {videoUrl ? (
              <VideoPlayer
                key={key}
                fileId={videoUrl}
                isPlaying={isPlaying}
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                autoPlay={true}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">
                  Vui lòng chọn một bài học để bắt đầu
                </p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="flex-none p-3 md:p-6 border-t border-gray-800 bg-[#1f1f1f]">
            <h1 className="text-sm md:text-xl font-medium text-gray-200">
              {activeLesson?.title || "Chưa có bài học nào được chọn"}
            </h1>
          </div>
        </div>

        {/* Course Content Section */}
        <div className="flex-1 md:flex-none md:w-[380px] bg-[#1f1f1f] border-t md:border-t-0 md:border-l border-gray-800 h-[calc(100vh-52px)]">
          <CourseContent
            ref={courseContentRef}
            chapters={courseInfo?.chapters || []}
            activeLesson={activeLesson}
            activeChapter={activeChapter}
            onLessonClick={handleLessonClick}
            expandedChapterIndex={expandedChapterIndex}
            setExpandedChapterIndex={setExpandedChapterIndex}
            expandedLessonId={expandedLessonId}
            setExpandedLessonId={setExpandedLessonId}
            videoProgress={videoProgress}
            activeVideo={activeVideo}
          />
        </div>
      </div>
    </div>
  );
}
