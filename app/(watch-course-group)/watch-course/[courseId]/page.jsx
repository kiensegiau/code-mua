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
import { getNumberFromTitle, sortByName } from "./utils/sorting";

// Lazy load VideoPlayer để tối ưu hiệu năng
const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div
      key="video-player-loading"
      className="flex items-center justify-center w-full h-full"
    >
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
  <header className="bg-[#1f1f1f] border-b border-gray-800 flex h-[52px] justify-between items-center px-4 z-10 shadow-md">
    <div className="flex items-center">
      <Link
        key="back-link"
        href="/courses"
        className="flex items-center justify-center text-gray-300 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-800 px-2 py-1.5 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden xs:inline ml-1.5 text-sm font-medium">
          Quay lại
        </span>
      </Link>
      <div className="h-4 w-[1px] bg-gray-800 hidden xs:block mx-3"></div>
      <h1 className="text-white font-medium text-sm md:text-base truncate">
        {courseInfo?.title || "Đang tải..."}
      </h1>
    </div>
    {handleLogout && (
      <button
        key="logout-button"
        onClick={handleLogout}
        className="flex items-center text-white bg-[#ff4d4f]/90 hover:bg-[#ff4d4f] transition-colors px-2 py-1.5 rounded-full"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden xs:inline ml-1.5 text-xs font-medium">
          Đăng xuất
        </span>
      </button>
    )}
  </header>
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
    keyProp,
  }) => (
    <div className="flex-none md:flex md:flex-col md:h-[calc(100vh-52px)] overflow-hidden">
      {/* Video Info - Moved to top */}
      <div className="flex-none p-3 md:p-4 border-b border-gray-800 bg-[#1f1f1f]">
        <h1 className="text-sm md:text-lg font-medium text-gray-200 truncate whitespace-nowrap overflow-hidden">
          {activeLesson ? (
            <>
              {activeLesson.title}
              {activeVideo && (
                <>
                  <span key="title-separator" className="mx-2 text-gray-400">
                    |
                  </span>
                  {activeVideo.name}
                </>
              )}
            </>
          ) : (
            "Chưa có bài học nào được chọn"
          )}
        </h1>
      </div>

      {/* Video container */}
      <div
        className="w-full relative bg-black dark:bg-[#1f1f1f]"
        style={{ height: "var(--video-height)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {activeVideo ? (
            <VideoPlayer
              key={keyProp}
              file={activeVideo}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
              autoPlay={true}
            />
          ) : (
            <div
              key="empty-video-message"
              className="flex items-center justify-center h-full w-full"
            >
              <p className="text-gray-400">
                Vui lòng chọn một bài học để bắt đầu
              </p>
            </div>
          )}
        </div>
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
  const sortFiles = useCallback((a, b) => {
    return sortByName(a, b);
  }, []);

  // Handler functions
  const handleLessonClick = useCallback((lesson, chapter, file) => {
    if (lesson) setActiveLesson(lesson);
    if (chapter) setActiveChapter(chapter);

    if (file) {
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
    handleNext();
  }, [handleNext]);

  const handleLogout = useCallback(async () => {
    try {
      // Gọi API để xóa cookie
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Xóa dữ liệu từ localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");

      router.push("/sign-in");
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
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
          return;
        }
        handleLessonClick(activeLesson, activeChapter, file);
      } else {
        if (file.driveFileId) {
          const driveViewUrl = `https://drive.google.com/file/d/${file.driveFileId}/view`;
          window.open(driveViewUrl, "_blank");
        } else {
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

      // Sắp xếp chapters ngay khi nhận dữ liệu
      if (course && course.chapters && course.chapters.length > 0) {
        // Sắp xếp chapters theo số trong tiêu đề
        course.chapters.sort((a, b) => {
          const numA = getNumberFromTitle(a.title);
          const numB = getNumberFromTitle(b.title);
          return numA - numB;
        });

        // Sắp xếp lessons trong mỗi chapter
        course.chapters.forEach((chapter) => {
          if (chapter.lessons && chapter.lessons.length > 0) {
            chapter.lessons.sort((a, b) => {
              const numA = getNumberFromTitle(a.title);
              const numB = getNumberFromTitle(b.title);
              return numA - numB;
            });

            // Sắp xếp files trong mỗi lesson
            chapter.lessons.forEach((lesson) => {
              if (lesson.files && lesson.files.length > 0) {
                lesson.files.sort(sortFiles);
              }

              // Sắp xếp subfolders và files trong subfolders
              if (lesson.subfolders && lesson.subfolders.length > 0) {
                lesson.subfolders.sort((a, b) => {
                  const numA = getNumberFromTitle(a.name);
                  const numB = getNumberFromTitle(b.name);
                  return numA - numB;
                });

                lesson.subfolders.forEach((subfolder) => {
                  if (subfolder.files && subfolder.files.length > 0) {
                    subfolder.files.sort(sortFiles);
                  }
                });
              }
            });
          }
        });
      }

      setCourseInfo(course);
      return course;
    } catch (error) {
      toast.error("Không thể tải thông tin khóa học");
      return null;
    } finally {
      setLoading(false);
    }
  }, [params.courseId, getNumberFromTitle, sortFiles]);

  // Restore last watched video
  const restoreLastWatchedVideo = useCallback(
    (course) => {
      if (!course || !course.chapters) return false;

      try {
        const lastWatchedVideoId = localStorage.getItem("lastWatchedVideoId");
        const courseStateStr = localStorage.getItem("courseState");
        let courseState = null;

        if (courseStateStr) {
          try {
            courseState = JSON.parse(courseStateStr);
            if (courseState.courseId !== params.courseId) {
              courseState = null;
            }
          } catch (e) {
            // Ignore parsing error
          }
        }

        const videoId = courseState?.videoId || lastWatchedVideoId;

        if (!videoId) {
          return false;
        }

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

        let foundVideo = null;
        let foundLesson = null;
        let foundChapter = null;

        if (targetChapter && targetLesson) {
          // Kiểm tra trong files của lesson
          foundVideo = (targetLesson.files || []).find(
            (file) => file.id === videoId && file.type?.includes("video")
          );

          // Nếu không tìm thấy trong files, kiểm tra trong subfolders
          if (!foundVideo && targetLesson.subfolders) {
            for (const subfolder of targetLesson.subfolders) {
              const videoInSubfolder = (subfolder.files || []).find(
                (file) => file.id === videoId && file.type?.includes("video")
              );
              if (videoInSubfolder) {
                foundVideo = videoInSubfolder;
                break;
              }
            }
          }

          if (foundVideo) {
            foundLesson = targetLesson;
            foundChapter = targetChapter;
          }
        }

        if (!foundVideo) {
          for (const chapter of course.chapters) {
            for (const lesson of chapter.lessons || []) {
              // Kiểm tra trong files của lesson
              const videoFile = (lesson.files || []).find(
                (file) => file.id === videoId && file.type?.includes("video")
              );

              if (videoFile) {
                foundVideo = videoFile;
                foundLesson = lesson;
                foundChapter = chapter;
                break;
              }

              // Nếu không tìm thấy trong files, kiểm tra trong subfolders
              if (!foundVideo && lesson.subfolders) {
                let foundInSubfolder = false;

                for (const subfolder of lesson.subfolders) {
                  const videoInSubfolder = (subfolder.files || []).find(
                    (file) =>
                      file.id === videoId && file.type?.includes("video")
                  );

                  if (videoInSubfolder) {
                    foundVideo = videoInSubfolder;
                    foundLesson = lesson;
                    foundChapter = chapter;
                    foundInSubfolder = true;
                    break;
                  }
                }

                if (foundInSubfolder) break;
              }
            }
            if (foundVideo) break;
          }
        }

        if (foundVideo && foundLesson && foundChapter) {
          const chapterIndex = course.chapters.indexOf(foundChapter);
          setExpandedChapterIndex(chapterIndex);
          setExpandedLessonId(foundLesson.id);

          // Xác định subfolder nếu video nằm trong subfolder
          let subfolderInfo = null;
          if (foundLesson.subfolders) {
            for (const subfolder of foundLesson.subfolders) {
              if (
                subfolder.files &&
                subfolder.files.some((file) => file.id === foundVideo.id)
              ) {
                subfolderInfo = {
                  id: subfolder.id,
                  name: subfolder.name,
                };
                break;
              }
            }
          }

          // Lưu thông tin subfolder vào localStorage để component LessonItem có thể mở đúng subfolder
          if (subfolderInfo) {
            localStorage.setItem("lastWatchedSubfolderId", subfolderInfo.id);
          }

          setActiveChapter(foundChapter);
          setActiveLesson(foundLesson);
          setActiveVideo(foundVideo);
          setKey(Date.now());

          return true;
        }
      } catch (error) {
        // Ignore restore error
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
          if (activeVideo) {
            return;
          }

          const savedStateJSON = localStorage.getItem(
            `last_watched_${courseInfo.id}`
          );
          if (!savedStateJSON) return;

          const savedState = JSON.parse(savedStateJSON);
          if (!savedState || !savedState.videoId) return;

          if (savedState.chapterId) {
            const chapters = courseInfo.chapters || [];
            const chapterIndex = chapters.findIndex(
              (c) => c.id === savedState.chapterId
            );
            if (chapterIndex !== -1) {
              setTimeout(() => {
                setExpandedChapterIndex(chapterIndex);
              }, 100);
            }
          }

          if (savedState.lessonId) {
            setTimeout(() => {
              setExpandedLessonId(savedState.lessonId);
            }, 150);
          }

          // Kiểm tra và lưu thông tin subfolder
          if (savedState.subfolderId) {
            localStorage.setItem(
              "lastWatchedSubfolderId",
              savedState.subfolderId
            );

            // Tìm thông tin video trong subfolder
            if (savedState.chapterId && savedState.lessonId) {
              const chapter = courseInfo.chapters.find(
                (c) => c.id === savedState.chapterId
              );
              if (chapter) {
                const lesson = chapter.lessons.find(
                  (l) => l.id === savedState.lessonId
                );
                if (lesson && lesson.subfolders) {
                  const subfolder = lesson.subfolders.find(
                    (sf) => sf.id === savedState.subfolderId
                  );
                  if (subfolder) {
                    // console.log(
                    //   `Khôi phục video từ subfolder: ${subfolder.name}`
                    // );
                  }
                }
              }
            }
          }
        } catch (error) {
          // Ignore restore error
        }
      };

      setTimeout(restoreVideoState, 300);
    }
  }, [courseInfo, activeVideo]);

  // Effects
  useEffect(() => {
    async function initialize() {
      const course = await fetchCourseInfo();
      if (course) {
        const restored = restoreLastWatchedVideo(course);

        if (!restored && course.chapters && course.chapters.length > 0) {
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
                setExpandedChapterIndex(0);
                setExpandedLessonId(firstLesson.id);
                handleLessonClick(firstLesson, firstChapter, firstVideo);
              }
            }
          }
        }
      }

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

    window.addEventListener("beforeunload", saveCurrentVideoState);

    return () => {
      saveCurrentVideoState();
      window.removeEventListener("beforeunload", saveCurrentVideoState);
    };
  }, [activeVideo, activeLesson, activeChapter, params.courseId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="h-screen bg-white dark:bg-[#141414] flex flex-col overflow-hidden"
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
          keyProp={key}
        />

        {/* Course Content Section */}
        <div className="flex-1 md:flex-none md:w-[380px] bg-gray-100 dark:bg-[#1f1f1f] border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-800 h-[calc(100vh-52px-56px-var(--video-height))] md:h-[calc(100vh-52px)] custom-scrollbar">
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
