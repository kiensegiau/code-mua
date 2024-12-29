import React, { useState, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  IoBookOutline, // Icon cho chương
  IoPlayCircleOutline, // Icon cho bài học video
  IoDocumentOutline, // Icon cho tài liệu
  IoLinkOutline, // Icon cho links
} from "react-icons/io5";

export default function CourseContent({
  chapters = [],
  onLessonClick,
  activeLesson,
  activeChapter,
  onVideoEnd, // Callback khi video kết thúc
}) {
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);

  // Tìm video tiếp theo trong bài học hiện tại
  const findNextVideo = (currentLesson, currentFileId) => {
    const files = currentLesson.files || [];
    const currentIndex = files.findIndex(
      (f) => f.driveFileId === currentFileId
    );
    const nextVideoFile = files
      .slice(currentIndex + 1)
      .find(
        (file) =>
          file.driveFileId.toLowerCase().includes("video") ||
          file.driveFileId.includes("mp4")
      );
    return nextVideoFile;
  };

  // Tìm bài học tiếp theo có video
  const findNextLessonWithVideo = (currentChapterIndex, currentLessonIndex) => {
    let nextLesson = null;
    let nextChapter = null;

    // Tìm trong chapter hiện tại
    const currentChapter = chapters[currentChapterIndex];
    const nextLessonInChapter = currentChapter.lessons[currentLessonIndex + 1];

    if (
      nextLessonInChapter?.files?.some(
        (f) =>
          f.driveFileId.toLowerCase().includes("video") ||
          f.driveFileId.includes("mp4")
      )
    ) {
      return {
        lesson: nextLessonInChapter,
        chapter: currentChapter,
      };
    }

    // Tìm trong các chapter tiếp theo
    for (let i = currentChapterIndex; i < chapters.length; i++) {
      const chapter = chapters[i];
      const startIndex = i === currentChapterIndex ? currentLessonIndex + 1 : 0;

      for (let j = startIndex; j < chapter.lessons.length; j++) {
        const lesson = chapter.lessons[j];
        if (
          lesson.files?.some(
            (f) =>
              f.driveFileId.toLowerCase().includes("video") ||
              f.driveFileId.includes("mp4")
          )
        ) {
          return {
            lesson,
            chapter,
          };
        }
      }
    }

    return null;
  };

  // Thêm useEffect để tự động mở rộng chapter và lesson khi active lesson thay đổi
  useEffect(() => {
    if (activeLesson && chapters) {
      // Tìm chapter chứa lesson đang active
      const activeChapterIndex = chapters.findIndex((chapter) =>
        chapter.lessons?.some((lesson) => lesson._id === activeLesson._id)
      );

      if (activeChapterIndex !== -1) {
        // Tự động mở chapter
        setExpandedChapterIndex(activeChapterIndex);
        // Tự động mở lesson
        setExpandedLessonId(activeLesson.id);
      }
    }
  }, [activeLesson, chapters]);

  // Xử lý khi video kết thúc
  const handleVideoEnd = () => {
    if (!activeLesson || !activeFileId) return;

    const currentChapterIndex = chapters.findIndex(
      (c) => c.id === activeChapter?.id
    );
    const currentLessonIndex = chapters[currentChapterIndex]?.lessons.findIndex(
      (l) => l.id === activeLesson.id
    );

    // Tìm video tiếp theo trong bài học hiện tại
    const nextVideo = findNextVideo(activeLesson, activeFileId);

    if (nextVideo) {
      // Nếu còn video trong bài học hiện tại
      setActiveFileId(nextVideo.driveFileId);
      if (onLessonClick) {
        onLessonClick(activeLesson, activeChapter, nextVideo);
      }
    } else {
      // Tìm bài học tiếp theo có video
      const next = findNextLessonWithVideo(
        currentChapterIndex,
        currentLessonIndex
      );

      if (next) {
        const firstVideo = next.lesson.files.find(
          (f) =>
            f.driveFileId.toLowerCase().includes("video") ||
            f.driveFileId.includes("mp4")
        );

        // Tự động mở chapter mới và lesson mới
        const nextChapterIndex = chapters.findIndex(
          (c) => c.id === next.chapter.id
        );
        setExpandedChapterIndex(nextChapterIndex);
        setExpandedLessonId(next.lesson.id);
        setActiveFileId(firstVideo.driveFileId);

        if (onLessonClick) {
          onLessonClick(next.lesson, next.chapter, firstVideo);
        }
      }
    }
  };

  const handleChapterClick = (index) => {
    setExpandedChapterIndex(expandedChapterIndex === index ? null : index);
  };

  const handleLessonClick = (lesson, chapter, index) => {
    console.log("Lesson clicked:", {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      files: lesson.files,
    });

    setExpandedChapterIndex(index);
    setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id);
    if (onLessonClick) {
      onLessonClick(lesson, chapter);
    }
  };

  const getFileIcon = (fileId) => {
    // Kiểm tra loại file dựa vào tên hoặc id
    if (fileId.toLowerCase().includes("video") || fileId.includes("mp4")) {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 mr-3">
          <IoPlayCircleOutline className="w-3.5 h-3.5 text-blue-600" />
        </div>
      );
    } else if (fileId.toLowerCase().includes("doc") || fileId.includes("pdf")) {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-50 mr-3">
          <IoDocumentOutline className="w-3.5 h-3.5 text-orange-600" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100 mr-3">
          <IoLinkOutline className="w-3.5 h-3.5 text-gray-600" />
        </div>
      );
    }
  };

  const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const renderFiles = (files) => {
    return files?.map((file, index) => (
      <div
        key={file.driveFileId || index}
        className="flex items-center h-[40px] px-9 hover:bg-gray-100 transition-colors duration-150 ease-in-out border-l-[3px] border-transparent group"
      >
        <div className="flex items-center w-full overflow-hidden">
          {getFileIcon(file.driveFileId)}
          <div className="flex-1 min-w-0">
            <span
              className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-150 ease-in-out truncate block"
              title={file.driveFileId}
            >
              {truncateText(file.driveFileId)}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="main-container w-[380.39px] h-screen bg-white relative mx-auto my-0 shadow-lg">
      <div className="border-b border-gray-100">
        <div className="flex items-center">
          <button
            className={`px-4 py-3 text-sm font-medium relative
              ${
                activeLesson
                  ? "text-[#f05123] border-b-2 border-[#f05123]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {activeLesson?.title || "Nội dung khóa học"}
          </button>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-48px)] relative overflow-auto">
        {chapters?.map((chapter, index) => (
          <div
            key={chapter.id || `chapter-${index}`}
            className="border-b border-gray-100 last:border-b-0"
          >
            <div
              className="flex items-center h-[60px] px-5 bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              onClick={() => handleChapterClick(index)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-50 flex-shrink-0 mr-3">
                  <IoBookOutline className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-[15px] font-medium text-gray-800 mb-1 truncate"
                    title={chapter.title}
                  >
                    {truncateText(chapter.title)}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {`${chapter.completedLessons || 0}/${
                      chapter.lessons?.length || 0
                    } bài học`}
                  </p>
                </div>
              </div>
              {expandedChapterIndex === index ? (
                <IoChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <IoChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </div>

            {expandedChapterIndex === index &&
              chapter.lessons?.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id || `lesson-${index}-${lessonIndex}`}
                  className="my-1"
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLessonClick(lesson, chapter, index);
                    }}
                    className={`flex items-center h-[50px] px-7 cursor-pointer transition-all duration-150 ease-in-out
                    ${
                      activeLesson?._id === lesson._id
                        ? "bg-[rgba(240,81,35,0.08)] border-l-4 border-[#f05123]"
                        : "bg-white hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center w-full pointer-events-none min-w-0">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mr-3
                      ${
                        activeLesson?._id === lesson._id
                          ? "bg-[rgba(240,81,35,0.1)]"
                          : "bg-gray-100"
                      }`}
                      >
                        <IoPlayCircleOutline
                          className={`w-3.5 h-3.5 ${
                            activeLesson?._id === lesson._id
                              ? "text-[#f05123]"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm truncate ${
                          activeLesson?._id === lesson._id
                            ? "text-[#f05123] font-medium"
                            : "text-gray-700"
                        }`}
                        title={lesson.title}
                      >
                        {truncateText(lesson.title)}
                      </span>
                    </div>
                  </div>
                  {expandedLessonId === lesson.id && lesson.files && (
                    <div className="bg-gray-50 py-1">
                      {renderFiles(lesson.files)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
