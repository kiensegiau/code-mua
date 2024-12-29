import React, { useState, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function CourseContent({
  chapters = [],
  onLessonClick,
  activeLesson,
  activeChapter,
}) {
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);

  useEffect(() => {
    if (activeLesson && chapters) {
      const activeChapterIndex = chapters.findIndex((chapter) =>
        chapter.lessons?.some((lesson) => lesson._id === activeLesson._id)
      );
      if (activeChapterIndex !== -1) {
        setExpandedChapterIndex(activeChapterIndex);
      }
    }
  }, [activeLesson?._id, chapters]);

  const handleChapterClick = (index) => {
    setExpandedChapterIndex(expandedChapterIndex === index ? null : index);
  };

  const handleLessonClick = (lesson, chapter, chapterIndex) => {
    setExpandedChapterIndex(chapterIndex);
    if (onLessonClick) {
      onLessonClick(lesson, chapter);
    }
  };

  return (
    <div className="main-container w-[380.39px] h-screen bg-white relative mx-auto my-0">
      <h3 className="text-base font-semibold text-black px-4 py-2">
        Nội dung khóa học
      </h3>
      <div className="w-full h-[calc(100vh-40px)] relative overflow-auto">
        {chapters?.map((chapter, index) => (
          <div key={chapter._id || `chapter-${index}`}>
            <div
              className="flex items-center px-5 py-2 bg-[#f7f8fa] cursor-pointer hover:bg-gray-100"
              onClick={() => handleChapterClick(index)}
            >
              <div className="flex-1">
                <h4 className="text-[15px] font-medium text-gray-900 mb-1">
                  {chapter.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {`${chapter.completedLessons || 0}/${
                    chapter.lessons?.length || 0
                  } | ${chapter.duration || "00:00"}`}
                </p>
              </div>
              {expandedChapterIndex === index ? (
                <IoChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <IoChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {expandedChapterIndex === index &&
              chapter.lessons?.map((lesson, lessonIndex) => (
                <div
                  key={lesson._id || `lesson-${index}-${lessonIndex}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLessonClick(lesson, chapter, index);
                  }}
                  className={`flex items-center px-7 py-2 cursor-pointer ${
                    activeLesson?._id === lesson._id
                      ? "bg-[rgba(240,81,35,0.1)] border-l-4 border-[#f05123]"
                      : "bg-[#f9f9f9] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-1 pointer-events-none">
                    <h5 className="text-[14px] text-gray-900 mb-0.5">
                      {lesson.title}
                    </h5>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">
                        {lesson.duration || "00:00"}
                      </span>
                      {lesson.completed && (
                        <span className="text-xs font-medium text-green-600 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                          >
                            <path d="M4 8l-2-2 1-1 1 1 3-3 1 1z" />
                          </svg>
                          Đã hoàn thành
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
