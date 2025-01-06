"use client";
import { useEffect, useRef, useState, useCallback } from "react";
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
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [key, setKey] = useState(0);

  const [expandedChapterIndex, setExpandedChapterIndex] = useState(-1);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState({});

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("video"); // 'video' | 'document'
  const [activeMaterial, setActiveMaterial] = useState(null);
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

  useEffect(() => {
    if (courseInfo && courseInfo.chapters && courseInfo.chapters.length > 0) {
      const firstChapter = courseInfo.chapters[0];
      if (firstChapter.lessons && firstChapter.lessons.length > 0) {
        const firstLesson = firstChapter.lessons[0];
        handleLessonClick(firstLesson);
      }
    }
  }, [courseInfo]);

  useEffect(() => {
    if (courseInfo) {
      const savedState = localStorage.getItem(
        `course_${params.courseId}_state`
      );
      if (savedState) {
        const { lessonId, chapterId, videoId, currentTime, fileId } =
          JSON.parse(savedState);

        // Tìm chapter và lesson từ ID đã lưu
        const chapter = courseInfo.chapters.find((c) => c.id === chapterId);
        if (chapter) {
          const lesson = chapter.lessons.find((l) => l._id === lessonId);
          if (lesson) {
            // Tìm file video đang active
            const activeFile = lesson.files.find(
              (f) => f.driveFileId === fileId
            );

            setActiveLesson(lesson);
            setActiveChapter(chapter);
            if (activeFile) {
              setActiveVideo(activeFile);
              setVideoUrl(activeFile.proxyUrl);
            }
            setCurrentTime(currentTime || 0);

            // Mở chapter và lesson
            const chapterIndex = courseInfo.chapters.findIndex(
              (c) => c.id === chapterId
            );
            if (chapterIndex !== -1) {
              setExpandedChapterIndex(chapterIndex);
              setExpandedLessonId(lesson.id);
            }
          }
        }
      }
    }
  }, [courseInfo, params.courseId]);

  useEffect(() => {
    if (activeLesson && activeChapter && activeVideo) {
      const stateToSave = {
        lessonId: activeLesson._id,
        chapterId: activeChapter.id,
        videoId: videoUrl,
        currentTime: currentTime,
        fileId: activeVideo.driveFileId, // Thêm fileId để biết file nào đang active
      };
      localStorage.setItem(
        `course_${params.courseId}_state`,
        JSON.stringify(stateToSave)
      );
    }
  }, [
    activeLesson,
    activeChapter,
    videoUrl,
    currentTime,
    activeVideo,
    params.courseId,
  ]);

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
        // Mở tài liệu trong tab mới
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

  const handleVideoEnd = useCallback(() => {
    console.log("Video ended in page component");
    if (courseContentRef.current) {
      courseContentRef.current.handleVideoEnd();
    }
  }, []);

  // Xử lý cập nhật tiến độ xem video
  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      if (videoUrl && activeVideo) {
        setVideoProgress((prev) => ({
          ...prev,
          [videoUrl]: (time / (activeLesson?.duration || 1)) * 100,
        }));

        // Lưu trạng thái mỗi khi thời gian thay đổi
        if (activeLesson && activeChapter) {
          const stateToSave = {
            lessonId: activeLesson._id,
            chapterId: activeChapter.id,
            videoId: videoUrl,
            currentTime: time,
            fileId: activeVideo.driveFileId,
          };
          localStorage.setItem(
            `course_${params.courseId}_state`,
            JSON.stringify(stateToSave)
          );
        }
      }
    },
    [videoUrl, activeLesson, activeChapter, activeVideo, params.courseId]
  );

  const handleFileClick = (file) => {
    if (file.type?.includes("video")) {
      // Sử dụng activeLesson và activeChapter hiện tại
      if (!activeLesson || !activeChapter) {
        console.warn("Missing activeLesson or activeChapter");
        return;
      }
      handleLessonClick(activeLesson, activeChapter, file);
    } else {
      // Mở PDF hoặc tài liệu khác trong tab mới với URL đầy đủ
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}${file.proxyUrl}`,
        "_blank"
      );
    }
  };

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
    <div className="h-screen grid grid-rows-[auto_1fr] bg-white">
      {/* Header */}
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

      {/* Main content */}
      <main className="grid grid-cols-[1fr_380px] overflow-hidden">
        {/* Left side - Video viewer */}
        <div className="flex flex-col min-w-0">
          {/* Tab switcher */}
          <div className="bg-white border-b">
            <div className="flex space-x-4 px-4">
              <h3 className="py-3 px-4 border-b-2 border-[#f05123] text-[#f05123] font-medium truncate">
                {activeLesson?.title || "Chưa có bài học nào được chọn"}
              </h3>
            </div>
          </div>

          {/* Content viewer */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === "video" && videoUrl ? (
              <div className="absolute inset-0">
                <VideoPlayer
                  key={`${videoUrl}-${key}`}
                  fileId={videoUrl}
                  onEnded={handleVideoEnd}
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay={true}
                  startTime={currentTime}
                />
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

        {/* Right side - Course content */}
        <div className="h-full">
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
      </main>
    </div>
  );
}
