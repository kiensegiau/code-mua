import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";

/**
 * Custom hook để quản lý danh sách khóa học đã đăng ký
 * @param {Object} options - Các tùy chọn cho hook
 * @param {boolean} options.autoFetch - Tự động lấy dữ liệu khi hook được gọi
 * @param {string} options.initialSortOption - Tùy chọn sắp xếp ban đầu
 * @param {string} options.initialFilter - Bộ lọc ban đầu
 * @returns {Object} - Các state và hàm xử lý cho danh sách khóa học
 */
export default function useEnrolledCourses(options = {}) {
  const {
    autoFetch = true,
    initialSortOption = "lastAccessed",
    initialFilter = "all",
  } = options;

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(initialSortOption);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const fetchEnrolledCourses = async (userId = user?.uid) => {
    if (!userId) {
      setError("Người dùng chưa đăng nhập");
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const courses = await GlobalApi.getEnrolledCourses(userId);

      // Chuẩn hóa dữ liệu và xử lý các trường bị thiếu
      const normalizedCourses = courses.map(course => {
        return {
          id: course.id || course.courseId || course._id,
          title: course.title || "Không có tiêu đề",
          description: course.description || "",
          imageUrl: course.imageUrl || course.coverImage || "/images/course-default.jpg",
          subject: course.subject || "Khác",
          grade: course.grade || "Khác",
          enrolledAt: course.enrolledAt ? new Date(course.enrolledAt) : new Date(),
          lastAccessed: course.lastAccessed ? new Date(course.lastAccessed) : new Date(),
          progress: course.progress || 0,
          type: course.type || "free",
          source: course.source || "hocmai"
        };
      });

      setEnrolledCourses(normalizedCourses || []);

      if (normalizedCourses && normalizedCourses.length > 0) {
        toast.success("Đã tải danh sách khóa học");
      }

      return normalizedCourses || [];
    } catch (error) {
      setError(error.message || "Không thể tải danh sách khóa học");
      toast.error("Không thể tải danh sách khóa học");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Tự động lấy dữ liệu khi component mount nếu có user
  useEffect(() => {
    if (autoFetch) {
      if (user?.uid) {
        fetchEnrolledCourses(user.uid);
      } else {
        // Nếu không có user, thì không còn loading nữa
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, autoFetch]);

  // Reset trang khi thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Các thống kê
  const stats = useMemo(() => {
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

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
    };
  }, [enrolledCourses]);

  // Sắp xếp và lọc khóa học
  const filteredAndSortedCourses = useMemo(() => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      return [];
    }

    const filtered = enrolledCourses.filter((course) => {
      if (!course || !course.title) return false;

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

    // Sắp xếp khóa học theo tùy chọn
    return [...filtered].sort((a, b) => {
      if (sortOption === "lastAccessed") {
        // Sắp xếp theo thời gian truy cập gần đây nhất (mới nhất lên đầu)
        const dateA = a.lastAccessed ? new Date(a.lastAccessed) : new Date(0);
        const dateB = b.lastAccessed ? new Date(b.lastAccessed) : new Date(0);
        return dateB - dateA;
      } else if (sortOption === "progress") {
        // Sắp xếp theo tiến độ (cao nhất lên đầu)
        return (b.progress || 0) - (a.progress || 0);
      } else if (sortOption === "title") {
        // Sắp xếp theo tên (A-Z)
        return (a.title || "").localeCompare(b.title || "");
      } else if (sortOption === "enrolledAt") {
        // Sắp xếp theo thời gian đăng ký (mới nhất lên đầu)
        const dateA = a.enrolledAt ? new Date(a.enrolledAt) : new Date(0);
        const dateB = b.enrolledAt ? new Date(b.enrolledAt) : new Date(0);
        return dateB - dateA;
      }
      return 0;
    });
  }, [enrolledCourses, searchQuery, selectedFilter, sortOption]);

  // Phân trang
  const getPaginatedCourses = (coursesPerPage) => {
    if (!filteredAndSortedCourses || filteredAndSortedCourses.length === 0) {
      return { currentCourses: [], totalPages: 0 };
    }

    const totalPages = Math.ceil(
      filteredAndSortedCourses.length / coursesPerPage
    );
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredAndSortedCourses.slice(
      startIndex,
      startIndex + coursesPerPage
    );

    return {
      currentCourses: paginatedCourses,
      totalPages: Math.max(1, totalPages),
    };
  };

  return {
    // State
    enrolledCourses,
    loading,
    error,
    searchQuery,
    sortOption,
    selectedFilter,
    currentPage,

    // Setters
    setSearchQuery,
    setSortOption,
    setSelectedFilter,
    setCurrentPage,

    // Computed values
    filteredAndSortedCourses,
    stats,

    // Methods
    fetchEnrolledCourses,
    getPaginatedCourses,

    // Utilities
    refresh: () => fetchEnrolledCourses(user?.uid),
    isEmpty: enrolledCourses.length === 0,
    hasFiltered: filteredAndSortedCourses.length !== enrolledCourses.length,
  };
}
