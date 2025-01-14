"use client";
import React, { useState, useEffect } from "react";
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

function CoursePreview({ params }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    getCourseById();
  }, []);

  const getCourseById = async () => {
    try {
      const resp = await GlobalApi.getCourseById(params.courseId);
      setCourse(resp);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Không thể tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[#ff4d4f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-gray-400">Không tìm thấy khóa học</div>
      </div>
    );
  }

  const tabs = [{ id: "overview", label: "Thông tin" }];

  return (
    <div className="flex flex-col min-h-screen bg-[#141414]">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64">
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
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          py-2 px-6 font-medium text-sm transition-colors relative
                          ${
                            activeTab === tab.id
                              ? "text-[#ff4d4f] bg-[#ff4d4f]/10"
                              : "text-gray-400 hover:text-gray-200"
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === "overview" && (
                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-lg font-bold text-gray-200 mb-4">
                          Mô tả
                        </h2>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: course.description,
                          }}
                          className="text-gray-400 mb-8"
                        />
                      </div>
                    )}
                  </div>
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
                    <CourseEnrollSection
                      courseInfo={course}
                      onEnroll={handleEnrollCourse}
                      isEnrolling={enrolling}
                    />

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
