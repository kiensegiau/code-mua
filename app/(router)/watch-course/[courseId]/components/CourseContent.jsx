import React, { useState } from "react";

const CourseContent = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const introLessons = [
    {
      id: 1,
      title: "Giới thiệu khóa học",
      duration: "01:03",
      isActive: true,
    },
    {
      id: 2,
      title: "Cài đặt Dev - C++",
      duration: "02:31",
      isActive: false,
    },
    {
      id: 3,
      title: "Hướng dẫn sử dụng Dev - C++",
      duration: "03:33",
      isActive: false,
    },
  ];

  const chapters = [
    {
      id: 1,
      title: "Giới thiệu",
      lessons: "3 bài học",
    },
    {
      id: 2,
      title: "Biến và kiểu dữ liệu",
      lessons: "32 bài học",
    },
  ];

  const toggleChapter = (index) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  return (
    <div className="w-[381px] h-[664px] bg-white absolute top-0 left-0 overflow-hidden">
      <div className="w-[380px] h-[664px] bg-white absolute top-0 left-0 overflow-hidden">
        <span className="text-black font-semibold text-base absolute top-3 left-4">
          Nội dung khóa học
        </span>

        <div className="w-[380px] h-[618px] bg-[#F7F8FA] absolute top-[46px] left-0 overflow-hidden">
          {/* Phần bài giới thiệu */}
          {introLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`w-[372px] h-[54px] absolute left-0 overflow-hidden
                ${
                  lesson.isActive
                    ? "bg-[rgba(240,81,35,0.2)]"
                    : "bg-[rgba(231,231,231,0.6)]"
                }
              `}
              style={{ top: `${61 + index * 55}px` }}
            >
              {/* Play icon */}
              <div className="w-9 h-[34px] absolute top-[10px] right-[20px]">
                {lesson.isActive && (
                  <div className="w-[11px] h-[11px] absolute bottom-0 left-[30px] bg-[rgba(240,81,35,0.8)]" />
                )}
              </div>

              {/* Duration */}
              <span className="text-black text-[10px] absolute top-[31px] left-[47px]">
                {lesson.duration}
              </span>

              {/* Title */}
              <span
                className={`text-black absolute top-2 left-[30px] 
                ${lesson.isActive ? "font-semibold" : "font-normal"} text-sm`}
              >
                {lesson.title}
              </span>
            </div>
          ))}

          {/* Phần các chương */}
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="w-[372px] h-[61px] bg-[#F7F8FA] absolute left-0 overflow-hidden"
              style={{ top: `${225 + index * 61}px` }}
            >
              <span className="text-black font-semibold text-[15px] absolute top-2 left-5">
                {chapter.title}
              </span>
              <span className="text-[#29303B] text-xs absolute top-10 left-5">
                {chapter.lessons}
              </span>

              {/* Arrow icon */}
              <div className="w-4 h-4 absolute top-3 right-[47px]">
                <div className="w-3.5 h-2 bg-[#333333] absolute top-1 left-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
