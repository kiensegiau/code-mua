import { useCallback, useMemo, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { sortByName, sortByTitle } from "../utils/sorting";

export const useVideoNavigation = ({
  activeLesson,
  activeChapter,
  activeVideo,
  courseInfo,
  setExpandedLessonId,
  setExpandedChapterIndex,
  handleLessonClick,
  setActiveVideo,
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

  const findVideoById = useCallback((lessonFiles, videoId) => {
    return lessonFiles
      .filter((f) => f.type?.includes("video"))
      .find((file) => file.id === videoId);
  }, []);

  // Lọc và sắp xếp tất cả các video trong bài học hiện tại (bao gồm cả subfolders)
  const currentLessonVideos = useMemo(() => {
    if (!activeLesson) return [];

    let videos = [];

    // Thêm videos từ files của lesson
    if (activeLesson.files) {
      videos.push(
        ...activeLesson.files.filter((f) => f.type?.includes("video"))
      );
    }

    // Thêm videos từ các subfolders
    if (activeLesson.subfolders) {
      activeLesson.subfolders.forEach((subfolder) => {
        if (subfolder.files) {
          videos.push(
            ...subfolder.files.filter((f) => f.type?.includes("video"))
          );
        }
      });
    }

    // Sắp xếp tất cả videos theo tên
    return videos.sort((a, b) => sortItems(a, b, "name"));
  }, [activeLesson, sortItems]);

  // Lấy danh sách bài học đã sắp xếp trong chương hiện tại
  const sortedLessonsInCurrentChapter = useMemo(() => {
    if (!activeChapter?.lessons) return [];
    return [...activeChapter.lessons].sort(sortItems);
  }, [activeChapter?.lessons, sortItems]);

  // Lấy danh sách chương đã sắp xếp trong khóa học
  const sortedChapters = useMemo(() => {
    if (!courseInfo?.chapters) return [];
    return [...courseInfo.chapters].sort(sortItems);
  }, [courseInfo?.chapters, sortItems]);

  // Tìm video tiếp theo trong bài học hiện tại
  const findNextVideo = useCallback(() => {
    if (!activeVideo || !currentLessonVideos.length) return null;

    const currentIndex = currentLessonVideos.findIndex(
      (v) => v.id === activeVideo.id
    );

    if (currentIndex < currentLessonVideos.length - 1) {
      return currentLessonVideos[currentIndex + 1];
    }

    return null;
  }, [activeVideo, currentLessonVideos]);

  // Tìm video trước đó trong bài học hiện tại
  const findPreviousVideo = useCallback(() => {
    if (!activeVideo || !currentLessonVideos.length) return null;

    const currentIndex = currentLessonVideos.findIndex(
      (v) => v.id === activeVideo.id
    );

    if (currentIndex > 0) {
      return currentLessonVideos[currentIndex - 1];
    }

    return null;
  }, [activeVideo, currentLessonVideos]);

  // Tìm bài học tiếp theo trong chương hiện tại
  const findNextLesson = useCallback(
    (lesson) => {
      if (!lesson || !sortedLessonsInCurrentChapter.length) return null;

      const currentIndex = sortedLessonsInCurrentChapter.findIndex(
        (l) => l.id === lesson.id
      );

      if (currentIndex < sortedLessonsInCurrentChapter.length - 1) {
        return sortedLessonsInCurrentChapter[currentIndex + 1];
      }

      return null;
    },
    [sortedLessonsInCurrentChapter]
  );

  // Tìm bài học trước đó trong chương hiện tại
  const findPreviousLesson = useCallback(
    (lesson) => {
      if (!lesson || !sortedLessonsInCurrentChapter.length) return null;

      const currentIndex = sortedLessonsInCurrentChapter.findIndex(
        (l) => l.id === lesson.id
      );

      if (currentIndex > 0) {
        return sortedLessonsInCurrentChapter[currentIndex - 1];
      }

      return null;
    },
    [sortedLessonsInCurrentChapter]
  );

  // Tìm chương tiếp theo trong khóa học
  const findNextChapter = useCallback(
    (chapter) => {
      if (!chapter || !sortedChapters.length) return null;

      const currentIndex = sortedChapters.findIndex((c) => c.id === chapter.id);

      if (currentIndex < sortedChapters.length - 1) {
        return sortedChapters[currentIndex + 1];
      }

      return null;
    },
    [sortedChapters]
  );

  // Tìm chương trước đó trong khóa học
  const findPreviousChapter = useCallback(
    (chapter) => {
      if (!chapter || !sortedChapters.length) return null;

      const currentIndex = sortedChapters.findIndex((c) => c.id === chapter.id);

      if (currentIndex > 0) {
        return sortedChapters[currentIndex - 1];
      }

      return null;
    },
    [sortedChapters]
  );

  // Lưu trạng thái xem video vào localStorage
  const saveLastWatchedState = useCallback(
    (lesson, chapter, video) => {
      if (!courseInfo || !video || !lesson || !chapter) return;

      // Kiểm tra xem video có thuộc subfolder nào không
      let subfolderInfo = null;

      if (lesson.subfolders && lesson.subfolders.length > 0) {
        for (const subfolder of lesson.subfolders) {
          if (
            subfolder.files &&
            subfolder.files.some((file) => file.id === video.id)
          ) {
            subfolderInfo = {
              id: subfolder.id,
              name: subfolder.name,
            };
            break;
          }
        }
      }

      const lastWatchedState = {
        courseId: courseInfo.id,
        courseSlug: courseInfo.slug,
        videoId: video.id,
        lessonId: lesson.id,
        chapterId: chapter.id,
        subfolderId: subfolderInfo?.id || null,
        subfolderName: subfolderInfo?.name || null,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          `last_watched_${courseInfo.id}`,
          JSON.stringify(lastWatchedState)
        );

        // Đồng thời cập nhật courseState để duy trì tính nhất quán
        localStorage.setItem(
          "courseState",
          JSON.stringify({
            courseId: courseInfo.id,
            videoId: video.id,
            lessonId: lesson.id,
            chapterId: chapter.id,
            subfolderId: subfolderInfo?.id || null,
            subfolderName: subfolderInfo?.name || null,
            lastPlayedTime: Date.now(),
            timestamp: Date.now(),
          })
        );

        // Cập nhật lastWatchedVideoId cho khả năng tương thích với code cũ
        localStorage.setItem("lastWatchedVideoId", video.id);

        // Lưu thêm thông tin subfolderId để tiện cho việc khôi phục
        if (subfolderInfo?.id) {
          localStorage.setItem("lastWatchedSubfolderId", subfolderInfo.id);
        }
      } catch (error) {
        // console.error("Error saving last watched state:", error);
      }
    },
    [courseInfo]
  );

  // Xử lý khi click vào bài học
  const handleLessonClickWrapper = useCallback(
    (lesson, chapter, video) => {
      if (!video || !lesson || !chapter) return;

      // Cập nhật chương đang mở
      if (chapter && chapter.id !== activeChapter?.id) {
        const chapterIndex = sortedChapters.findIndex(
          (c) => c.id === chapter.id
        );
        if (chapterIndex !== -1) {
          setExpandedChapterIndex(chapterIndex);
        }
      }

      // Cập nhật bài học đang mở
      if (lesson && lesson.id !== activeLesson?.id) {
        setExpandedLessonId(lesson.id);
      }

      // Kiểm tra xem video có thuộc subfolder nào không
      let subfolderInfo = null;
      if (lesson.subfolders && lesson.subfolders.length > 0) {
        for (const subfolder of lesson.subfolders) {
          if (
            subfolder.files &&
            subfolder.files.some((file) => file.id === video.id)
          ) {
            subfolderInfo = {
              id: subfolder.id,
              name: subfolder.name,
            };
            // Lưu subfolderId để LessonItem có thể mở đúng subfolder
            localStorage.setItem("lastWatchedSubfolderId", subfolder.id);
            break;
          }
        }
      }

      if (handleLessonClick) {
        handleLessonClick(lesson, chapter, video);
      } else {
        setActiveVideo(video);
      }
      saveLastWatchedState(lesson, chapter, video);
    },
    [
      handleLessonClick,
      setActiveVideo,
      saveLastWatchedState,
      activeChapter,
      activeLesson,
      sortedChapters,
      setExpandedChapterIndex,
      setExpandedLessonId,
    ]
  );

  // Khôi phục trạng thái xem video từ localStorage
  const restoreLastWatchedState = useCallback(() => {
    if (!courseInfo || !courseInfo.id) return false;

    try {
      // Kiểm tra nếu đã có video được chọn thì không cần khôi phục
      if (activeVideo) {
        return false;
      }

      const savedStateJSON = localStorage.getItem(
        `last_watched_${courseInfo.id}`
      );
      if (!savedStateJSON) return false;

      const savedState = JSON.parse(savedStateJSON);
      if (
        !savedState ||
        !savedState.videoId ||
        !savedState.lessonId ||
        !savedState.chapterId
      ) {
        return false;
      }

      // Tìm chương
      const chapter = courseInfo.chapters.find(
        (c) => c.id === savedState.chapterId
      );
      if (!chapter) return false;

      // Tìm bài học
      const lesson = chapter.lessons.find((l) => l.id === savedState.lessonId);
      if (!lesson) return false;

      // Tìm video trong files của lesson
      let video = (lesson.files || []).find(
        (f) => f.id === savedState.videoId && f.type?.includes("video")
      );

      // Nếu không tìm thấy trong lesson files, tìm trong subfolders
      if (!video && lesson.subfolders) {
        for (const subfolder of lesson.subfolders) {
          const videoInSubfolder = (subfolder.files || []).find(
            (f) => f.id === savedState.videoId && f.type?.includes("video")
          );

          if (videoInSubfolder) {
            video = videoInSubfolder;
            break;
          }
        }
      }

      if (!video) return false;

      // Thực hiện khôi phục trạng thái
      if (chapter && lesson && video) {
        handleLessonClickWrapper(lesson, chapter, video);
        return true;
      }
    } catch (error) {
      // console.error("Lỗi khi khôi phục trạng thái xem video:", error);
      return false;
    }
  }, [courseInfo, activeVideo, handleLessonClickWrapper]);

  // Chuyển đến video tiếp theo
  const handleNext = useCallback(() => {
    try {
      // 1. Thử video tiếp theo trong bài học hiện tại (bao gồm cả videos trong subfolders)
      const nextVideo = findNextVideo();
      if (nextVideo) {
        handleLessonClickWrapper(activeLesson, activeChapter, nextVideo);
        return;
      }

      // 2. Thử video đầu tiên của bài học tiếp theo trong chương hiện tại
      let currentLesson = activeLesson;
      let nextLesson = findNextLesson(currentLesson);

      while (nextLesson) {
        // Tập hợp tất cả videos trong lesson (bao gồm cả từ subfolders)
        let lessonVideos = [];

        // Lấy videos từ files trực tiếp
        if (nextLesson.files && nextLesson.files.length > 0) {
          lessonVideos.push(
            ...nextLesson.files
              .filter((f) => f.type?.includes("video"))
              .sort((a, b) => sortItems(a, b, "name"))
          );
        }

        // Lấy videos từ subfolders
        if (nextLesson.subfolders && nextLesson.subfolders.length > 0) {
          for (const subfolder of nextLesson.subfolders) {
            if (subfolder.files && subfolder.files.length > 0) {
              lessonVideos.push(
                ...subfolder.files
                  .filter((f) => f.type?.includes("video"))
                  .sort((a, b) => sortItems(a, b, "name"))
              );
            }
          }
        }

        // Sắp xếp lại tất cả video theo tên
        lessonVideos.sort((a, b) => sortItems(a, b, "name"));

        if (lessonVideos.length > 0) {
          const firstVideo = lessonVideos[0];
          setExpandedLessonId(nextLesson.id);
          handleLessonClickWrapper(nextLesson, activeChapter, firstVideo);
          return;
        }

        currentLesson = nextLesson;
        nextLesson = findNextLesson(currentLesson);
      }

      // 3. Thử video đầu tiên của bài học đầu tiên trong chương tiếp theo
      let currentChapter = activeChapter;
      let nextChapter = findNextChapter(currentChapter);

      while (nextChapter) {
        for (const lesson of nextChapter.lessons.sort(sortItems)) {
          // Tập hợp tất cả videos trong lesson (bao gồm cả từ subfolders)
          let lessonVideos = [];

          // Lấy videos từ files trực tiếp
          if (lesson.files && lesson.files.length > 0) {
            lessonVideos.push(
              ...lesson.files
                .filter((f) => f.type?.includes("video"))
                .sort((a, b) => sortItems(a, b, "name"))
            );
          }

          // Lấy videos từ subfolders
          if (lesson.subfolders && lesson.subfolders.length > 0) {
            for (const subfolder of lesson.subfolders) {
              if (subfolder.files && subfolder.files.length > 0) {
                lessonVideos.push(
                  ...subfolder.files
                    .filter((f) => f.type?.includes("video"))
                    .sort((a, b) => sortItems(a, b, "name"))
                );
              }
            }
          }

          // Sắp xếp lại tất cả video theo tên
          lessonVideos.sort((a, b) => sortItems(a, b, "name"));

          if (lessonVideos.length > 0) {
            const firstVideo = lessonVideos[0];

            // Tìm chương index để cập nhật chính xác
            const nextChapterIndex = sortedChapters.findIndex(
              (c) => c.id === nextChapter.id
            );
            if (nextChapterIndex !== -1) {
              setExpandedChapterIndex(nextChapterIndex);
            } else {
              setExpandedChapterIndex((prevIndex) => prevIndex + 1);
            }

            setExpandedLessonId(lesson.id);
            handleLessonClickWrapper(lesson, nextChapter, firstVideo);
            return;
          }
        }

        currentChapter = nextChapter;
        nextChapter = findNextChapter(currentChapter);
      }

      toast.success("Đã hoàn thành khóa học!");
    } catch (error) {
      // console.error("Error navigating to next video:", error);
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
    sortedChapters,
  ]);

  // Chuyển đến video trước đó
  const handlePrevious = useCallback(() => {
    try {
      // 1. Thử video trước đó trong bài học hiện tại (bao gồm cả videos trong subfolders)
      const prevVideo = findPreviousVideo();
      if (prevVideo) {
        handleLessonClickWrapper(activeLesson, activeChapter, prevVideo);
        return;
      }

      // 2. Thử video cuối cùng của bài học trước đó trong chương hiện tại
      let currentLesson = activeLesson;
      let prevLesson = findPreviousLesson(currentLesson);

      while (prevLesson) {
        // Tập hợp tất cả videos trong lesson (bao gồm cả từ subfolders)
        let lessonVideos = [];

        // Lấy videos từ files trực tiếp
        if (prevLesson.files && prevLesson.files.length > 0) {
          lessonVideos.push(
            ...prevLesson.files
              .filter((f) => f.type?.includes("video"))
              .sort((a, b) => sortItems(a, b, "name"))
          );
        }

        // Lấy videos từ subfolders
        if (prevLesson.subfolders && prevLesson.subfolders.length > 0) {
          for (const subfolder of prevLesson.subfolders) {
            if (subfolder.files && subfolder.files.length > 0) {
              lessonVideos.push(
                ...subfolder.files
                  .filter((f) => f.type?.includes("video"))
                  .sort((a, b) => sortItems(a, b, "name"))
              );
            }
          }
        }

        // Sắp xếp lại tất cả video theo tên
        lessonVideos.sort((a, b) => sortItems(a, b, "name"));

        if (lessonVideos.length > 0) {
          const lastVideo = lessonVideos[lessonVideos.length - 1];
          setExpandedLessonId(prevLesson.id);
          handleLessonClickWrapper(prevLesson, activeChapter, lastVideo);
          return;
        }

        currentLesson = prevLesson;
        prevLesson = findPreviousLesson(currentLesson);
      }

      // 3. Thử video cuối cùng của bài học cuối cùng trong chương trước đó
      let currentChapter = activeChapter;
      let prevChapter = findPreviousChapter(currentChapter);

      while (prevChapter) {
        const sortedLessons = [...prevChapter.lessons]
          .sort(sortItems)
          .reverse();

        for (const lesson of sortedLessons) {
          // Tập hợp tất cả videos trong lesson (bao gồm cả từ subfolders)
          let lessonVideos = [];

          // Lấy videos từ files trực tiếp
          if (lesson.files && lesson.files.length > 0) {
            lessonVideos.push(
              ...lesson.files
                .filter((f) => f.type?.includes("video"))
                .sort((a, b) => sortItems(a, b, "name"))
            );
          }

          // Lấy videos từ subfolders
          if (lesson.subfolders && lesson.subfolders.length > 0) {
            for (const subfolder of lesson.subfolders) {
              if (subfolder.files && subfolder.files.length > 0) {
                lessonVideos.push(
                  ...subfolder.files
                    .filter((f) => f.type?.includes("video"))
                    .sort((a, b) => sortItems(a, b, "name"))
                );
              }
            }
          }

          // Sắp xếp lại tất cả video theo tên
          lessonVideos.sort((a, b) => sortItems(a, b, "name"));

          if (lessonVideos.length > 0) {
            const lastVideo = lessonVideos[lessonVideos.length - 1];

            // Tìm chương index để cập nhật chính xác
            const prevChapterIndex = sortedChapters.findIndex(
              (c) => c.id === prevChapter.id
            );
            if (prevChapterIndex !== -1) {
              setExpandedChapterIndex(prevChapterIndex);
            } else {
              setExpandedChapterIndex((prevIndex) => prevIndex - 1);
            }

            setExpandedLessonId(lesson.id);
            handleLessonClickWrapper(lesson, prevChapter, lastVideo);
            return;
          }
        }

        currentChapter = prevChapter;
        prevChapter = findPreviousChapter(currentChapter);
      }

      toast("Đã về đầu khóa học!");
    } catch (error) {
      // console.error("Error navigating to previous video:", error);
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
    sortedChapters,
  ]);

  // Khôi phục trạng thái xem cuối cùng khi component được mount hoặc khi thông tin khóa học thay đổi
  useEffect(() => {
    if (courseInfo?.id) {
      restoreLastWatchedState();
    }
  }, [courseInfo?.id, restoreLastWatchedState]);

  return {
    handleNext,
    handlePrevious,
    findNextVideo,
    findPreviousVideo,
    findNextLesson,
    findPreviousLesson,
    findNextChapter,
    findPreviousChapter,
    handleLessonClick: handleLessonClickWrapper,
  };
};
