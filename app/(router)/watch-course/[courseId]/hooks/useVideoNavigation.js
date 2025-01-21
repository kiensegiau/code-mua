import { useCallback } from "react";
import { toast } from "sonner";
import { sortByName, sortByTitle } from "../utils/sorting";

export const useVideoNavigation = ({
  activeLesson,
  activeChapter,
  activeVideo,
  courseInfo,
  setExpandedLessonId,
  setExpandedChapterIndex,
  handleLessonClick,
}) => {
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

  const handleNext = useCallback(() => {
    try {
      // 1. Try next video in current lesson
      const nextVideo = findNextVideo();
      console.log("Next video:", nextVideo);
      if (nextVideo) {
        handleLessonClick(activeLesson, activeChapter, nextVideo);
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
          handleLessonClick(nextLesson, activeChapter, firstVideo);
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
          handleLessonClick(firstLessonWithVideo, nextChapter, firstVideo);
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
    handleLessonClick,
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
        handleLessonClick(activeLesson, activeChapter, prevVideo);
        return;
      }

      // 2. Try last video of previous lesson in current chapter
      let prevLesson = findPreviousLesson();
      console.log("Initial previous lesson:", prevLesson);

      while (prevLesson) {
        console.log("Checking lesson:", prevLesson);
        const lastVideo = prevLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort((a, b) => sortItems(a, b, "name"))
          .pop();

        if (lastVideo) {
          console.log("Found last video of lesson:", lastVideo);
          setExpandedLessonId(prevLesson.id);
          handleLessonClick(prevLesson, activeChapter, lastVideo);
          return;
        }

        // If no video found, continue to find previous lesson
        console.log("No video found, finding previous lesson...");
        prevLesson = findPreviousLesson(prevLesson);
      }

      console.log("No more lesson in current chapter, go to previous chapter");

      // 3. Try last video of last lesson in previous chapter
      const prevChapter = findPreviousChapter();
      console.log("Previous chapter:", prevChapter);
      if (prevChapter) {
        const lastLesson = prevChapter.lessons.sort(sortItems).pop();
        if (lastLesson) {
          const lastVideo = lastLesson.files
            .filter((f) => f.type?.includes("video"))
            .sort((a, b) => sortItems(a, b, "name"))
            .pop();

          if (lastVideo) {
            console.log(
              "Last video of last lesson in previous chapter:",
              lastVideo
            );
            setExpandedChapterIndex((prevIndex) => prevIndex - 1);
            setExpandedLessonId(lastLesson.id);
            handleLessonClick(lastLesson, prevChapter, lastVideo);
            return;
          }
        }
      }

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
    handleLessonClick,
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
  };
};
