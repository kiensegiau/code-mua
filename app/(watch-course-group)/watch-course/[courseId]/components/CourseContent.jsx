import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  IoBookOutline,
  IoPlayCircleOutline,
  IoDocumentOutline,
  IoLinkOutline,
} from "react-icons/io5";
import { toast } from "sonner";

// Component hiển thị file trong bài học
const FileItem = memo(function FileItem({ file, isActive, onClick }) {
  const isVideo = file.type?.includes("video");
  const isDocument = file.type?.includes("document");

  return (
    <div
      onClick={() => onClick(file)}
      className={`flex items-center h-[40px] px-14 cursor-pointer transition-all duration-200 ease-in-out group hover:bg-gray-800/50`}
    >
      <div className="flex items-center w-full min-w-0">
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-lg flex-shrink-0 mr-3 bg-gray-800 group-hover:bg-[#ff4d4f]/5`}
        >
          {isVideo ? (
            <IoPlayCircleOutline
              className={`w-3 h-3 text-gray-400 group-hover:text-[#ff4d4f]/60`}
            />
          ) : isDocument ? (
            <IoDocumentOutline
              className={`w-3 h-3 text-gray-400 group-hover:text-[#ff4d4f]/60`}
            />
          ) : (
            <IoLinkOutline
              className={`w-3 h-3 text-gray-400 group-hover:text-[#ff4d4f]/60`}
            />
          )}
        </div>
        <span
          className={`text-sm truncate ${
            isActive
              ? "text-[#ff4d4f] font-medium"
              : "text-gray-400 group-hover:text-gray-300"
          }`}
          title={file.name}
        >
          {file.name}
        </span>
      </div>
    </div>
  );
});

// Component bài học
const LessonItem = memo(function LessonItem({
  lesson,
  chapter,
  isActive,
  isExpanded,
  activeVideoId,
  onLessonClick,
  onFileClick,
  sortFiles,
}) {
  // Hàm render files trong lesson
  const sortedFiles = useMemo(() => {
    return lesson.files ? [...lesson.files].sort(sortFiles) : [];
  }, [lesson.files, sortFiles]);

  return (
    <div className="my-1">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLessonClick(lesson, chapter);
        }}
        className={`flex items-center h-[50px] px-7 cursor-pointer transition-all duration-200 ease-in-out group
          ${
            isActive
              ? "bg-[#ff4d4f]/10 border-l-4 border-[#ff4d4f]"
              : "bg-[#1f1f1f] hover:bg-gray-800/50 hover:border-l-4 hover:border-[#ff4d4f]/40 border-l-4 border-transparent"
          }`}
      >
        <div className="flex items-center w-full pointer-events-none min-w-0">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mr-3 transition-all duration-200
            ${
              isActive
                ? "bg-[#ff4d4f]/10"
                : "bg-gray-800 group-hover:bg-[#ff4d4f]/5"
            }`}
          >
            <IoPlayCircleOutline
              className={`w-3.5 h-3.5 transition-colors duration-200
              ${
                isActive
                  ? "text-[#ff4d4f]"
                  : "text-gray-400 group-hover:text-[#ff4d4f]/60"
              }`}
            />
          </div>
          <span
            className={`text-sm truncate transition-colors duration-200
            ${
              isActive
                ? "text-[#ff4d4f] font-medium"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
            title={lesson.title}
          >
            {lesson.title}
          </span>
        </div>
      </div>
      {isExpanded && lesson.files && (
        <div className="bg-gray-800/30 py-1">
          {sortedFiles.map((file) => (
            <FileItem
              key={file.id || file._id}
              file={file}
              isActive={activeVideoId === file.id}
              onClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// Component chương
const ChapterItem = memo(function ChapterItem({
  chapter,
  index,
  isExpanded,
  activeLesson,
  expandedLessonId,
  activeVideoId,
  onChapterClick,
  onLessonClick,
  onFileClick,
  sortByNumber,
  sortFiles,
}) {
  // Sắp xếp bài học theo số
  const sortedLessons = useMemo(() => {
    return chapter.lessons ? [...chapter.lessons].sort(sortByNumber) : [];
  }, [chapter.lessons, sortByNumber]);

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <div
        className="flex items-center h-[60px] px-5 bg-[#1f1f1f] cursor-pointer hover:bg-gray-800/50 transition-all duration-200 ease-in-out"
        onClick={() => onChapterClick(index)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#ff4d4f]/10 flex-shrink-0 mr-3">
            <IoBookOutline className="w-4 h-4 text-[#ff4d4f]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="text-[15px] font-medium text-gray-200 mb-1 truncate"
              title={chapter.title}
            >
              {chapter.title}
            </h4>
            <p className="text-xs text-gray-500">
              {`${chapter.lessons?.length || 0} bài học`}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <IoChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <IoChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {isExpanded && (
        <div className="bg-[#1f1f1f]">
          {sortedLessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id || `lesson-${index}-${lessonIndex}`}
              lesson={lesson}
              chapter={chapter}
              isActive={activeLesson?._id === lesson._id}
              isExpanded={expandedLessonId === lesson.id}
              activeVideoId={activeVideoId}
              onLessonClick={onLessonClick}
              onFileClick={onFileClick}
              sortFiles={sortFiles}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const CourseContent = forwardRef(
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
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    // Thêm cờ để theo dõi hành động của người dùng
    const userActionRef = useRef(false);

    // Hàm helper để lấy số từ title
    const getNumberFromTitle = useCallback((text = "") => {
      const match = text.match(/(?:^|\.)?\s*(\d+)/);
      return match ? parseInt(match[1]) : 999999;
    }, []);

    // Hàm sort cho chapters và lessons
    const sortByNumber = useCallback(
      (a, b) => {
        const numA = getNumberFromTitle(a.title);
        const numB = getNumberFromTitle(b.title);
        return numA - numB;
      },
      [getNumberFromTitle]
    );

    // Hàm sort riêng cho files
    const sortFiles = useCallback(
      (a, b) => {
        const numA = getNumberFromTitle(a.name);
        const numB = getNumberFromTitle(b.name);
        return numA - numB;
      },
      [getNumberFromTitle]
    );

    // Thêm effect để tự động mở đúng chương và bài học khi video được chọn thay đổi
    // CHỈ khi không phải do người dùng trực tiếp click
    useEffect(() => {
      // Nếu mới khởi tạo hoặc đang trong hành động người dùng, bỏ qua
      if (
        !activeVideo ||
        !activeLesson ||
        !activeChapter ||
        userActionRef.current
      ) {
        return;
      }

      // Tìm index của chapter hiện tại trong danh sách chapters đã sắp xếp
      const sortedChapters = [...chapters].sort(sortByNumber);
      const currentChapterIndex = sortedChapters.findIndex(
        (c) => c.id === activeChapter.id
      );

      // Cập nhật expanded chapter nếu khác với giá trị hiện tại
      if (
        currentChapterIndex !== -1 &&
        expandedChapterIndex !== currentChapterIndex
      ) {
        console.log("Auto-expanding chapter:", currentChapterIndex);
        setExpandedChapterIndex(currentChapterIndex);
      }

      // Cập nhật expanded lesson nếu khác với giá trị hiện tại
      if (expandedLessonId !== activeLesson.id) {
        console.log("Auto-expanding lesson:", activeLesson.id);
        setExpandedLessonId(activeLesson.id);
      }

      // Reset cờ hành động người dùng sau khi effect hoàn thành
      userActionRef.current = false;
    }, [
      activeVideo,
      activeLesson,
      activeChapter,
      chapters,
      expandedChapterIndex,
      expandedLessonId,
      setExpandedChapterIndex,
      setExpandedLessonId,
      sortByNumber,
    ]);

    // Thêm effect xử lý cho trường hợp mới tải trang
    useEffect(() => {
      // Chỉ thực hiện 1 lần khi component được mount và có dữ liệu cần thiết
      if (
        isInitialLoad &&
        activeVideo &&
        activeLesson &&
        activeChapter &&
        chapters.length > 0
      ) {
        console.log("Initial page load - synchronizing course content view");

        // Tìm index của chapter hiện tại
        const sortedChapters = [...chapters].sort(sortByNumber);
        const currentChapterIndex = sortedChapters.findIndex(
          (c) => c.id === activeChapter.id
        );

        if (currentChapterIndex !== -1) {
          // Đặt timeout nhỏ để đảm bảo UI đã được render trước khi thay đổi trạng thái
          setTimeout(() => {
            setExpandedChapterIndex(currentChapterIndex);
            setExpandedLessonId(activeLesson.id);
          }, 100);
        }

        setIsInitialLoad(false);
      }
    }, [
      isInitialLoad,
      activeVideo,
      activeLesson,
      activeChapter,
      chapters,
      setExpandedChapterIndex,
      setExpandedLessonId,
      sortByNumber,
    ]);

    // Xử lý khi video kết thúc
    const handleVideoEnd = useCallback(() => {
      if (!activeLesson || !activeChapter || !activeVideo) {
        return;
      }

      // 1. Lấy danh sách video đã được sắp xếp trong lesson hiện tại
      const sortedVideoFiles = activeLesson.files
        .filter((f) => f.type?.includes("video"))
        .sort(sortFiles);

      // 2. Tìm vị trí video hiện tại trong danh sách đã sắp xếp
      const currentVideoIndex = sortedVideoFiles.findIndex(
        (f) => f.id === activeVideo.id
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
        // Tìm chapter tiếp theo
        const sortedChapters = chapters.sort(sortByNumber);
        const currentChapterIndex = sortedChapters.findIndex(
          (c) => c.id === activeChapter.id
        );

        const nextChapter = sortedChapters[currentChapterIndex + 1];
        if (nextChapter) {
          const firstLesson = nextChapter.lessons.sort(sortByNumber)[0];
          if (firstLesson) {
            const firstVideo = firstLesson.files
              .filter((f) => f.type?.includes("video"))
              .sort(sortFiles)[0];

            if (firstVideo) {
              setExpandedChapterIndex(currentChapterIndex + 1);
              setExpandedLessonId(firstLesson.id);
              onLessonClick(firstLesson, nextChapter, firstVideo);
              return;
            }
          }
        }
        toast.success("Đã hoàn thành khóa học!");
      }
    }, [
      activeLesson,
      activeChapter,
      activeVideo,
      chapters,
      onLessonClick,
      setExpandedChapterIndex,
      setExpandedLessonId,
      sortByNumber,
      sortFiles,
    ]);

    useImperativeHandle(ref, () => ({
      handleVideoEnd,
    }));

    const handleChapterClick = useCallback(
      (index) => {
        // Đánh dấu đây là hành động của người dùng
        userActionRef.current = true;

        if (expandedChapterIndex === index) {
          setExpandedChapterIndex(-1);
        } else {
          setExpandedChapterIndex(index);
        }
      },
      [expandedChapterIndex, setExpandedChapterIndex]
    );

    const handleLessonClick = useCallback(
      (lesson, chapter) => {
        // Đánh dấu đây là hành động của người dùng
        userActionRef.current = true;

        if (onLessonClick) {
          onLessonClick(lesson, chapter);
        }
        setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id);
      },
      [onLessonClick, expandedLessonId, setExpandedLessonId]
    );

    const handleFileClick = useCallback(
      (file) => {
        // Đánh dấu đây là hành động của người dùng
        userActionRef.current = true;

        if (file.type?.includes("video")) {
          setActiveFileId(file.id || file._id);
        } else {
          setActiveFileId(null);
        }

        if (onLessonClick) {
          onLessonClick(activeLesson, activeChapter, file);
        }
      },
      [activeLesson, activeChapter, onLessonClick]
    );

    // Sắp xếp các chương
    const sortedChapters = useMemo(() => {
      return chapters ? [...chapters].sort(sortByNumber) : [];
    }, [chapters, sortByNumber]);

    return (
      <div className="h-full bg-[#1f1f1f] shadow-lg flex flex-col border-l border-gray-800">
        <div className="flex-none border-b border-gray-800 w-full">
          <div className="flex items-center w-full">
            <button
              className={`px-4 py-2.5 text-base font-medium relative w-full
              ${
                activeLesson
                  ? "text-[#ff4d4f] border-b-2 border-[#ff4d4f]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {activeLesson?.titlegg || "Nội dung khóa học"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pb-4 custom-scrollbar">
          {sortedChapters.map((chapter, index) => (
            <ChapterItem
              key={chapter.id || `chapter-${index}`}
              chapter={chapter}
              index={index}
              isExpanded={expandedChapterIndex === index}
              activeLesson={activeLesson}
              expandedLessonId={expandedLessonId}
              activeVideoId={activeVideo?.id}
              onChapterClick={handleChapterClick}
              onLessonClick={handleLessonClick}
              onFileClick={handleFileClick}
              sortByNumber={sortByNumber}
              sortFiles={sortFiles}
            />
          ))}
        </div>
      </div>
    );
  }
);

CourseContent.displayName = "CourseContent";

export default memo(CourseContent);
