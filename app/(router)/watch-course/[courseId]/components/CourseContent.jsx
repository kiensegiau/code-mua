import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  IoBookOutline, // Icon cho chương
  IoPlayCircleOutline, // Icon cho bài học video
  IoDocumentOutline, // Icon cho tài liệu
  IoLinkOutline, // Icon cho links
} from "react-icons/io5";
import { toast } from "react-hot-toast";

export default forwardRef(
  (
    {
      chapters = [],
      onLessonClick,
      activeLesson,
      activeChapter,
      expandedChapterIndex,
      setExpandedChapterIndex,
      expandedLessonId,
      setExpandedLessonId,
      videoProgress,
      activeVideo,
    },
    ref
  ) => {
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

    // Xử lý khi video kết thúc
    const handleVideoEnd = () => {
      if (!activeLesson || !activeChapter || !activeVideo) {
        return;
      }

      // 1. Lấy danh sách video đã được sắp xếp trong lesson hiện tại
      const sortedVideoFiles = activeLesson.files
        .filter((f) => f.type?.includes("video"))
        .sort(sortFiles);

      // 2. Tìm vị trí video hiện tại trong danh sách đã sắp xếp
      const currentVideoIndex = sortedVideoFiles.findIndex(
        (f) => f.driveFileId === activeVideo.driveFileId
      );

      // 3. Lấy video tiếp theo trong lesson hiện tại
      const nextVideo = sortedVideoFiles[currentVideoIndex + 1];

      if (nextVideo) {
        return;
      }

      // 4. Nếu không có video tiếp theo trong lesson hiện tại, tìm lesson kế tiếp
      const sortedLessons = [...activeChapter.lessons].sort(sortByNumber);
      const currentLessonIndex = sortedLessons.findIndex(
        (l) => l.id === activeLesson.id
      );

      const nextLesson = sortedLessons[currentLessonIndex + 1];

      if (nextLesson) {
        // 5. Tìm video đầu tiên trong lesson mới (đã sắp xếp)
        const firstVideo = nextLesson.files
          .filter((f) => f.type?.includes("video"))
          .sort(sortFiles)[0];

        if (firstVideo) {
          setExpandedLessonId(nextLesson.id);
          onLessonClick(nextLesson, activeChapter, firstVideo);
        }
      } else {
        toast.success("Đã hoàn thành chương học!");
      }
    };

    useImperativeHandle(ref, () => ({
      handleVideoEnd,
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
      setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id);
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
      } else if (
        fileId.toLowerCase().includes("doc") ||
        fileId.includes("pdf")
      ) {
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
          className={`flex items-center h-[40px] px-9 hover:bg-gray-100 transition-all duration-200 ease-in-out border-l-[3px] 
          ${
            activeVideo?.driveFileId === file.driveFileId
              ? "border-l-[3px] border-[#f05123]"
              : "border-transparent hover:border-l-[3px] hover:border-gray-200"
          } group cursor-pointer`}
          onClick={() => handleFileClick(file)}
        >
          <div className="flex items-center w-full overflow-hidden">
            {/* Icon dựa vào type */}
            {file.type.includes("video") ? (
              <IoPlayCircleOutline
                className={`w-4 h-4 flex-shrink-0 mr-2 
                ${
                  activeVideo?.driveFileId === file.driveFileId
                    ? "text-[#f05123]"
                    : "text-gray-600"
                }`}
              />
            ) : file.type.includes("pdf") ? (
              <IoDocumentOutline className="w-4 h-4 text-gray-600 flex-shrink-0 mr-2" />
            ) : (
              <IoLinkOutline className="w-4 h-4 text-gray-600 flex-shrink-0 mr-2" />
            )}

            <div className="flex-1 min-w-0">
              <span
                className={`text-sm group-hover:text-gray-900 transition-colors duration-150 ease-in-out truncate block
                ${
                  activeVideo?.driveFileId === file.driveFileId
                    ? "text-[#f05123] font-medium"
                    : "text-gray-600"
                }`}
                title={file.name}
              >
                {file.name}
              </span>
            </div>
          </div>
        </div>
      ));
    };

    // Hàm helper để lấy số từ title
    const getNumberFromTitle = (text = "") => {
      // Tìm số ở đầu chuỗi hoặc sau dấu chấm
      const match = text.match(/(?:^|\.)?\s*(\d+)/);
      return match ? parseInt(match[1]) : 999999;
    };

    // Hàm sort cho chapters và lessons
    const sortByNumber = (a, b) => {
      const numA = getNumberFromTitle(a.title);
      const numB = getNumberFromTitle(b.title);
      return numA - numB;
    };

    // Hàm sort riêng cho files
    const sortFiles = (a, b) => {
      const numA = getNumberFromTitle(a.name);
      const numB = getNumberFromTitle(b.name);
      return numA - numB;
    };

    return (
      <div className="h-screen bg-white shadow-lg flex flex-col border-l border-gray-100">
        <div className="flex-none border-b border-gray-100 w-full">
          <div className="flex items-center w-full">
            <button
              className={`px-4 py-3 text-base font-medium relative w-full
              ${
                activeLesson
                  ? "text-[#f05123] border-b-2 border-[#f05123]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeLesson?.titlegg || "Nội dung khóa học"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-scroll">
          {chapters
            ?.slice() // Tạo bản sao của array
            .sort(sortByNumber)
            .map((chapter, index) => (
              <div
                key={chapter.id || `chapter-${index}`}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div
                  className="flex items-center h-[60px] px-5 bg-white cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out"
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

                {expandedChapterIndex === index && (
                  <div className="bg-white">
                    {[...(chapter.lessons || [])]
                      .sort((a, b) => {
                        return sortByNumber(a, b);
                      })
                      .map((lesson, lessonIndex) => (
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
                            className={`flex items-center h-[50px] px-7 cursor-pointer transition-all duration-200 ease-in-out group
                              ${
                                activeLesson?._id === lesson._id
                                  ? "bg-[rgba(240,81,35,0.08)] border-l-4 border-[#f05123]"
                                  : "bg-white hover:bg-[rgba(240,81,35,0.04)] hover:border-l-4 hover:border-[rgba(240,81,35,0.4)] border-l-4 border-transparent"
                              }`}
                          >
                            <div className="flex items-center w-full pointer-events-none min-w-0">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mr-3 transition-all duration-200
                                ${
                                  activeLesson?._id === lesson._id
                                    ? "bg-[rgba(240,81,35,0.1)]"
                                    : "bg-gray-100 group-hover:bg-[rgba(240,81,35,0.05)]"
                                }`}
                              >
                                <IoPlayCircleOutline
                                  className={`w-3.5 h-3.5 transition-colors duration-200
                                  ${
                                    activeLesson?._id === lesson._id
                                      ? "text-[#f05123]"
                                      : "text-gray-600 group-hover:text-[rgba(240,81,35,0.6)]"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-sm truncate transition-colors duration-200
                                ${
                                  activeLesson?._id === lesson._id
                                    ? "text-[#f05123] font-medium"
                                    : "text-gray-700 group-hover:text-[rgba(240,81,35,0.8)]"
                                }`}
                                title={lesson.title}
                              >
                                {truncateText(lesson.title)}
                              </span>
                            </div>
                          </div>
                          {expandedLessonId === lesson.id && lesson.files && (
                            <div className="bg-gray-50 py-1">
                              {renderFiles(
                                lesson.files.slice().sort(sortFiles)
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }
);
