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

  const findPreviousLesson = useCallback(() => {
    if (!activeChapter?.lessons || !activeLesson) return null;

    const sortedLessons = [...activeChapter.lessons].sort(sortByTitle);
    const currentIndex = sortedLessons.findIndex(
      (l) => l.id === activeLesson.id
    );

    return sortedLessons[currentIndex - 1];
  }, [activeChapter, activeLesson]);

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

    return sortedVideos[currentIndex + 1];
  }, [activeLesson, activeVideo]);

  const findNextLesson = useCallback(() => {
    if (!activeChapter?.lessons || !activeLesson) return null;

    const sortedLessons = [...activeChapter.lessons].sort(sortByTitle);
    const currentIndex = sortedLessons.findIndex(
      (l) => l.id === activeLesson.id
    );

    return sortedLessons[currentIndex + 1];
  }, [activeChapter, activeLesson]);

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

      // 2. Try first video of next lesson
      const nextLesson = findNextLesson();
      console.log("Next lesson:", nextLesson);
      if (nextLesson) {
        const firstVideo = nextLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort((a, b) => sortItems(a, b, "name"))[0];

        if (firstVideo) {
          console.log("First video of next lesson:", firstVideo);
          setExpandedLessonId(nextLesson.id);
          handleLessonClick(nextLesson, activeChapter, firstVideo);
          return;
        }
      }

      // 3. Try first video of first lesson in next chapter
      const nextChapter = findNextChapter();
      console.log("Next chapter:", nextChapter);
      if (nextChapter) {
        const firstLesson = nextChapter.lessons.sort(sortItems)[0];
        if (firstLesson) {
          const firstVideo = firstLesson.files
            .filter((f) => f.type?.includes("video"))
            .sort((a, b) => sortItems(a, b, "name"))[0];

          if (firstVideo) {
            console.log(
              "First video of first lesson in next chapter:",
              firstVideo
            );
            setExpandedChapterIndex((prevIndex) => prevIndex + 1);
            setExpandedLessonId(firstLesson.id);
            handleLessonClick(firstLesson, nextChapter, firstVideo);
            return;
          }
        }
      }

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

      // 2. Try last video of previous lesson
      const prevLesson = findPreviousLesson();
      console.log("Previous lesson:", prevLesson);
      if (prevLesson) {
        const lastVideo = prevLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort((a, b) => sortItems(a, b, "name"))
          .pop();

        if (lastVideo) {
          console.log("Last video of previous lesson:", lastVideo);
          setExpandedLessonId(prevLesson.id);
          handleLessonClick(prevLesson, activeChapter, lastVideo);
          return;
        }
      }

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
