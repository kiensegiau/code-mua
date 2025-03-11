"use client";
import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
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
import { useVideoNavigation } from "./hooks/useVideoNavigation";

// Lazy load VideoPlayer để tối ưu hiệu năng
const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-2 border-[#ff4d4f] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

// Aspect ratio và video height
const aspectRatio = 9 / 16;
const videoHeight = `${100 * aspectRatio}vw`;

// Component Loading
const LoadingScreen = memo(() => (
  <div className="min-h-screen bg-[#141414] flex items-center justify-center">
    <div className="animate-spin w-6 h-6 border-2 border-[#ff4d4f] border-t-transparent rounded-full"></div>
  </div>
));

LoadingScreen.displayName = "LoadingScreen";

// Component Header
const Header = memo(({ courseInfo, videoProgress, handleLogout }) => (
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
                {Object.values(videoProgress).filter((p) => p === 100).length}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-300">
                {courseInfo?.chapters?.reduce(
                  (total, chapter) => total + (chapter?.lessons?.length || 0),
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
));

Header.displayName = "Header";

// Component VideoSection
const VideoSection = memo(
  ({
    activeVideo,
    activeLesson,
    handleVideoEnd,
    handleTimeUpdate,
    handleNext,
    handlePrevious,
    key,
  }) => (
    <div className="flex-none md:flex md:flex-col md:h-[calc(100vh-52px)] overflow-hidden">
      {/* Video container */}
      <div
        className="w-full bg-[#1f1f1f] relative"
        style={{ height: "var(--video-height)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {activeVideo ? (
            <VideoPlayer
              key={key}
              file={activeVideo}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
              autoPlay={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-gray-400">
                Vui lòng chọn một bài học để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="flex-none p-3 md:p-4 border-t border-gray-800 bg-[#1f1f1f]">
        <h1 className="text-sm md:text-lg font-medium text-gray-200 line-clamp-2">
          {activeLesson ? (
            <>
              {activeLesson.title}
              {activeVideo && (
                <>
                  <span className="mx-2 text-gray-400">|</span>
                  {activeVideo.name}
                </>
              )}
            </>
          ) : (
            "Chưa có bài học nào được chọn"
          )}
        </h1>
      </div>
    </div>
  )
);

VideoSection.displayName = "VideoSection";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();
  const courseContentRef = useRef();

  // Helper functions
  const getNumberFromTitle = useCallback((text = "") => {
    const match = text.match(/(?:^|\.)?\s*(\d+)/);
    return match ? parseInt(match[1]) : 999999;
  }, []);

  const sortFiles = useCallback(
    (a, b) => {
      const numA = getNumberFromTitle(a.name);
      const numB = getNumberFromTitle(b.name);
      return numA - numB;
    },
    [getNumberFromTitle]
  );

  // Handler functions
  const handleLessonClick = useCallback((lesson, chapter, file) => {
    // Đánh dấu rõ ràng việc cập nhật các trạng thái
    console.log("Người dùng click vào bài học:", lesson?.title);

    if (lesson) setActiveLesson(lesson);
    if (chapter) setActiveChapter(chapter);

    if (file) {
      console.log("File được chọn:", {
        name: file.name,
        id: file.id,
        type: file.type,
      });

      if (file.type.includes("video")) {
        setActiveVideo(file);
        setIsPlaying(true);
        setKey((prev) => prev + 1);
      } else {
        if (file.driveFileId) {
          const driveViewUrl = `https://drive.google.com/file/d/${file.driveFileId}/view`;
          window.open(driveViewUrl, "_blank");
        } else {
          toast.error("Không thể mở file này. Vui lòng liên hệ quản trị viên.");
        }
      }
    }
  }, []);

  const { handleNext, handlePrevious } = useVideoNavigation({
    activeLesson,
    activeChapter,
    activeVideo,
    courseInfo,
    setExpandedLessonId,
    setExpandedChapterIndex,
    handleLessonClick,
    setActiveVideo,
  });

  const handleVideoEnd = useCallback(() => {
    console.log("Video ended, navigating to next video");
    handleNext();
  }, [handleNext]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/sign-in");
    toast.success("Đăng xuất thành công");
  }, [router]);

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

  const handleFileClick = useCallback(
    (file) => {
      if (file.type?.includes("video")) {
        if (!activeLesson || !activeChapter) {
          console.warn("Missing activeLesson or activeChapter");
          return;
        }
        handleLessonClick(activeLesson, activeChapter, file);
      } else {
        // Xử lý file ngoài video (tài liệu, PDF, v.v.)
        // Chỉ sử dụng driveFileId để mở trực tiếp từ Google Drive
        if (file.driveFileId) {
          const driveViewUrl = `https://drive.google.com/file/d/${file.driveFileId}/view`;
          console.log("Mở file từ Google Drive:", driveViewUrl);
          window.open(driveViewUrl, "_blank");
        } else {
          // Thông báo lỗi nếu không có driveFileId
          toast.error("Không thể mở file này. Vui lòng liên hệ quản trị viên.");
        }
      }
    },
    [activeLesson, activeChapter, handleLessonClick]
  );

  // API và tương tác dữ liệu
  const fetchCourseInfo = useCallback(async () => {
    try {
      setLoading(true);
      const course = await GlobalApi.getCourseById(params.courseId);
      setCourseInfo(course);
      return course;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      toast.error("Không thể tải thông tin khóa học");
      return null;
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  // Restore last watched video
  const restoreLastWatchedVideo = useCallback(
    (course) => {
      if (!course || !course.chapters) return false;

      try {
        // Đọc dữ liệu từ cả hai nguồn
        const lastWatchedVideoId = localStorage.getItem("lastWatchedVideoId");
        const courseStateStr = localStorage.getItem("courseState");
        let courseState = null;

        // Ưu tiên sử dụng courseState vì nó chứa thông tin đầy đủ hơn
        if (courseStateStr) {
          try {
            courseState = JSON.parse(courseStateStr);
            // Kiểm tra xem courseState có thuộc khóa học hiện tại không
            if (courseState.courseId !== params.courseId) {
              courseState = null;
            }
          } catch (e) {
            console.error("Lỗi khi phân tích courseState:", e);
          }
        }

        // Sử dụng ID video từ courseState hoặc lastWatchedVideoId
        const videoId = courseState?.videoId || lastWatchedVideoId;

        if (!videoId) {
          console.log("Không tìm thấy ID video để khôi phục");
          return false;
        }

        console.log("Đang cố gắng khôi phục video đã xem:", videoId);

        // Tìm chương từ courseState nếu có
        let targetChapter = null;
        let targetLesson = null;

        if (courseState?.chapterId && courseState?.lessonId) {
          targetChapter = course.chapters.find(
            (c) => c.id === courseState.chapterId
          );
          if (targetChapter) {
            targetLesson = targetChapter.lessons?.find(
              (l) => l.id === courseState.lessonId
            );
          }
        }

        // Tìm video trong cấu trúc khóa học
        let foundVideo = null;
        let foundLesson = null;
        let foundChapter = null;

        // Nếu đã có target chapter và lesson, tìm video trong đó trước
        if (targetChapter && targetLesson) {
          foundVideo = (targetLesson.files || []).find(
            (file) => file.id === videoId && file.type?.includes("video")
          );

          if (foundVideo) {
            foundLesson = targetLesson;
            foundChapter = targetChapter;
          }
        }

        // Nếu không tìm thấy, tìm kiếm trong toàn bộ khóa học
        if (!foundVideo) {
          for (const chapter of course.chapters) {
            for (const lesson of chapter.lessons || []) {
              const videoFile = (lesson.files || []).find(
                (file) => file.id === videoId && file.type?.includes("video")
              );

              if (videoFile) {
                foundVideo = videoFile;
                foundLesson = lesson;
                foundChapter = chapter;
                break;
              }
            }
            if (foundVideo) break;
          }
        }

        if (foundVideo && foundLesson && foundChapter) {
          console.log("Đã tìm thấy video đã xem:", foundVideo.name);

          // Khôi phục trạng thái UI
          const chapterIndex = course.chapters.indexOf(foundChapter);
          setExpandedChapterIndex(chapterIndex);
          setExpandedLessonId(foundLesson.id);

          // Khôi phục các mục đang hoạt động
          setActiveChapter(foundChapter);
          setActiveLesson(foundLesson);
          setActiveVideo(foundVideo);
          setKey(Date.now()); // Sử dụng timestamp để đảm bảo key luôn mới

          console.log("Đã khôi phục trạng thái video thành công");
          return true;
        } else {
          console.log("Không tìm thấy video với ID:", videoId);
        }
      } catch (error) {
        console.error("Lỗi khi khôi phục video đã xem cuối cùng:", error);
      }

      return false;
    },
    [params.courseId]
  );

  // Khôi phục trạng thái xem video khi component mount
  useEffect(() => {
    if (courseInfo?.id) {
      const restoreVideoState = () => {
        try {
          // Chỉ khôi phục nếu chưa có video hiện tại
          if (activeVideo) {
            return;
          }

          // Lấy trạng thái đã lưu
          const savedStateJSON = localStorage.getItem(
            `last_watched_${courseInfo.id}`
          );
          if (!savedStateJSON) return;

          const savedState = JSON.parse(savedStateJSON);
          if (!savedState || !savedState.videoId) return;

          console.log("Phục hồi trạng thái video đang xem:", savedState);

          // Đảm bảo các trạng thái UI được đồng bộ hóa
          if (savedState.chapterId) {
            const chapters = courseInfo.chapters || [];
            const chapterIndex = chapters.findIndex(
              (c) => c.id === savedState.chapterId
            );
            if (chapterIndex !== -1) {
              console.log("Đặt expanded chapter index thành:", chapterIndex);
              // Giảm thời gian của timeout
              setTimeout(() => {
                setExpandedChapterIndex(chapterIndex);
              }, 100);
            }
          }

          if (savedState.lessonId) {
            console.log("Đặt expanded lesson ID thành:", savedState.lessonId);
            // Giảm thời gian của timeout
            setTimeout(() => {
              setExpandedLessonId(savedState.lessonId);
            }, 150);
          }
        } catch (error) {
          console.error("Lỗi khi khôi phục trạng thái:", error);
        }
      };

      // Gọi hàm sau khi component đã render, với thời gian ngắn hơn
      setTimeout(restoreVideoState, 300);
    }
  }, [courseInfo, activeVideo]);

  // Effects
  useEffect(() => {
    async function initialize() {
      console.log("Đang khởi tạo trang khóa học...");
      const course = await fetchCourseInfo();
      if (course) {
        console.log("Đã tải thông tin khóa học, đang khôi phục video...");
        // Cố gắng khôi phục video đã xem cuối cùng
        const restored = restoreLastWatchedVideo(course);

        // Nếu không khôi phục được, cố gắng tải video đầu tiên
        if (!restored && course.chapters && course.chapters.length > 0) {
          console.log("Không thể khôi phục video, đang tải video đầu tiên...");
          const firstChapter = [...course.chapters].sort((a, b) => {
            const numA = getNumberFromTitle(a.title);
            const numB = getNumberFromTitle(b.title);
            return numA - numB;
          })[0];

          if (
            firstChapter &&
            firstChapter.lessons &&
            firstChapter.lessons.length > 0
          ) {
            const firstLesson = [...firstChapter.lessons].sort((a, b) => {
              const numA = getNumberFromTitle(a.title);
              const numB = getNumberFromTitle(b.title);
              return numA - numB;
            })[0];

            if (
              firstLesson &&
              firstLesson.files &&
              firstLesson.files.length > 0
            ) {
              const firstVideo = firstLesson.files
                .filter((f) => f.type?.includes("video"))
                .sort(sortFiles)[0];

              if (firstVideo) {
                console.log("Đã tìm thấy video đầu tiên:", firstVideo.name);
                setExpandedChapterIndex(0);
                setExpandedLessonId(firstLesson.id);
                handleLessonClick(firstLesson, firstChapter, firstVideo);
              }
            }
          }
        }
      }

      // Đánh dấu quá trình tải ban đầu đã hoàn thành
      setIsInitialLoad(false);
    }

    initialize();
  }, [
    fetchCourseInfo,
    restoreLastWatchedVideo,
    handleLessonClick,
    getNumberFromTitle,
    sortFiles,
  ]);

  // Save current video state on unmount or beforeunload
  useEffect(() => {
    const saveCurrentVideoState = () => {
      if (activeVideo && activeLesson && activeChapter) {
        console.log(
          "Saving current video state before unload:",
          activeVideo.name
        );

        // Save current course state to localStorage
        localStorage.setItem(
          "courseState",
          JSON.stringify({
            courseId: params.courseId,
            videoId: activeVideo.id,
            lessonId: activeLesson.id,
            chapterId: activeChapter.id,
            timestamp: Date.now(),
          })
        );
      }
    };

    // Save on page unload
    window.addEventListener("beforeunload", saveCurrentVideoState);

    return () => {
      // Save on component unmount
      saveCurrentVideoState();
      window.removeEventListener("beforeunload", saveCurrentVideoState);
    };
  }, [activeVideo, activeLesson, activeChapter, params.courseId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="h-screen bg-[#141414] flex flex-col overflow-hidden"
      style={{ "--video-height": videoHeight }}
    >
      {/* Header */}
      <Header
        courseInfo={courseInfo}
        videoProgress={videoProgress}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:grid md:grid-cols-[1fr_380px] flex flex-col min-h-0 overflow-hidden">
        {/* Video Player Section */}
        <VideoSection
          activeVideo={activeVideo}
          activeLesson={activeLesson}
          handleVideoEnd={handleVideoEnd}
          handleTimeUpdate={handleTimeUpdate}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          key={key}
        />

        {/* Course Content Section */}
        <div className="flex-1 md:flex-none md:w-[380px] bg-[#1f1f1f] border-t md:border-t-0 md:border-l border-gray-800 h-[calc(100vh-52px-56px-var(--video-height))] md:h-[calc(100vh-52px)] custom-scrollbar">
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
