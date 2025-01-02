import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  IoBookOutline, // Icon cho chương
  IoPlayCircleOutline, // Icon cho bài học video
  IoDocumentOutline, // Icon cho tài liệu
  IoLinkOutline, // Icon cho links
} from "react-icons/io5";
import { toast } from "react-hot-toast";

export default forwardRef(({
  chapters = [],
  onLessonClick,
  activeLesson,
  activeChapter,
  expandedChapterIndex,
  setExpandedChapterIndex,
  expandedLessonId,
  setExpandedLessonId,
  videoProgress,
  activeVideo
}, ref) => {
  const [activeFileId, setActiveFileId] = useState(null);

  // Tìm video tiếp theo trong bài học hiện tại
  const findNextVideo = (currentLesson, currentFileId) => {
    const videoFiles =
      currentLesson.files?.filter((f) => f.type?.includes("video")) || [];
    const currentIndex = videoFiles.findIndex(
      (f) => f.driveFileId === currentFileId
    );
    return videoFiles[currentIndex + 1];
  };

  // Tìm bài học tiếp theo có video
  const findNextLessonWithVideo = (lessons, currentLessonIndex) => {
    for (let i = currentLessonIndex + 1; i < lessons.length; i++) {
      const lesson = lessons[i];
      const videoFile = lesson.files?.find((f) => f.type?.includes("video"));
      if (videoFile) {
        return {
          lesson,
          videoFile,
        };
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
        // Chỉ set expandedChapterIndex khi component mới mount hoặc khi activeLesson thay đổi
        if (expandedChapterIndex === -1) {
          setExpandedChapterIndex(activeChapterIndex);
        }
        // Tự động mở lesson
        setExpandedLessonId(activeLesson.id);
      }
    }
  }, [activeLesson, chapters]);

  // Xử lý khi video kết thúc
  const handleVideoEnd = () => {
    console.log('=== handleVideoEnd triggered ===');
    console.log('Active video:', activeVideo);
    console.log('Active lesson:', activeLesson);
    console.log('Active chapter:', activeChapter);
    console.log('Expanded chapter index:', expandedChapterIndex);

    if (!activeLesson || !activeChapter || !activeVideo) {
      console.log('Missing required data');
      return;
    }

    // 1. Tìm video hiện tại trong lesson
    const currentVideoIndex = activeLesson.files.findIndex(
      f => f.driveFileId === activeVideo.driveFileId
    );
    console.log('Current video index:', currentVideoIndex);

    // 2. Tìm video tiếp theo trong lesson hiện tại
    const videoFiles = activeLesson.files.filter(f => f.type?.includes('video'));
    const nextVideo = videoFiles[currentVideoIndex + 1];
    console.log('Next video in current lesson:', nextVideo);

    if (nextVideo) {
      console.log('Playing next video in current lesson');
      onLessonClick(activeLesson, activeChapter, nextVideo);
      return;
    }

    // 3. Nếu không có video tiếp theo, tìm lesson kế tiếp
    const currentLessonIndex = activeChapter.lessons.findIndex(
      l => l.id === activeLesson.id
    );
    console.log('Current lesson index:', currentLessonIndex);

    const nextLesson = activeChapter.lessons[currentLessonIndex + 1];
    console.log('Next lesson:', nextLesson);

    if (nextLesson) {
      // Tìm video đầu tiên trong lesson mới
      const firstVideo = nextLesson.files.find(f => f.type?.includes('video'));
      console.log('First video in next lesson:', firstVideo);

      if (firstVideo) {
        console.log('Moving to next lesson');
        setExpandedLessonId(nextLesson.id);
        onLessonClick(nextLesson, activeChapter, firstVideo);
      }
    } else {
      console.log('End of chapter reached');
      toast.success('Đã hoàn thành chương học!');
    }
  };

  useImperativeHandle(ref, () => ({
    handleVideoEnd
  }));

  const handleChapterClick = (index) => {
    if (expandedChapterIndex === index) {
      setExpandedChapterIndex(-1);
    } else {
      setExpandedChapterIndex(index);
    }
  };

  const handleLessonClick = (lesson, chapter) => {
    if (onLessonClick) {
      onLessonClick(lesson, chapter);
    }
    setExpandedLessonId(lesson.id);
  };

  const handleFileClick = (file) => {
    setActiveFileId(file.driveFileId);
    if (onLessonClick) {
      onLessonClick(activeLesson, activeChapter, file);
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
        key={index}
        className="flex items-center h-[40px] px-9 hover:bg-gray-100 transition-colors duration-150 ease-in-out border-l-[3px] border-transparent group cursor-pointer"
        onClick={() => handleFileClick(file)}
      >
        <div className="flex items-center w-full overflow-hidden">
          {/* Icon dựa vào type */}
          {file.type.includes("video") ? (
            <IoPlayCircleOutline className="w-4 h-4 text-gray-600 flex-shrink-0 mr-2" />
          ) : file.type.includes("pdf") ? (
            <IoDocumentOutline className="w-4 h-4 text-gray-600 flex-shrink-0 mr-2" />
          ) : (
            <IoLinkOutline className="w-4 h-4 text-gray-600 flex-shrink-0 mr-2" />
          )}

          <div className="flex-1 min-w-0">
            <span
              className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-150 ease-in-out truncate block"
              title={file.name} // Hiện full name khi hover
            >
              {file.name}
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
                      handleLessonClick(lesson, chapter);
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
});
