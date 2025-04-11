import React, { useState, useEffect, useCallback, memo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import { useAuth } from "@/app/_context/AuthContext";

function CourseContentSection({
  courseInfo,
  isUserAlreadyEnrolled,
  watchMode,
  setActiveLesson,
}) {
  const { profile } = useAuth();
  const [activeChapterIndex, setActiveChapterIndex] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  
  // Kiểm tra người dùng có VIP không
  const isUserVip = React.useMemo(() => {
    if (!profile) return false;
    
    // Kiểm tra trạng thái VIP và thời hạn
    const isVip = profile?.isVip === true;
    const hasValidExpiration = profile?.vipExpiresAt && new Date(profile.vipExpiresAt) > new Date();
    
    return isVip && hasValidExpiration;
  }, [profile]);

  // Thiết lập ban đầu khi courseInfo thay đổi
  useEffect(() => {
    if (courseInfo && courseInfo.chapters && courseInfo.chapters.length > 0) {
      setActiveChapterIndex(0);
      if (
        courseInfo.chapters[0].lessons &&
        courseInfo.chapters[0].lessons.length > 0
      ) {
        handleLessonClick(0, courseInfo.chapters[0].lessons[0]);
      }
    }
  }, [courseInfo]);

  // Sử dụng useCallback để tối ưu hóa hàm
  const getLessonData = useCallback(async (courseId, chapterId, lessonId) => {
    try {
      const lessonRef = doc(
        db,
        "courses",
        courseId,
        "chapters",
        chapterId,
        "lessons",
        lessonId
      );
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        return lessonSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học:", error);
      return null;
    }
  }, []);

  // Xử lý khi click vào bài học
  const handleLessonClick = useCallback(
    async (chapterIndex, lesson) => {
      setActiveChapterIndex(chapterIndex);
      setActiveLessonId(lesson.id);

      const fullLessonData = await getLessonData(
        courseInfo.id,
        courseInfo.chapters[chapterIndex].id,
        lesson.id
      );

      if (
        fullLessonData &&
        fullLessonData.files &&
        fullLessonData.files.length > 0
      ) {
        const videoFile = fullLessonData.files.find((file) =>
          file.type.startsWith("video/")
        );
        if (videoFile) {
          setActiveLesson({
            ...lesson,
            videoUrl: videoFile.firebaseUrl || videoFile.driveUrl,
          });
        } else {
          setActiveLesson(lesson);
        }
      } else {
        setActiveLesson(lesson);
      }
    },
    [courseInfo, getLessonData, setActiveLesson]
  );

  // Kiểm tra xem lesson có bị khóa không (cập nhật để tính đến người dùng VIP)
  const isLessonLocked = useCallback(
    (lesson) => {
      // Người dùng VIP có thể xem tất cả bài học
      if (isUserVip) return false;
      
      return !isUserAlreadyEnrolled && !lesson?.isFree;
    },
    [isUserAlreadyEnrolled, isUserVip]
  );

  // Đếm tổng số bài học
  const totalLessons = React.useMemo(() => {
    if (!courseInfo?.chapters) return 0;
    return courseInfo.chapters.reduce((total, chapter) => {
      return total + (chapter.lessons?.length || 0);
    }, 0);
  }, [courseInfo?.chapters]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Nội dung khóa học</h3>
        <div className="text-sm text-gray-400">
          {courseInfo?.chapters?.length || 0} chương • {totalLessons} bài học
        </div>
      </div>
      
      {isUserVip && !isUserAlreadyEnrolled && (
        <div className="mb-4 p-2 bg-gradient-to-r from-[#ffd700]/20 to-[#ffa500]/20 border border-[#ffd700]/40 rounded-md">
          <p className="text-[#ffd700] font-medium text-center">
            Bạn có thể xem tất cả bài học với tài khoản VIP
          </p>
        </div>
      )}

      <div className="space-y-4">
        {courseInfo?.chapters?.map((chapter, chapterIndex) => (
          <div
            key={chapter.id}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="bg-[#222] p-4">
              <h4 className="font-medium">
                {chapter.order}. {chapter.title}
              </h4>
              <div className="text-sm text-gray-400 mt-1">
                {chapter.lessons?.length || 0} bài học
              </div>
            </div>

            <div className="divide-y divide-gray-700">
              {chapter.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() =>
                    !isLessonLocked(lesson) &&
                    handleLessonClick(chapterIndex, lesson)
                  }
                  className={`p-4 flex justify-between items-center ${
                    activeLessonId === lesson.id
                      ? "bg-blue-900/30"
                      : "hover:bg-[#222]"
                  } ${
                    isLessonLocked(lesson)
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {isLessonLocked(lesson) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      ) : lesson.isCompleted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <span className="text-sm">{lesson.order}</span>
                      )}
                    </div>
                    <span className="ml-3">{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                        Miễn phí
                      </span>
                    )}
                    {isUserVip && !lesson.isFree && !isUserAlreadyEnrolled && (
                      <span className="ml-2 text-xs bg-[#ffd700]/30 text-[#ffd700] px-2 py-0.5 rounded">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lesson.duration || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CourseContentSection);
