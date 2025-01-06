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
    console.log("=== Click Debug ===");
    console.log("Lesson:", lesson);
    console.log("Chapter:", chapter);
    console.log("File:", file);

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

  const handleVideoEnd = async () => {
    try {
      // Cập nhật tiến độ video hiện tại
      if (activeVideo) {
        setVideoProgress(prev => ({
          ...prev,
          [activeVideo.id]: 100
        }));
      }

      // Tìm video tiếp theo trong cùng bài học
      if (!activeLesson?.files) return;

      // Sắp xếp videos theo thứ tự
      const sortedFiles = activeLesson.files
        .filter(f => f.type?.includes("video"))
        .sort((a, b) => {
          const numA = parseInt(a.name.match(/\d+/) || [0]);
          const numB = parseInt(b.name.match(/\d+/) || [0]);
          return numA - numB;
        });

      const currentVideoIndex = sortedFiles.findIndex(v => v.driveFileId === activeVideo?.driveFileId);
      
      if (currentVideoIndex !== -1 && currentVideoIndex < sortedFiles.length - 1) {
        // Còn video tiếp theo trong bài học hiện tại
        const nextVideo = sortedFiles[currentVideoIndex + 1];
        setActiveVideo(nextVideo);
        setVideoUrl(nextVideo.proxyUrl);
        setKey(prev => prev + 1);
        toast.success('Đang chuyển sang video tiếp theo');
        return;
      }

      // Nếu đã hết video trong bài học hiện tại, tìm bài học tiếp theo
      const sortedLessons = activeChapter.lessons
        .sort((a, b) => {
          const numA = parseInt(a.title.match(/\d+/) || [0]);
          const numB = parseInt(b.title.match(/\d+/) || [0]);
          return numA - numB;
        });

      const currentLessonIndex = sortedLessons.findIndex(l => l.id === activeLesson.id);
      
      if (currentLessonIndex !== -1 && currentLessonIndex < sortedLessons.length - 1) {
        const nextLesson = sortedLessons[currentLessonIndex + 1];
        // Tìm video đầu tiên trong bài học tiếp theo
        const firstVideo = nextLesson.files
          ?.filter(f => f.type?.includes("video"))
          .sort((a, b) => {
            const numA = parseInt(a.name.match(/\d+/) || [0]);
            const numB = parseInt(b.name.match(/\d+/) || [0]);
            return numA - numB;
          })[0];

        if (firstVideo) {
          setActiveLesson(nextLesson);
          setExpandedLessonId(nextLesson.id);
          handleLessonClick(nextLesson, activeChapter, firstVideo);
          toast.success('Đang chuyển sang bài học tiếp theo');
          return;
        }
      }

      // Nếu đã hết bài học trong chương hiện tại, tìm chương tiếp theo
      const sortedChapters = courseInfo.chapters
        .sort((a, b) => {
          const numA = parseInt(a.title.match(/\d+/) || [0]);
          const numB = parseInt(b.title.match(/\d+/) || [0]);
          return numA - numB;
        });

      const currentChapterIndex = sortedChapters.findIndex(c => c.id === activeChapter.id);
      
      if (currentChapterIndex !== -1 && currentChapterIndex < sortedChapters.length - 1) {
        const nextChapter = sortedChapters[currentChapterIndex + 1];
        const firstLesson = nextChapter.lessons
          .sort((a, b) => {
            const numA = parseInt(a.title.match(/\d+/) || [0]);
            const numB = parseInt(b.title.match(/\d+/) || [0]);
            return numA - numB;
          })[0];

        if (firstLesson) {
          const firstVideo = firstLesson.files
            ?.filter(f => f.type?.includes("video"))
            .sort((a, b) => {
              const numA = parseInt(a.name.match(/\d+/) || [0]);
              const numB = parseInt(b.name.match(/\d+/) || [0]);
              return numA - numB;
            })[0];

          if (firstVideo) {
            setActiveChapter(nextChapter);
            setExpandedChapterIndex(currentChapterIndex + 1);
            setActiveLesson(firstLesson);
            setExpandedLessonId(firstLesson.id);
            handleLessonClick(firstLesson, nextChapter, firstVideo);
            toast.success('Đang chuyển sang chương tiếp theo');
            return;
          }
        }
      }

      toast.success('Bạn đã hoàn thành khóa học!');
    } catch (error) {
      console.error("Lỗi khi xử lý kết thúc video:", error);
      toast.error('Có lỗi xảy ra khi chuyển video');
    }
  };

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
    console.log("=== File Click Debug ===");
    console.log("File:", file);
    
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
          <div className="flex items-center justify-between h-[52px]">
            <div className="flex items-center gap-4">
              <Link 
                href="/courses"
                className="flex items-center gap-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Quay lại</span>
              </Link>
              <div className="h-4 w-[1px] bg-gray-800"></div>
              <h1 className="text-sm text-gray-200 truncate max-w-[300px]">
                {courseInfo?.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-400">
                <span className="text-[#ff4d4f] font-medium">
                  {Object.values(videoProgress).filter(p => p === 100).length}
                </span>
                <span className="mx-1">/</span>
                <span>
                  {courseInfo?.chapters?.reduce(
                    (total, chapter) => total + (chapter?.lessons?.length || 0),
                    0
                  ) || 0}
                </span>
                <span className="ml-0.5">bài học</span>
              </div>
              <div className="h-4 w-[1px] bg-gray-800"></div>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-[#ff4d4f] transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex md:grid md:grid-cols-[1fr_380px] overflow-hidden">
        {/* Video Player Section */}
        <div className="flex flex-col min-w-0 h-full">
          <div className="flex-1 relative bg-[#1f1f1f]">
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-gray-400">Vui lòng chọn một bài học để bắt đầu</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="flex-none p-6 border-t border-gray-800 bg-[#1f1f1f]">
            <h1 className="text-xl font-medium text-gray-200">
              {activeLesson?.title || "Chưa có bài học nào được chọn"}
            </h1>
          </div>
        </div>

        {/* Course Content Section */}
        <div className="flex-none w-[380px] bg-[#1f1f1f] border-l border-gray-800">
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
