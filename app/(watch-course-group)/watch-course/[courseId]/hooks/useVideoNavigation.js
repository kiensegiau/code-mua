import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { sortByName, sortByTitle } from "../utils/sorting";

export const useVideoNavigation = ({
  activeLesson,
  activeChapter,
  activeVideo,
  courseInfo,
  setExpandedLessonId,
  setExpandedChapterIndex,
  handleLessonClick: originalHandleLessonClick,
}) => {
  // Ref để tránh gọi restoreVideoState khi component mount lần đầu nếu đã có active video
  const isFirstMount = useRef(true);

  const getNumberFromTitle = useCallback((text = "") => {
    const match = text.match(/(?:^|\.)?\s*(\d+)/);
    return match ? parseInt(match[1]) : 999999;
  }, []);

  const sortItems = useCallback(
    (a, b, key = "title") => {
      const numA = getNumberFromTitle(a[key]);
      const numB = getNumberFromTitle(b[key]);
      return numA - numB;
    },
    [getNumberFromTitle]
  );

  const findPreviousVideo = useCallback(() => {
    if (!activeLesson?.files || !activeVideo) return null;

    const sortedVideos = activeLesson.files
      .filter((f) => f.type?.includes("video"))
      .sort(sortByName);

    const currentIndex = sortedVideos.findIndex((v) => v.id === activeVideo.id);

    return sortedVideos[currentIndex - 1];
  }, [activeLesson, activeVideo]);

  const findPreviousLesson = useCallback(
    (lesson = activeLesson) => {
      if (!activeChapter?.lessons || !lesson) return null;

      const sortedLessons = [...activeChapter.lessons].sort(sortByTitle);
      const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);

      return sortedLessons[currentIndex - 1];
    },
    [activeChapter, sortByTitle]
  );

  const findPreviousChapter = useCallback(() => {
    if (!courseInfo?.chapters || !activeChapter) return null;

    const sortedChapters = [...courseInfo.chapters].sort(sortByTitle);
    const currentIndex = sortedChapters.findIndex(
      (c) => c.id === activeChapter.id
    );

    return sortedChapters[currentIndex - 1];
  }, [courseInfo, activeChapter]);

  const findNextVideo = useCallback(() => {
    if (!activeLesson?.files || !activeVideo) return null;

    const sortedVideos = activeLesson.files
      .filter((f) => f.type?.includes("video"))
      .sort(sortByName);

    const currentIndex = sortedVideos.findIndex((v) => v.id === activeVideo.id);

    return sortedVideos[currentIndex + 1] || null;
  }, [activeLesson, activeVideo]);

  const findNextLesson = useCallback(
    (lesson = activeLesson) => {
      if (!activeChapter?.lessons || !lesson) return null;

      const sortedLessons = [...activeChapter.lessons].sort(sortByTitle);
      const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);

      return sortedLessons[currentIndex + 1];
    },
    [activeChapter, sortByTitle]
  );

  const findNextChapter = useCallback(() => {
    if (!courseInfo?.chapters || !activeChapter) return null;

    const sortedChapters = [...courseInfo.chapters].sort(sortByTitle);
    const currentIndex = sortedChapters.findIndex(
      (c) => c.id === activeChapter.id
    );

    return sortedChapters[currentIndex + 1];
  }, [courseInfo, activeChapter]);

  const handleLessonClickWrapper = useCallback(
    (lesson, chapter, video) => {
      if (!lesson || !chapter || !video) {
        console.error("Missing required parameters:", {
          lesson,
          chapter,
          video,
        });
        return;
      }

      try {
        // Save current video state to localStorage
        localStorage.setItem(
          "activeVideo",
          JSON.stringify({
            videoId: video.id,
            lessonId: lesson.id,
            chapterId: chapter.id,
            timestamp: Date.now(), // Thêm timestamp để biết thời điểm lưu
          })
        );

        // Call the original handleLessonClick function
        originalHandleLessonClick(lesson, chapter, video);
      } catch (error) {
        console.error("Error in handleLessonClickWrapper:", error);
        toast.error("Có lỗi xảy ra khi chuyển video");
      }
    },
    [originalHandleLessonClick]
  );

  useEffect(() => {
    const restoreVideoState = () => {
      try {
        // Check if there's active video info in localStorage
        const activeVideoInfo = localStorage.getItem("activeVideo");
        if (!activeVideoInfo) return;

        const videoState = JSON.parse(activeVideoInfo);
        const { videoId, lessonId, chapterId, timestamp } = videoState;

        // Validate required fields
        if (!videoId || !lessonId || !chapterId) {
          console.warn("Invalid video state in localStorage:", videoState);
          return;
        }

        // Skip restore if we already have an active video
        if (activeVideo && activeLesson && activeChapter) {
          return;
        }

        // Find the corresponding chapter, lesson and video
        const chapter = courseInfo.chapters.find((c) => c.id === chapterId);
        if (!chapter) {
          console.warn("Chapter not found:", chapterId);
          return;
        }

        const lesson = chapter.lessons.find((l) => l.id === lessonId);
        if (!lesson) {
          console.warn("Lesson not found:", lessonId);
          return;
        }

        const video = lesson.files.find((f) => f.id === videoId);
        if (!video) {
          console.warn("Video not found:", videoId);
          return;
        }

        // Open the video and expand the lesson list
        const chapterIndex = courseInfo.chapters.indexOf(chapter);
        setExpandedChapterIndex(chapterIndex);
        setExpandedLessonId(lessonId);
        handleLessonClickWrapper(lesson, chapter, video);

        console.log("Video state restored successfully:", {
          video: video.name,
          lesson: lesson.title,
          chapter: chapter.title,
          savedAt: new Date(timestamp).toLocaleString(),
        });
      } catch (error) {
        console.error("Error restoring video state:", error);
      }
    };

    // Chỉ restore state khi:
    // 1. Component mount lần đầu và chưa có active video
    // 2. courseInfo thay đổi và chưa có active video
    if (courseInfo?.chapters && (!activeVideo || isFirstMount.current)) {
      restoreVideoState();
      isFirstMount.current = false;
    }
  }, [
    courseInfo,
    activeVideo,
    activeLesson,
    activeChapter,
    handleLessonClickWrapper,
    setExpandedLessonId,
    setExpandedChapterIndex,
  ]);

  const handleNext = useCallback(() => {
    try {
      // 1. Try next video in current lesson
      const nextVideo = findNextVideo();
      console.log("Next video:", nextVideo);
      if (nextVideo) {
        handleLessonClickWrapper(activeLesson, activeChapter, nextVideo);
        return;
      }

      console.log("No more video in current lesson, finding next lesson...");

      // 2. Try first video of next lesson in current chapter
      let currentLesson = activeLesson;
      let nextLesson = findNextLesson(currentLesson);

      while (nextLesson) {
        console.log("Checking lesson:", nextLesson);
        const firstVideo = nextLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort((a, b) => sortItems(a, b, "name"))[0];

        if (firstVideo) {
          console.log("Found first video of lesson:", firstVideo);
          setExpandedLessonId(nextLesson.id);
          handleLessonClickWrapper(nextLesson, activeChapter, firstVideo);
          return;
        }

        console.log("No video found, moving to next lesson...");
        currentLesson = nextLesson;
        nextLesson = findNextLesson(currentLesson);
      }

      console.log(
        "No more lesson with video in current chapter, moving to next chapter..."
      );

      // 3. Try first video of first lesson in next chapter
      let currentChapter = activeChapter;
      let nextChapter = findNextChapter(currentChapter);

      while (nextChapter) {
        console.log("Checking chapter:", nextChapter);
        const firstLessonWithVideo = nextChapter.lessons
          .sort(sortItems)
          .find((lesson) =>
            lesson.files.some((f) => f.type?.includes("video"))
          );

        if (firstLessonWithVideo) {
          const firstVideo = firstLessonWithVideo.files
            .filter((f) => f.type?.includes("video"))
            .sort((a, b) => sortItems(a, b, "name"))[0];

          console.log("Found first video of chapter:", firstVideo);
          setExpandedChapterIndex((prevIndex) => prevIndex + 1);
          setExpandedLessonId(firstLessonWithVideo.id);
          handleLessonClickWrapper(
            firstLessonWithVideo,
            nextChapter,
            firstVideo
          );
          return;
        }

        console.log("No lesson with video found, moving to next chapter...");
        currentChapter = nextChapter;
        nextChapter = findNextChapter(currentChapter);
      }

      console.log("Reached the end of the course");
      toast.success("Đã hoàn thành khóa học!");
    } catch (error) {
      console.error("Error navigating to next video:", error);
      toast.error("Có lỗi xảy ra khi chuyển video");
    }
  }, [
    activeLesson,
    activeChapter,
    findNextVideo,
    findNextLesson,
    findNextChapter,
    handleLessonClickWrapper,
    setExpandedLessonId,
    setExpandedChapterIndex,
    sortItems,
  ]);

  const handlePrevious = useCallback(() => {
    try {
      // 1. Try previous video in current lesson
      const prevVideo = findPreviousVideo();
      console.log("Previous video:", prevVideo);
      if (prevVideo) {
        handleLessonClickWrapper(activeLesson, activeChapter, prevVideo);
        return;
      }

      console.log(
        "No more video in current lesson, finding previous lesson..."
      );

      // 2. Try last video of previous lesson in current chapter
      let currentLesson = activeLesson;
      let prevLesson = findPreviousLesson(currentLesson);

      while (prevLesson) {
        console.log("Checking lesson:", prevLesson);
        const lastVideo = prevLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort((a, b) => sortItems(a, b, "name"))
          .pop();

        if (lastVideo) {
          console.log("Found last video of lesson:", lastVideo);
          setExpandedLessonId(prevLesson.id);
          handleLessonClickWrapper(prevLesson, activeChapter, lastVideo);
          return;
        }

        console.log("No video found, moving to previous lesson...");
        currentLesson = prevLesson;
        prevLesson = findPreviousLesson(currentLesson);
      }

      console.log(
        "No more lesson with video in current chapter, moving to previous chapter..."
      );

      // 3. Try last video of last lesson in previous chapter
      let currentChapter = activeChapter;
      let prevChapter = findPreviousChapter(currentChapter);

      while (prevChapter) {
        console.log("Checking chapter:", prevChapter);
        const lastLessonWithVideo = [...prevChapter.lessons]
          .sort(sortItems)
          .reverse()
          .find((lesson) =>
            lesson.files.some((f) => f.type?.includes("video"))
          );

        if (lastLessonWithVideo) {
          const lastVideo = lastLessonWithVideo.files
            .filter((f) => f.type?.includes("video"))
            .sort((a, b) => sortItems(a, b, "name"))
            .pop();

          console.log("Found last video of chapter:", lastVideo);
          setExpandedChapterIndex((prevIndex) => prevIndex - 1);
          setExpandedLessonId(lastLessonWithVideo.id);
          handleLessonClickWrapper(lastLessonWithVideo, prevChapter, lastVideo);
          return;
        }

        console.log(
          "No lesson with video found, moving to previous chapter..."
        );
        currentChapter = prevChapter;
        prevChapter = findPreviousChapter(currentChapter);
      }

      console.log("Reached the beginning of the course");
      toast("Đã về đầu khóa học!");
    } catch (error) {
      console.error("Error navigating to previous video:", error);
      toast.error("Có lỗi xảy ra khi chuyển video");
    }
  }, [
    activeLesson,
    activeChapter,
    findPreviousVideo,
    findPreviousLesson,
    findPreviousChapter,
    handleLessonClickWrapper,
    setExpandedLessonId,
    setExpandedChapterIndex,
    sortItems,
  ]);

  return {
    handleNext,
    handlePrevious,
    findNextVideo,
    findPreviousVideo,
    findNextLesson,
    findPreviousLesson,
    findNextChapter,
    findPreviousChapter,
    handleLessonClick: handleLessonClickWrapper, // Export wrapper instead of original
  };
};
