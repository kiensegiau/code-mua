"use client";
import { useEffect } from "react";
import useEnrolledCourses from "@/app/_hooks/useEnrolledCourses";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Clock,
  Search,
  BarChart2,
  Trophy,
  Target,
  PlayCircle,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

// Lazy load CourseItem để tối ưu performance
const CourseItem = dynamic(() => import("../courses/_components/CourseItem"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800 h-full">
      <div className="aspect-video bg-gray-800 animate-pulse" />
      <div className="p-3 md:p-4">
        <div className="h-5 bg-gray-800 rounded animate-pulse mb-3" />
        <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3 mb-3" />
        <div className="flex justify-between mt-4">
          <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  ),
});

function MyCourses() {
  const coursesPerPage = 9;
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    selectedFilter,
    setSelectedFilter,
    currentPage,
    setCurrentPage,
    stats,
    getPaginatedCourses,
    filteredAndSortedCourses,
    refresh,
  } = useEnrolledCourses();

  const { totalCourses, completedCourses, inProgressCourses, averageProgress } =
    stats || {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      averageProgress: 0,
    };
  const { currentCourses, totalPages } = getPaginatedCourses(coursesPerPage);

  // Xử lý điều hướng trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Cuộn lên đầu danh sách khóa học
    window.scrollTo({
      top: document.getElementById("courses-grid")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] !pt-0">
      <div className="flex flex-1">
        <div className="flex-1 px-3 md:px-6 py-2 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-3 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-200">
                  Khóa học của tôi
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Quản lý và theo dõi tiến độ học tập của bạn
                </p>
              </div>

              {/* Refresh Button only */}
              <div className="hidden md:flex gap-2 items-center">
                <button
                  onClick={() => refresh()}
                  className="p-2 rounded-full bg-[#1f1f1f] border border-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Làm mới danh sách"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#ff4d4f]/10 rounded-lg">
                    <BookMarked className="w-5 h-5 text-[#ff4d4f]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tổng khóa học</p>
                    <p className="text-xl font-bold text-gray-200">
                      {loading ? (
                        <span className="inline-block w-8 h-6 bg-gray-800 animate-pulse rounded"></span>
                      ) : (
                        totalCourses
                      )}
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
                      {loading ? (
                        <span className="inline-block w-8 h-6 bg-gray-800 animate-pulse rounded"></span>
                      ) : (
                        completedCourses
                      )}
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
                      {loading ? (
                        <span className="inline-block w-8 h-6 bg-gray-800 animate-pulse rounded"></span>
                      ) : (
                        inProgressCourses
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tiến độ trung bình</p>
                    <p className="text-xl font-bold text-gray-200">
                      {loading ? (
                        <span className="inline-block w-8 h-6 bg-gray-800 animate-pulse rounded"></span>
                      ) : (
                        `${averageProgress}%`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Buttons for mobile - horizontal scrollable */}
            <div className="mb-3 md:hidden">
              <div className="flex overflow-x-auto pb-2 no-scrollbar">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedFilter === "all"
                        ? "bg-[#ff4d4f] text-white"
                        : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedFilter("in-progress")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedFilter === "in-progress"
                        ? "bg-[#ff4d4f] text-white"
                        : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                    }`}
                  >
                    Đang học
                  </button>
                  <button
                    onClick={() => setSelectedFilter("completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedFilter === "completed"
                        ? "bg-[#ff4d4f] text-white"
                        : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Sort for mobile */}
            <div className="flex flex-col gap-3 mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#1f1f1f] border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20 text-sm text-gray-200 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Filter Buttons & Sort Options for desktop */}
            <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex space-x-2">
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

              {/* Sort Options */}
              <div className="w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#1f1f1f] text-gray-400 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20"
                >
                  <option value="lastAccessed">Học gần đây nhất</option>
                  <option value="progress">Tiến độ</option>
                  <option value="title">Tên khóa học (A-Z)</option>
                  <option value="enrolledAt">Thời gian đăng ký</option>
                </select>
              </div>
            </div>
            
            {/* Search Bar for desktop */}
            <div className="hidden md:block mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#1f1f1f] border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]/20 text-sm text-gray-200 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Course Grid */}
            <div id="courses-grid">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800"
                    >
                      <div className="aspect-video bg-gray-800 animate-pulse" />
                      <div className="p-2 md:p-3">
                        <div className="h-4 bg-gray-800 rounded animate-pulse mb-2" />
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3 mb-2" />
                        <div className="flex justify-between mt-3">
                          <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                          <div className="h-3 bg-gray-800 rounded animate-pulse w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mb-4 text-red-500">
                    <div className="p-4 bg-red-500/10 rounded-full mx-auto w-16 h-16 flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>
                  <h3 className="text-gray-300 text-lg font-medium mb-2">
                    Không thể tải danh sách khóa học
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {error ||
                      "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau."}
                  </p>
                  <button
                    onClick={() => refresh()}
                    className="px-6 py-2 bg-[#ff4d4f] text-white rounded-full hover:bg-[#ff4d4f]/90 transition-colors text-sm md:text-base"
                  >
                    Thử lại
                  </button>
                </div>
              ) : filteredAndSortedCourses &&
                filteredAndSortedCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                    {currentCourses &&
                      currentCourses.map((course) => {
                        // Chuẩn bị dữ liệu cho CourseItem
                        const courseData = {
                          id: course.id,
                          title: course.title,
                          subname: "", // Bỏ mô tả ngắn
                          description: "", // Bỏ mô tả chi tiết
                          thumbnailUrl: course.thumbnailUrl,
                          price: 0, // Đã mua rồi
                          level: course.progress === 100 ? "Đã hoàn thành" : "Đang học",
                          totalLessons: course.lessons?.length || 0,
                          totalStudents: 0,
                          duration: course.duration || "99+",
                          teacher: course.teacher || "Hoc Mai",
                          progress: course.progress || 0,
                        };
                        
                        return (
                          <div 
                            key={course.id}
                            className="course-item-container enrolled-course"
                          >
                            <CourseItem course={courseData} />
                          </div>
                        );
                      })}
                  </div>

                  {/* Phân trang */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-8">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                          currentPage === 1
                            ? "text-gray-600 bg-gray-800/30 cursor-not-allowed"
                            : "text-gray-400 bg-[#1f1f1f] hover:text-gray-200 border border-gray-800"
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            currentPage === index + 1
                              ? "bg-[#ff4d4f] text-white"
                              : "bg-[#1f1f1f] text-gray-400 hover:text-gray-200 border border-gray-800"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                          currentPage === totalPages
                            ? "text-gray-600 bg-gray-800/30 cursor-not-allowed"
                            : "text-gray-400 bg-[#1f1f1f] hover:text-gray-200 border border-gray-800"
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
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
                    {searchQuery || selectedFilter !== "all"
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
    </div>
  );
}

export default MyCourses;
