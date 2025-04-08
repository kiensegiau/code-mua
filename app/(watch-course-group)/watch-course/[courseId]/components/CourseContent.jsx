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
  IoFolderOutline,
  IoSchoolOutline,
  IoListOutline,
  IoFileTrayFullOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { getNumberFromTitle, sortByTitle, sortByName } from "../utils/sorting";

// Import Tippy với dynamic import để tránh SSR
const Tippy = dynamic(() => import("@tippyjs/react"), {
  ssr: false,
  loading: ({ children }) => <div key="tippy-loading">{children}</div>,
});

// Component hiển thị khi không có nội dung
const NoContent = memo(function NoContent() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <IoSchoolOutline className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Chưa có nội dung</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Khóa học này hiện chưa có nội dung hoặc đang được cập nhật. Vui lòng quay lại sau.
      </p>
    </div>
  );
});

// CSS sẽ được import ở phía client
const TippyStyles = () => {
  useEffect(() => {
    import("tippy.js/dist/tippy.css");
  }, []);
  return null;
};

// Component hiển thị file trong bài học
const FileItem = memo(function FileItem({ file, isActive, onClick }) {
  const isVideo = file.type === "video";
  const isDocument = file.type === "document";

  return (
    <div
      onClick={() => onClick(file)}
      className={`flex items-center h-[40px] px-14 cursor-pointer transition-all duration-200 ease-in-out group
        ${
          isActive
            ? "bg-purple-600/10 border-l-2 border-purple-400"
            : "hover:bg-gray-800/50 border-l-2 border-transparent hover:border-gray-600/50"
        }`}
    >
      <div className="flex items-center w-full min-w-0">
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-lg flex-shrink-0 mr-3 
            ${
              isActive
                ? "bg-purple-600/10"
                : "bg-gray-800 group-hover:bg-gray-700"
            }`}
        >
          {isVideo ? (
            <IoPlayCircleOutline
              className={`w-3 h-3 
                ${
                  isActive
                    ? "text-purple-300"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            />
          ) : isDocument ? (
            <IoDocumentOutline
              className={`w-3 h-3 
                ${
                  isActive
                    ? "text-purple-300"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            />
          ) : (
            <IoLinkOutline
              className={`w-3 h-3 
                ${
                  isActive
                    ? "text-purple-300"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            />
          )}
        </div>
        <span
          className={`text-sm truncate
              ${
                isActive
                  ? "text-white font-medium"
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

// Component thư mục con của thư mục con (subsubfolder)
const SubSubfolderItem = memo(function SubSubfolderItem({
  subsubfolder,
  isExpanded,
  toggleSubSubfolder,
  activeVideoId,
  onFileClick,
  sortFiles,
}) {
  // Sắp xếp files trong subsubfolder
  const sortedFiles = useMemo(() => {
    return subsubfolder.files ? [...subsubfolder.files].sort(sortFiles) : [];
  }, [subsubfolder.files, sortFiles]);

  // Kiểm tra xem có file nào trong subsubfolder đang active không
  const hasActiveFile = useMemo(() => {
    return (
      subsubfolder.files &&
      subsubfolder.files.some((file) => file.id === activeVideoId)
    );
  }, [subsubfolder.files, activeVideoId]);

  return (
    <div className="my-0.5 border-b border-gray-700/30">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSubSubfolder(subsubfolder.id);
        }}
        className={`flex items-center h-[45px] px-14 cursor-pointer transition-all duration-200 ease-in-out group
          ${
            isExpanded || hasActiveFile
              ? "border-l-2 border-amber-400"
              : "hover:bg-gray-800/50 border-l-2 border-transparent hover:border-gray-600/50"
          }`}
      >
        <div className="flex items-center w-full min-w-0">
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-lg flex-shrink-0 mr-3 
              ${
                isExpanded || hasActiveFile
                  ? "bg-amber-600/10"
                  : "bg-gray-800 group-hover:bg-gray-700/70"
              }`}
          >
            <IoFileTrayFullOutline
              className={`w-3 h-3 
                ${
                  isExpanded || hasActiveFile
                    ? "text-amber-300"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            />
          </div>
          <span
            className={`text-sm truncate transition-colors duration-200
                ${
                  isExpanded || hasActiveFile
                    ? "text-white font-medium"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            title={subsubfolder.name}
          >
            {subsubfolder.name}
          </span>
          <div className="ml-auto flex-shrink-0">
            {isExpanded ? (
              <IoChevronUp
                className={`w-4 h-4 ${
                  isExpanded || hasActiveFile
                    ? "text-amber-300"
                    : "text-gray-400"
                }`}
              />
            ) : (
              <IoChevronDown
                className={`w-4 h-4 ${
                  isExpanded || hasActiveFile
                    ? "text-amber-300"
                    : "text-gray-400"
                }`}
              />
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="bg-gray-800/10 py-1">
          {sortedFiles.map((file) => (
            <FileItem
              key={`subsubfolder-file-${file.id || file._id || Date.now()}`}
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

// Component thư mục con (subfolder)
const SubfolderItem = memo(function SubfolderItem({
  subfolder,
  isExpanded,
  toggleSubfolder,
  activeVideoId,
  onFileClick,
  sortFiles,
}) {
  // Sắp xếp files trong subfolder
  const sortedFiles = useMemo(() => {
    return subfolder.files ? [...subfolder.files].sort(sortFiles) : [];
  }, [subfolder.files, sortFiles]);

  // Thêm state để quản lý việc mở/đóng các subsubfolder
  const [expandedSubSubfolders, setExpandedSubSubfolders] = useState(() => {
    try {
      // Khôi phục trạng thái đã lưu nếu có
      const savedStateStr = localStorage.getItem(
        `expanded_subsubfolders_${subfolder.id}`
      );
      const savedState = savedStateStr ? JSON.parse(savedStateStr) : {};

      // Kiểm tra xem video hiện tại có trong subsubfolder nào không
      const lastWatchedSubSubfolderId = localStorage.getItem(
        "lastWatchedSubSubfolderId"
      );

      if (lastWatchedSubSubfolderId && subfolder.subfolders) {
        const hasSubSubfolder = subfolder.subfolders.some(
          (ssf) => ssf.id === lastWatchedSubSubfolderId
        );

        if (hasSubSubfolder) {
          // Đảm bảo CHỈ mở subsubfolder chứa video đang xem, đóng tất cả subsubfolder khác
          return { [lastWatchedSubSubfolderId]: true };
        }
      }

      // Nếu không có subsubfolder nào chứa video đang xem, giữ một subsubfolder mở (nếu có)
      const openedSubSubfolderIds = Object.entries(savedState)
        .filter(([_, isOpen]) => isOpen)
        .map(([id]) => id);

      if (openedSubSubfolderIds.length > 1) {
        // Chỉ giữ một subsubfolder mở (cái đầu tiên)
        return { [openedSubSubfolderIds[0]]: true };
      }

      return savedState;
    } catch (e) {
      return {};
    }
  });

  // Tự động mở subsubfolder chứa video đang active
  useEffect(() => {
    if (
      isExpanded &&
      activeVideoId &&
      subfolder.subfolders &&
      subfolder.subfolders.length > 0
    ) {
      // Tìm subsubfolder chứa video đang active
      let activeSubSubfolderId = null;

      for (const subsubfolder of subfolder.subfolders) {
        if (
          subsubfolder.files &&
          subsubfolder.files.some((file) => file.id === activeVideoId)
        ) {
          activeSubSubfolderId = subsubfolder.id;
          break;
        }
      }

      // Nếu tìm thấy subsubfolder chứa video đang active
      if (activeSubSubfolderId) {
        // Đóng tất cả các subsubfolder và chỉ mở subsubfolder chứa video đang active
        const newState = {
          [activeSubSubfolderId]: true,
        };

        setExpandedSubSubfolders(newState);

        // Lưu trạng thái
        try {
          localStorage.setItem(
            `expanded_subsubfolders_${subfolder.id}`,
            JSON.stringify(newState)
          );
          localStorage.setItem("lastWatchedSubSubfolderId", activeSubSubfolderId);
        } catch (e) {
          // console.error("Lỗi khi lưu trạng thái subsubfolder:", e);
        }
      }
    }
  }, [isExpanded, activeVideoId, subfolder.subfolders, subfolder.id]);

  // Lưu trạng thái khi expandedSubSubfolders thay đổi
  useEffect(() => {
    if (Object.keys(expandedSubSubfolders).length > 0) {
      try {
        localStorage.setItem(
          `expanded_subsubfolders_${subfolder.id}`,
          JSON.stringify(expandedSubSubfolders)
        );
      } catch (e) {
        // console.error("Lỗi khi lưu trạng thái subsubfolder:", e);
      }
    }
  }, [expandedSubSubfolders, subfolder.id]);

  // Hàm toggle subsubfolder
  const toggleSubSubfolder = useCallback(
    (subsubfolderId) => {
      setExpandedSubSubfolders((prev) => {
        // Kiểm tra xem subsubfolder hiện tại đã được mở chưa
        const isCurrentlyOpen = prev[subsubfolderId];

        // Nếu subsubfolder hiện tại đang đóng, thì mở nó và đóng tất cả các subsubfolder khác
        if (!isCurrentlyOpen) {
          // Đóng tất cả subsubfolder và chỉ mở subsubfolder được chọn
          const newState = {
            [subsubfolderId]: true,
          };

          // Lưu trạng thái
          try {
            localStorage.setItem(
              `expanded_subsubfolders_${subfolder.id}`,
              JSON.stringify(newState)
            );
          } catch (e) {
            // console.error("Lỗi khi lưu trạng thái subsubfolder:", e);
          }

          return newState;
        } else {
          // Nếu subsubfolder đang mở, thì chỉ đóng nó
          const newState = {
            ...prev,
            [subsubfolderId]: false,
          };

          // Lưu trạng thái
          try {
            localStorage.setItem(
              `expanded_subsubfolders_${subfolder.id}`,
              JSON.stringify(newState)
            );
          } catch (e) {
            // console.error("Lỗi khi lưu trạng thái subsubfolder:", e);
          }

          return newState;
        }
      });
    },
    [subfolder.id]
  );

  // Sắp xếp subsubfolders theo tên
  const sortedSubSubfolders = useMemo(() => {
    return subfolder.subfolders
      ? [...subfolder.subfolders].sort((a, b) => {
          const numA = getNumberFromTitle(a.name);
          const numB = getNumberFromTitle(b.name);
          return numA - numB;
        })
      : [];
  }, [subfolder.subfolders]);

  // Kiểm tra xem có file nào trong subfolder đang active không
  const hasActiveFile = useMemo(() => {
    if (subfolder.files && subfolder.files.some((file) => file.id === activeVideoId)) {
      return true;
    }
    
    // Kiểm tra trong các subsubfolder
    if (subfolder.subfolders) {
      for (const subsubfolder of subfolder.subfolders) {
        if (
          subsubfolder.files &&
          subsubfolder.files.some((file) => file.id === activeVideoId)
        ) {
          return true;
        }
      }
    }
    
    return false;
  }, [subfolder.files, subfolder.subfolders, activeVideoId]);

  return (
    <div className="my-0.5 border-b border-gray-700/30">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSubfolder(subfolder.id);
        }}
        className={`flex items-center h-[45px] px-10 cursor-pointer transition-all duration-200 ease-in-out group
          ${
            isExpanded || hasActiveFile
              ? "border-l-2 border-teal-400"
              : "hover:bg-gray-800/50 border-l-2 border-transparent hover:border-gray-600/50"
          }`}
      >
        <div className="flex items-center w-full min-w-0">
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-lg flex-shrink-0 mr-3 
              ${
                isExpanded || hasActiveFile
                  ? "bg-teal-600/10"
                  : "bg-gray-800 group-hover:bg-gray-700/70"
              }`}
          >
            <IoFolderOutline
              className={`w-3 h-3 
                ${
                  isExpanded || hasActiveFile
                    ? "text-teal-300"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            />
          </div>
          <span
            className={`text-sm truncate transition-colors duration-200
                ${
                  isExpanded || hasActiveFile
                    ? "text-white font-medium"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
            title={subfolder.name}
          >
            {subfolder.name}
          </span>
          <div className="ml-auto flex-shrink-0">
            {isExpanded ? (
              <IoChevronUp
                className={`w-4 h-4 ${
                  isExpanded || hasActiveFile
                    ? "text-teal-300"
                    : "text-gray-400"
                }`}
              />
            ) : (
              <IoChevronDown
                className={`w-4 h-4 ${
                  isExpanded || hasActiveFile
                    ? "text-teal-300"
                    : "text-gray-400"
                }`}
              />
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="bg-gray-800/10 py-1">
          {/* Hiển thị files trực tiếp của subfolder (nếu có) */}
          {sortedFiles.length > 0 &&
            sortedFiles.map((file) => (
              <FileItem
                key={`subfolder-file-${file.id || file._id || Date.now()}`}
                file={file}
                isActive={activeVideoId === file.id}
                onClick={onFileClick}
              />
            ))}

          {/* Hiển thị subsubfolders (nếu có) */}
          {sortedSubSubfolders.length > 0 &&
            sortedSubSubfolders.map((subsubfolder) => (
              <SubSubfolderItem
                key={`subsubfolder-${subsubfolder.id || Date.now()}`}
                subsubfolder={subsubfolder}
                isExpanded={!!expandedSubSubfolders[subsubfolder.id]}
                toggleSubSubfolder={toggleSubSubfolder}
                activeVideoId={activeVideoId}
                onFileClick={onFileClick}
                sortFiles={sortFiles}
              />
            ))}
        </div>
      )}
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
  getNumberFromTitle,
}) {
  // State để quản lý việc mở/đóng các subfolder
  const [expandedSubfolders, setExpandedSubfolders] = useState(() => {
    try {
      // Khôi phục trạng thái đã lưu nếu có
      const savedStateStr = localStorage.getItem(
        `expanded_subfolders_${lesson.id}`
      );
      const savedState = savedStateStr ? JSON.parse(savedStateStr) : {};

      // Kiểm tra xem video hiện tại có trong subfolder nào không
      const lastWatchedSubfolderId = localStorage.getItem(
        "lastWatchedSubfolderId"
      );

      if (lastWatchedSubfolderId && lesson.subfolders) {
        const hasSubfolder = lesson.subfolders.some(
          (sf) => sf.id === lastWatchedSubfolderId
        );

        if (hasSubfolder) {
          // Đảm bảo CHỈ mở subfolder chứa video đang xem, đóng tất cả subfolder khác
          return { [lastWatchedSubfolderId]: true };
        }
      }

      // Nếu không có subfolder nào chứa video đang xem, kiểm tra xem có nhiều hơn
      // một subfolder đang mở không và chỉ giữ một subfolder mở (nếu có)
      const openedSubfolderIds = Object.entries(savedState)
        .filter(([_, isOpen]) => isOpen)
        .map(([id]) => id);

      if (openedSubfolderIds.length > 1) {
        // Chỉ giữ một subfolder mở (cái đầu tiên)
        return { [openedSubfolderIds[0]]: true };
      }

      return savedState;
    } catch (e) {
      // console.error("Lỗi khi khôi phục trạng thái subfolder:", e);
      return {};
    }
  });

  // Tự động mở subfolder chứa video đang active
  useEffect(() => {
    if (
      isExpanded &&
      activeVideoId &&
      lesson.subfolders &&
      lesson.subfolders.length > 0
    ) {
      // Tìm subfolder chứa video đang active
      let activeSubfolderId = null;

      for (const subfolder of lesson.subfolders) {
        if (
          subfolder.files &&
          subfolder.files.some((file) => file.id === activeVideoId)
        ) {
          activeSubfolderId = subfolder.id;
          break;
        }
      }

      // Nếu tìm thấy subfolder chứa video đang active
      if (activeSubfolderId) {
        // Đóng tất cả các subfolder và chỉ mở subfolder chứa video đang active
        const newState = {
          [activeSubfolderId]: true,
        };

        setExpandedSubfolders(newState);

        // Lưu trạng thái
        try {
          localStorage.setItem(
            `expanded_subfolders_${lesson.id}`,
            JSON.stringify(newState)
          );
        } catch (e) {
          // console.error("Lỗi khi lưu trạng thái subfolder:", e);
        }
      }
    }
  }, [isExpanded, activeVideoId, lesson.subfolders, lesson.id]);

  // Lưu trạng thái khi expandedSubfolders thay đổi
  useEffect(() => {
    if (Object.keys(expandedSubfolders).length > 0) {
      try {
        localStorage.setItem(
          `expanded_subfolders_${lesson.id}`,
          JSON.stringify(expandedSubfolders)
        );
      } catch (e) {
        // console.error("Lỗi khi lưu trạng thái subfolder:", e);
      }
    }
  }, [expandedSubfolders, lesson.id]);

  // Hàm toggle subfolder
  const toggleSubfolder = useCallback(
    (subfolderId) => {
      setExpandedSubfolders((prev) => {
        // Kiểm tra xem subfolder hiện tại đã được mở chưa
        const isCurrentlyOpen = prev[subfolderId];

        // Nếu subfolder hiện tại đang đóng, thì mở nó và đóng tất cả các subfolder khác
        if (!isCurrentlyOpen) {
          // Đóng tất cả subfolder và chỉ mở subfolder được chọn
          const newState = {
            [subfolderId]: true,
          };

          // Lưu trạng thái
          try {
            localStorage.setItem(
              `expanded_subfolders_${lesson.id}`,
              JSON.stringify(newState)
            );
          } catch (e) {
            // console.error("Lỗi khi lưu trạng thái subfolder:", e);
          }

          return newState;
        } else {
          // Nếu subfolder đang mở, thì chỉ đóng nó
          const newState = {
            ...prev,
            [subfolderId]: false,
          };

          // Lưu trạng thái
          try {
            localStorage.setItem(
              `expanded_subfolders_${lesson.id}`,
              JSON.stringify(newState)
            );
          } catch (e) {
            // console.error("Lỗi khi lưu trạng thái subfolder:", e);
          }

          return newState;
        }
      });
    },
    [lesson.id]
  );

  // Hàm render files trong lesson
  const sortedFiles = useMemo(() => {
    return lesson.files ? [...lesson.files].sort(sortFiles) : [];
  }, [lesson.files, sortFiles]);

  // Sắp xếp subfolders theo tên
  const sortedSubfolders = useMemo(() => {
    return lesson.subfolders
      ? [...lesson.subfolders].sort((a, b) => {
          const numA = getNumberFromTitle(a.name);
          const numB = getNumberFromTitle(b.name);
          return numA - numB;
        })
      : [];
  }, [lesson.subfolders, getNumberFromTitle]);

  return (
    <div className="my-0.5 border-b border-gray-700/30">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLessonClick(lesson, chapter);
        }}
        className={`flex items-center h-[45px] px-7 cursor-pointer transition-all duration-200 ease-in-out group
          ${
            isActive || isExpanded
              ? "border-l-2 border-indigo-400"
              : "hover:bg-gray-800/50 border-l-2 border-transparent hover:border-gray-600/50"
          }`}
      >
        <div className="flex items-center w-full min-w-0">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mr-3 transition-all duration-200
            ${
              isActive || isExpanded
                ? "bg-indigo-600/10"
                : "bg-gray-800 group-hover:bg-gray-700/70"
            }`}
          >
            <IoListOutline
              className={`w-3.5 h-3.5 transition-colors duration-200
              ${
                isActive || isExpanded
                  ? "text-indigo-300"
                  : "text-gray-400 group-hover:text-gray-300"
              }`}
            />
          </div>
          <span
            className={`text-sm truncate transition-colors duration-200
              ${
                isActive || isExpanded
                  ? "text-white font-semibold"
                  : "text-gray-400 group-hover:text-gray-300"
              }`}
            title={lesson.title}
          >
            {lesson.title}
          </span>
          <div className="ml-auto flex-shrink-0">
            {isExpanded ? (
              <IoChevronUp
                className={`w-4 h-4 ${
                  isActive || isExpanded ? "text-indigo-300" : "text-gray-400"
                }`}
              />
            ) : (
              <IoChevronDown
                className={`w-4 h-4 ${
                  isActive || isExpanded ? "text-indigo-300" : "text-gray-400"
                }`}
              />
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="bg-gray-800/10 py-1">
          {/* Hiển thị files trực tiếp của lesson (nếu có) */}
          {sortedFiles.length > 0 &&
            sortedFiles.map((file) => (
              <FileItem
                key={`lesson-file-${file.id || file._id || Date.now()}`}
                file={file}
                isActive={activeVideoId === file.id}
                onClick={onFileClick}
              />
            ))}

          {/* Hiển thị subfolders (nếu có) */}
          {sortedSubfolders.length > 0 &&
            sortedSubfolders.map((subfolder) => (
              <SubfolderItem
                key={`subfolder-${subfolder.id || Date.now()}`}
                subfolder={subfolder}
                isExpanded={!!expandedSubfolders[subfolder.id]}
                toggleSubfolder={toggleSubfolder}
                activeVideoId={activeVideoId}
                onFileClick={onFileClick}
                sortFiles={sortFiles}
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
  getNumberFromTitle,
}) {
  // Sắp xếp bài học theo số
  const sortedLessons = useMemo(() => {
    return chapter.lessons ? [...chapter.lessons].sort(sortByNumber) : [];
  }, [chapter.lessons, sortByNumber]);

  return (
    <div className="border-b border-gray-700/50 last:border-b-0">
      <div
        className={`flex items-center h-[55px] px-5 cursor-pointer transition-all duration-200 ease-in-out
          ${
            isExpanded
              ? "border-l-2 border-blue-400"
              : "hover:bg-gray-800/50 border-l-2 border-transparent hover:border-gray-600/50"
          }`}
        onClick={() => onChapterClick(index)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mr-3 
            ${isExpanded ? "bg-blue-600/10" : "bg-gray-800"}`}
          >
            <IoBookOutline
              className={`w-4 h-4 ${
                isExpanded ? "text-blue-300" : "text-gray-400"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-[15px] font-medium mb-1 truncate
                  ${
                    isExpanded
                      ? "text-white font-semibold"
                      : "text-gray-300 font-medium"
                  }`}
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
          <IoChevronUp className="w-5 h-5 text-blue-300 flex-shrink-0" />
        ) : (
          <IoChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {isExpanded && (
        <div className="bg-gray-800/5">
          {sortedLessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={`lesson-${lesson.id || `${index}-${lessonIndex}`}`}
              lesson={lesson}
              chapter={chapter}
              isActive={activeLesson?._id === lesson._id}
              isExpanded={expandedLessonId === lesson.id}
              activeVideoId={activeVideoId}
              onLessonClick={onLessonClick}
              onFileClick={onFileClick}
              sortFiles={sortFiles}
              getNumberFromTitle={getNumberFromTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// Hàm helper để lấy tất cả video từ một lesson
const getAllVideosFromLesson = (lesson) => {
  let videos = [];

  // Lấy video từ files trực tiếp của lesson
  if (lesson.files) {
    videos.push(...lesson.files.filter(f => f.type?.includes("video")).map(file => ({
      ...file,
      source: { type: 'lesson', lessonId: lesson.id }
    })));
  }

  // Lấy video từ các subfolder
  if (lesson.subfolders) {
    lesson.subfolders.forEach(subfolder => {
      // Lấy video từ files trực tiếp của subfolder
      if (subfolder.files) {
        videos.push(...subfolder.files.filter(f => f.type?.includes("video")).map(file => ({
          ...file,
          source: { type: 'subfolder', lessonId: lesson.id, subfolderId: subfolder.id }
        })));
      }

      // Lấy video từ các subsubfolder
      if (subfolder.subfolders) {
        subfolder.subfolders.forEach(subsubfolder => {
          if (subsubfolder.files) {
            videos.push(...subsubfolder.files.filter(f => f.type?.includes("video")).map(file => ({
              ...file,
              source: { type: 'subsubfolder', lessonId: lesson.id, subfolderId: subfolder.id, subsubfolderId: subsubfolder.id }
            })));
          }
        });
      }
    });
  }

  return videos;
};

// Hàm helper để tìm folder chứa video
const findFolderContainingVideo = (lesson, videoId) => {
  // Kiểm tra trong files trực tiếp của lesson
  if (lesson.files?.some(f => f.id === videoId)) {
    return { subfolderId: null, subsubfolderId: null };
  }

  // Kiểm tra trong các subfolder
  for (const subfolder of lesson.subfolders || []) {
    // Kiểm tra trong files của subfolder
    if (subfolder.files?.some(f => f.id === videoId)) {
      return { subfolderId: subfolder.id, subsubfolderId: null };
    }

    // Kiểm tra trong các subsubfolder
    for (const subsubfolder of subfolder.subfolders || []) {
      if (subsubfolder.files?.some(f => f.id === videoId)) {
        return { subfolderId: subfolder.id, subsubfolderId: subsubfolder.id };
      }
    }
  }

  return { subfolderId: null, subsubfolderId: null };
};

// Hàm helper để tìm video tiếp theo
const findNextVideo = (currentVideo, currentLesson, currentChapter, chapters) => {
  // Lấy tất cả video từ lesson hiện tại
  const currentLessonVideos = getAllVideosFromLesson(currentLesson);
  currentLessonVideos.sort(sortFiles);

  // Tìm vị trí của video hiện tại
  const currentIndex = currentLessonVideos.findIndex(v => v.id === currentVideo.id);

  // Nếu có video tiếp theo trong lesson hiện tại
  if (currentIndex < currentLessonVideos.length - 1) {
    return {
      video: currentLessonVideos[currentIndex + 1],
      lesson: currentLesson,
      chapter: currentChapter
    };
  }

  // Nếu không có video tiếp theo trong lesson hiện tại, tìm lesson tiếp theo
  const currentChapterLessons = [...currentChapter.lessons].sort(sortByNumber);
  const currentLessonIndex = currentChapterLessons.findIndex(l => l.id === currentLesson.id);

  // Tìm trong các lesson còn lại của chapter hiện tại
  for (let i = currentLessonIndex + 1; i < currentChapterLessons.length; i++) {
    const nextLesson = currentChapterLessons[i];
    const nextLessonVideos = getAllVideosFromLesson(nextLesson);
    if (nextLessonVideos.length > 0) {
      return {
        video: nextLessonVideos[0],
        lesson: nextLesson,
        chapter: currentChapter
      };
    }
  }

  // Nếu không có lesson tiếp theo trong chapter hiện tại, tìm chapter tiếp theo
  const currentChapterIndex = chapters.findIndex(c => c.id === currentChapter.id);
  for (let i = currentChapterIndex + 1; i < chapters.length; i++) {
    const nextChapter = chapters[i];
    const nextChapterLessons = [...nextChapter.lessons].sort(sortByNumber);
    
    for (const nextLesson of nextChapterLessons) {
      const nextLessonVideos = getAllVideosFromLesson(nextLesson);
      if (nextLessonVideos.length > 0) {
        return {
          video: nextLessonVideos[0],
          lesson: nextLesson,
          chapter: nextChapter
        };
      }
    }
  }

  return null;
};

// Hàm helper để tìm video trước đó
const findPreviousVideo = (currentVideo, currentLesson, currentChapter, chapters) => {
  // Lấy tất cả video từ lesson hiện tại
  const currentLessonVideos = getAllVideosFromLesson(currentLesson);
  currentLessonVideos.sort(sortFiles);

  // Tìm vị trí của video hiện tại
  const currentIndex = currentLessonVideos.findIndex(v => v.id === currentVideo.id);

  // Nếu có video trước đó trong lesson hiện tại
  if (currentIndex > 0) {
    return {
      video: currentLessonVideos[currentIndex - 1],
      lesson: currentLesson,
      chapter: currentChapter
    };
  }

  // Nếu không có video trước đó trong lesson hiện tại, tìm lesson trước đó
  const currentChapterLessons = [...currentChapter.lessons].sort(sortByNumber);
  const currentLessonIndex = currentChapterLessons.findIndex(l => l.id === currentLesson.id);

  // Tìm trong các lesson trước đó của chapter hiện tại
  for (let i = currentLessonIndex - 1; i >= 0; i--) {
    const prevLesson = currentChapterLessons[i];
    const prevLessonVideos = getAllVideosFromLesson(prevLesson);
    if (prevLessonVideos.length > 0) {
      return {
        video: prevLessonVideos[prevLessonVideos.length - 1],
        lesson: prevLesson,
        chapter: currentChapter
      };
    }
  }

  // Nếu không có lesson trước đó trong chapter hiện tại, tìm chapter trước đó
  const currentChapterIndex = chapters.findIndex(c => c.id === currentChapter.id);
  for (let i = currentChapterIndex - 1; i >= 0; i--) {
    const prevChapter = chapters[i];
    const prevChapterLessons = [...prevChapter.lessons].sort(sortByNumber);
    
    for (let j = prevChapterLessons.length - 1; j >= 0; j--) {
      const prevLesson = prevChapterLessons[j];
      const prevLessonVideos = getAllVideosFromLesson(prevLesson);
      if (prevLessonVideos.length > 0) {
        return {
          video: prevLessonVideos[prevLessonVideos.length - 1],
          lesson: prevLesson,
          chapter: prevChapter
        };
      }
    }
  }

  return null;
};

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

    // Hàm sort cho chapters và lessons
    const sortByNumber = useCallback((a, b) => {
      return sortByTitle(a, b);
    }, []);

    // Hàm sort riêng cho files
    const sortFiles = useCallback((a, b) => {
      return sortByName(a, b);
    }, []);

    // Kiểm tra nếu không có nội dung khóa học hoặc chapters rỗng
    if (!chapters || chapters.length === 0) {
      return <NoContent />;
    }

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
        setExpandedChapterIndex(currentChapterIndex);
      }

      // Cập nhật expanded lesson nếu khác với giá trị hiện tại
      if (expandedLessonId !== activeLesson.id) {
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

      const nextVideo = findNextVideo(activeVideo, activeLesson, activeChapter, chapters);
      
      if (nextVideo) {
        // Lấy thông tin source của video tiếp theo
        const { source } = nextVideo.video;
        let subfolderId = null;
        let subsubfolderId = null;
        
        // Dựa vào source để xác định subfolderId và subsubfolderId
        if (source) {
          if (source.type === 'subfolder') {
            subfolderId = source.subfolderId;
          } else if (source.type === 'subsubfolder') {
            subfolderId = source.subfolderId;
            subsubfolderId = source.subsubfolderId;
          }
        }
        
        // Cập nhật trạng thái mở chapter và lesson
        const chapterIndex = chapters.findIndex(c => c.id === nextVideo.chapter.id);
        setExpandedChapterIndex(chapterIndex);
        setExpandedLessonId(nextVideo.lesson.id);
        
        // Lưu trạng thái vào localStorage
        try {
          localStorage.setItem("lastWatchedChapterId", nextVideo.chapter.id);
          localStorage.setItem("lastWatchedLessonId", nextVideo.lesson.id);
          localStorage.setItem("lastWatchedVideoId", nextVideo.video.id);
          
          // Lưu trạng thái subfolder và subsubfolder
          if (subfolderId) {
            localStorage.setItem("lastWatchedSubfolderId", subfolderId);
          }
          if (subsubfolderId) {
            localStorage.setItem("lastWatchedSubSubfolderId", subsubfolderId);
          }
          
          // Xử lý trạng thái mở của subfolder
          if (subfolderId) {
            const subfoldersState = { [subfolderId]: true };
            localStorage.setItem(`expanded_subfolders_${nextVideo.lesson.id}`, JSON.stringify(subfoldersState));
          }
          
          // Xử lý trạng thái mở của subsubfolder
          if (subfolderId && subsubfolderId) {
            const subsubfoldersState = { [subsubfolderId]: true };
            localStorage.setItem(`expanded_subsubfolders_${subfolderId}`, JSON.stringify(subsubfoldersState));
          }
        } catch (e) {
          console.error("Lỗi khi lưu trạng thái:", e);
        }

        // Chuyển đến video tiếp theo
        onLessonClick(nextVideo.lesson, nextVideo.chapter, nextVideo.video);
      } else {
        toast.success("Đã hoàn thành khóa học!");
      }
    }, [activeLesson, activeChapter, activeVideo, chapters, onLessonClick, setExpandedChapterIndex, setExpandedLessonId]);

    // Thêm hàm xử lý next video
    const handleNextVideo = useCallback(() => {
      if (!activeLesson || !activeChapter || !activeVideo) return;
      
      const nextVideo = findNextVideo(activeVideo, activeLesson, activeChapter, chapters);
      if (nextVideo) {
        // Lấy thông tin source của video tiếp theo
        const { source } = nextVideo.video;
        let subfolderId = null;
        let subsubfolderId = null;
        
        // Dựa vào source để xác định subfolderId và subsubfolderId
        if (source) {
          if (source.type === 'subfolder') {
            subfolderId = source.subfolderId;
          } else if (source.type === 'subsubfolder') {
            subfolderId = source.subfolderId;
            subsubfolderId = source.subsubfolderId;
          }
        }
        
        // Cập nhật trạng thái mở chapter và lesson
        const chapterIndex = chapters.findIndex(c => c.id === nextVideo.chapter.id);
        setExpandedChapterIndex(chapterIndex);
        setExpandedLessonId(nextVideo.lesson.id);
        
        // Lưu trạng thái vào localStorage
        try {
          localStorage.setItem("lastWatchedChapterId", nextVideo.chapter.id);
          localStorage.setItem("lastWatchedLessonId", nextVideo.lesson.id);
          localStorage.setItem("lastWatchedVideoId", nextVideo.video.id);
          
          // Lưu trạng thái subfolder và subsubfolder
          if (subfolderId) {
            localStorage.setItem("lastWatchedSubfolderId", subfolderId);
          }
          if (subsubfolderId) {
            localStorage.setItem("lastWatchedSubSubfolderId", subsubfolderId);
          }
          
          // Xử lý trạng thái mở của subfolder
          if (subfolderId) {
            const subfoldersState = { [subfolderId]: true };
            localStorage.setItem(`expanded_subfolders_${nextVideo.lesson.id}`, JSON.stringify(subfoldersState));
          }
          
          // Xử lý trạng thái mở của subsubfolder
          if (subfolderId && subsubfolderId) {
            const subsubfoldersState = { [subsubfolderId]: true };
            localStorage.setItem(`expanded_subsubfolders_${subfolderId}`, JSON.stringify(subsubfoldersState));
          }
        } catch (e) {
          console.error("Lỗi khi lưu trạng thái:", e);
        }
        
        onLessonClick(nextVideo.lesson, nextVideo.chapter, nextVideo.video);
      }
    }, [activeLesson, activeChapter, activeVideo, chapters, onLessonClick, setExpandedChapterIndex, setExpandedLessonId]);

    const handlePreviousVideo = useCallback(() => {
      if (!activeLesson || !activeChapter || !activeVideo) return;
      
      const prevVideo = findPreviousVideo(activeVideo, activeLesson, activeChapter, chapters);
      if (prevVideo) {
        // Lấy thông tin source của video trước đó
        const { source } = prevVideo.video;
        let subfolderId = null;
        let subsubfolderId = null;
        
        // Dựa vào source để xác định subfolderId và subsubfolderId
        if (source) {
          if (source.type === 'subfolder') {
            subfolderId = source.subfolderId;
          } else if (source.type === 'subsubfolder') {
            subfolderId = source.subfolderId;
            subsubfolderId = source.subsubfolderId;
          }
        }
        
        // Cập nhật trạng thái mở chapter và lesson
        const chapterIndex = chapters.findIndex(c => c.id === prevVideo.chapter.id);
        setExpandedChapterIndex(chapterIndex);
        setExpandedLessonId(prevVideo.lesson.id);
        
        // Lưu trạng thái vào localStorage
        try {
          localStorage.setItem("lastWatchedChapterId", prevVideo.chapter.id);
          localStorage.setItem("lastWatchedLessonId", prevVideo.lesson.id);
          localStorage.setItem("lastWatchedVideoId", prevVideo.video.id);
          
          // Lưu trạng thái subfolder và subsubfolder
          if (subfolderId) {
            localStorage.setItem("lastWatchedSubfolderId", subfolderId);
          }
          if (subsubfolderId) {
            localStorage.setItem("lastWatchedSubSubfolderId", subsubfolderId);
          }
          
          // Xử lý trạng thái mở của subfolder
          if (subfolderId) {
            const subfoldersState = { [subfolderId]: true };
            localStorage.setItem(`expanded_subfolders_${prevVideo.lesson.id}`, JSON.stringify(subfoldersState));
          }
          
          // Xử lý trạng thái mở của subsubfolder
          if (subfolderId && subsubfolderId) {
            const subsubfoldersState = { [subsubfolderId]: true };
            localStorage.setItem(`expanded_subsubfolders_${subfolderId}`, JSON.stringify(subsubfoldersState));
          }
        } catch (e) {
          console.error("Lỗi khi lưu trạng thái:", e);
        }
        
        onLessonClick(prevVideo.lesson, prevVideo.chapter, prevVideo.video);
      }
    }, [activeLesson, activeChapter, activeVideo, chapters, onLessonClick, setExpandedChapterIndex, setExpandedLessonId]);

    // Expose các hàm cho component cha
    useImperativeHandle(ref, () => ({
      handleVideoEnd,
      handleNextVideo,
      handlePreviousVideo
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
        <TippyStyles key="tippy-styles" />
        <div className="flex-none border-b border-gray-800 w-full">
          <div className="flex items-center w-full">
            <button
              key="course-content-button"
              className={`px-4 py-2.5 text-base font-medium relative w-full
              ${
                activeLesson
                  ? "text-gray-200 border-b-2 border-gray-600"
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
              key={`chapter-${chapter.id || index}`}
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
              getNumberFromTitle={getNumberFromTitle}
            />
          ))}
        </div>
      </div>
    );
  }
);

CourseContent.displayName = "CourseContent";

export default memo(CourseContent);
