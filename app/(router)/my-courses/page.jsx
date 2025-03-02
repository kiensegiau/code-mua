"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Search,
  BarChart2,
  Trophy,
  Target,
  PlayCircle,
  BookMarked,
} from "lucide-react";
import Image from "next/image";

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const courses = await GlobalApi.getEnrolledCourses(user.uid);
          setEnrolledCourses(courses);
          toast.success("Đã tải danh sách khóa học");
        } catch (error) {
          console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
          toast.error("Không thể tải danh sách khóa học");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "in-progress")
      return matchesSearch && course.progress < 100;
    if (selectedFilter === "completed")
      return matchesSearch && course.progress === 100;
    return matchesSearch;
  });

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100
  ).length;
  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (acc, course) => acc + (course.progress || 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#141414]">
      <div className="flex flex-1">
        <div className="flex-1 px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-200">
                  Khóa học của tôi
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Quản lý và theo dõi tiến độ học tập của bạn
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-[300px] rounded-full bg-[#1f1f1f] border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20 text-sm text-gray-200 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#ff4d4f]/10 rounded-lg">
                    <BookMarked className="w-5 h-5 text-[#ff4d4f]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tổng khóa học</p>
                    <p className="text-xl font-bold text-gray-200">
                      {totalCourses}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Đã hoàn thành</p>
                    <p className="text-xl font-bold text-gray-200">
                      {completedCourses}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Đang học</p>
                    <p className="text-xl font-bold text-gray-200">
                      {inProgressCourses}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tiến độ trung bình</p>
                    <p className="text-xl font-bold text-gray-200">
                      {averageProgress}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "all"
                    ? "bg-[#ff4d4f] text-white"
                    : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedFilter("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "in-progress"
                    ? "bg-[#ff4d4f] text-white"
                    : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                }`}
              >
                Đang học
              </button>
              <button
                onClick={() => setSelectedFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "completed"
                    ? "bg-[#ff4d4f] text-white"
                    : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                }`}
              >
                Đã hoàn thành
              </button>
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800"
                  >
                    <div className="aspect-video bg-gray-800 animate-pulse" />
                    <div className="p-4">
                      <div className="h-5 bg-gray-800 rounded animate-pulse mb-3" />
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3 mb-3" />
                      <div className="flex justify-between mt-4">
                        <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4" />
                        <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredCourses.map((course) => (
                  <Link
                    href={`/watch-course/${course.id}`}
                    key={course.id}
                    className="block group"
                  >
                    <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full flex flex-col">
                      <div className="relative">
                        <div className="relative aspect-video">
                          <Image
                            src={
                              course.thumbnailUrl || "/placeholder-image.jpg"
                            }
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                          <div
                            className="h-full bg-[#ff4d4f] transition-all duration-300"
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>

                        {course.progress === 100 ? (
                          <div className="absolute top-3 right-3 bg-green-500/90 text-white text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Hoàn thành</span>
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-blue-500/90 text-white text-xs px-2.5 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            <span>Đang học</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-4 flex flex-col">
                        <h3 className="font-semibold text-gray-200 text-lg mb-2 line-clamp-2 group-hover:text-[#ff4d4f] transition-colors">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.totalLessons} bài học</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-800">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-300">
                              Tiến độ
                            </span>
                            <span className="text-sm font-semibold text-[#ff4d4f]">
                              {course.progress || 0}%
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {course.lastAccessed
                                ? `Học gần đây: ${new Date(
                                    course.lastAccessed
                                  ).toLocaleDateString("vi-VN")}`
                                : "Chưa bắt đầu học"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Image
                    src="/empty-courses.png"
                    alt="No courses"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-gray-400 mb-4">
                  {searchQuery
                    ? "Không tìm thấy khóa học nào phù hợp"
                    : "Bạn chưa đăng ký khóa học nào"}
                </h3>
                <Link href="/courses">
                  <button className="px-6 py-2 bg-[#ff4d4f] text-white rounded-full hover:bg-[#ff4d4f]/90 transition-colors text-sm md:text-base">
                    Khám phá khóa học
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCourses;
