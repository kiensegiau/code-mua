"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PlayCircle,
  Clock,
  BookOpen,
  Users,
  Target,
  CheckCircle,
} from "lucide-react";
import Header from "../../_components/Header";
import Sidebar from "../../_components/SideNav";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import CourseEnrollSection from "./_components/CourseEnrollSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import CourseContentSection from "./_components/CourseContentSection";

function CoursePreview({ params }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeLesson, setActiveLesson] = useState(null);

  // Tải dữ liệu khóa học
  const getCourseById = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await GlobalApi.getCourseById(params.courseId);
      setCourse(resp);
    } catch (error) {
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  useEffect(() => {
    getCourseById();
  }, [getCourseById]);

  // Kiểm tra người dùng đã đăng ký khóa học chưa
  const isUserEnrolled = useMemo(() => {
    if (!user || !profile?.enrolledCourses || !course?.id) return false;

    return profile.enrolledCourses.some((c) =>
      typeof c === "string" ? c === course.id : c.courseId === course.id
    );
  }, [user, profile?.enrolledCourses, course?.id]);

  // Xử lý chuyển tab
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleEnrollCourse = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      setEnrolling(true);

      // Kiểm tra số dư
      if (course.price > (profile?.balance || 0)) {
        toast.error("Số dư không đủ để mua khóa học này");
        return;
      }

      // Cập nhật số dư của user
      const newBalance = profile.balance - course.price;
      const userDocRef = doc(db, "users", profile.id);

      // Kiểm tra xem khóa học đã được mua chưa
      if (profile?.enrolledCourses?.some((c) => c.courseId === course.id)) {
        toast.error("Bạn đã đăng ký khóa học này rồi");
        return;
      }

      await updateDoc(userDocRef, {
        balance: newBalance,
        enrolledCourses: arrayUnion({
          courseId: course.id,
          enrolledAt: new Date().toISOString(),
          price: course.price,
          title: course.title,
          coverImage: course.coverImage,
        }),
      });

      // Cập nhật số lượng học viên của khóa học
      const courseDocRef = doc(db, "courses", course.id);
      const courseDoc = await getDoc(courseDocRef);
      if (courseDoc.exists()) {
        await updateDoc(courseDocRef, {
          totalStudents: (courseDoc.data().totalStudents || 0) + 1,
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success("Đăng ký khóa học thành công!");
      router.push(`/watch-course/${course.id}`);
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error("Có lỗi xảy ra khi đăng ký khóa học");
    } finally {
      setEnrolling(false);
    }
  };

  // Render skeleton loading
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-800 rounded-lg mb-8"></div>
      <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-3/4 mb-6"></div>
        </div>
        <div>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  // Nội dung tab Overview
  const renderOverview = useCallback(
    () => (
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Giới thiệu về khóa học</h3>
          <div className="prose prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: course?.description || "" }}
            />
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Bạn sẽ học được gì</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course?.outcomes?.map((outcome, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Yêu cầu</h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            {course?.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
    [course]
  );

  // Nội dung tab Content
  const renderContent = useCallback(
    () => (
      <CourseContentSection
        courseInfo={course}
        isUserAlreadyEnrolled={isUserEnrolled}
        setActiveLesson={setActiveLesson}
      />
    ),
    [course, isUserEnrolled]
  );

  // Nội dung tab Instructor
  const renderInstructor = useCallback(
    () => (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Giảng viên</h3>
        {course?.instructor && (
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 relative rounded-full overflow-hidden">
              <Image
                src={
                  course.instructor.avatar || "/avatars/instructor-default.jpg"
                }
                alt={course.instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold">
                {course.instructor.name}
              </h4>
              <p className="text-gray-400">{course.instructor.title}</p>
              <div className="mt-2 flex items-center space-x-4">
                <div>
                  <span className="font-bold">
                    {course.instructor.coursesCount || 0}
                  </span>
                  <span className="text-gray-400 ml-1">khóa học</span>
                </div>
                <div>
                  <span className="font-bold">
                    {course.instructor.studentsCount || 0}
                  </span>
                  <span className="text-gray-400 ml-1">học viên</span>
                </div>
                <div>
                  <span className="font-bold">
                    {course.instructor.rating || 0}
                  </span>
                  <span className="text-gray-400 ml-1">đánh giá</span>
                </div>
              </div>
              <p className="mt-3">{course.instructor.bio}</p>
            </div>
          </div>
        )}
      </div>
    ),
    [course]
  );

  // Nội dung tab Reviews
  const renderReviews = useCallback(
    () => (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Đánh giá</h3>
        {course?.reviews && course.reviews.length > 0 ? (
          <div className="space-y-4">
            {course.reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-700 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <Image
                        src={review.avatar || "/avatars/student-default.jpg"}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="text-sm text-gray-400">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-2">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            Chưa có đánh giá nào cho khóa học này.
          </p>
        )}
      </div>
    ),
    [course]
  );

  // Render tab content basaed on active tab
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "content":
        return renderContent();
      case "instructor":
        return renderInstructor();
      case "reviews":
        return renderReviews();
      default:
        return renderOverview();
    }
  }, [
    activeTab,
    renderOverview,
    renderContent,
    renderInstructor,
    renderReviews,
  ]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">{renderSkeleton()}</div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
        <p className="mb-6">
          Khóa học bạn đang tìm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => router.push("/courses")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách khóa học
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex flex-1">
        <div className="hidden  w-64">
          <Sidebar />
        </div>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Course Title & Stats */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-200 mb-4">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Mức độ: {course.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Thời lượng: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Số lượng: {course.totalLessons} video</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Lượt xem: {course.enrollments || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
                  <div className="flex border-b border-gray-800">
                    <button
                      onClick={() => handleTabChange("overview")}
                      className={`
                        py-2 px-6 font-medium text-sm transition-colors relative
                        ${
                          activeTab === "overview"
                            ? "text-[#ff4d4f] bg-[#ff4d4f]/10"
                            : "text-gray-400 hover:text-gray-200"
                        }
                      `}
                    >
                      Tổng quan
                    </button>
                    <button
                      onClick={() => handleTabChange("content")}
                      className={`
                        py-2 px-6 font-medium text-sm transition-colors relative
                        ${
                          activeTab === "content"
                            ? "text-[#ff4d4f] bg-[#ff4d4f]/10"
                            : "text-gray-400 hover:text-gray-200"
                        }
                      `}
                    >
                      Nội dung
                    </button>
                    <button
                      onClick={() => handleTabChange("instructor")}
                      className={`
                        py-2 px-6 font-medium text-sm transition-colors relative
                        ${
                          activeTab === "instructor"
                            ? "text-[#ff4d4f] bg-[#ff4d4f]/10"
                            : "text-gray-400 hover:text-gray-200"
                        }
                      `}
                    >
                      Giảng viên
                    </button>
                    <button
                      onClick={() => handleTabChange("reviews")}
                      className={`
                        py-2 px-6 font-medium text-sm transition-colors relative
                        ${
                          activeTab === "reviews"
                            ? "text-[#ff4d4f] bg-[#ff4d4f]/10"
                            : "text-gray-400 hover:text-gray-200"
                        }
                      `}
                    >
                      Đánh giá
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">{renderTabContent()}</div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 lg:sticky lg:top-[80px] h-fit">
                <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
                  {/* Course Preview Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={
                        course.previewImageUrl || "/default-course-preview.jpg"
                      }
                      alt={course.title}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#ff4d4f]/10 transition-colors">
                        <PlayCircle className="w-8 h-8 text-[#ff4d4f]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <CourseEnrollSection courseInfo={course} />

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Truy cập trọn đời</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Giáo trình chi tiết</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Bài tập thực hành</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-5 h-5 text-[#ff4d4f]" />
                        <span>Chứng chỉ hoàn thành</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePreview;
