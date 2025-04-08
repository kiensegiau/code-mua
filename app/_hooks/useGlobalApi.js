"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GlobalApi from "@/app/_utils/GlobalApi";
import React from "react";

export function useCourseList(options = {}) {
  return useQuery({
    queryKey: ["courses", options],
    queryFn: () => GlobalApi.getAllCourseList(options),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useUserProfile(userId) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => GlobalApi.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEnrolledCourses(userId) {
  return useQuery({
    queryKey: ["enrolledCourses", userId],
    queryFn: () => GlobalApi.getEnrolledCourses(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCourseDetails(courseId) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => GlobalApi.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  });
}

// Hook mới để kết hợp danh sách tất cả khóa học với trạng thái đăng ký
export function useCoursesWithEnrollmentStatus(userId, options = {}) {
  // Lấy danh sách tất cả khóa học
  const { data: allCourses, isLoading: isLoadingCourses } = useCourseList(options);
  
  // Lấy danh sách khóa học đã đăng ký
  const { data: enrolledCoursesData, isLoading: isLoadingEnrollments } = useEnrolledCourses(userId);
  
  // Lấy thông tin người dùng
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(userId);
  
  // Xử lý dữ liệu khi tất cả đã tải xong
  const processedData = React.useMemo(() => {
    if (!allCourses || !allCourses.courses) return { courses: [], isLoading: true };
    
    // Lấy danh sách ID khóa học đã đăng ký
    const enrolledCourseIds = new Set();
    
    // Thêm từ danh sách enrolledCourses từ API
    if (enrolledCoursesData && enrolledCoursesData.courses) {
      enrolledCoursesData.courses.forEach(course => {
        enrolledCourseIds.add(course.courseId.toString());
      });
    }
    
    // Thêm từ thông tin người dùng (legacy)
    if (userProfile && userProfile.enrolledCourses) {
      userProfile.enrolledCourses.forEach(course => {
        const courseId = typeof course === 'string' ? course : course.courseId;
        if (courseId) enrolledCourseIds.add(courseId.toString());
      });
    }
    
    // Kết hợp thông tin đăng ký với danh sách khóa học
    const coursesWithStatus = allCourses.courses.map(course => {
      const courseId = course.id || course._id;
      const isEnrolled = enrolledCourseIds.has(courseId.toString());
      
      return {
        ...course,
        isEnrolled,
        // Thêm thông tin tiến độ nếu đã đăng ký
        progress: isEnrolled ? 
          (enrolledCoursesData?.courses?.find(c => c.courseId.toString() === courseId.toString())?.progress || 0) : 
          0
      };
    });
    
    return {
      courses: coursesWithStatus,
      pagination: allCourses.pagination,
      isLoading: false
    };
  }, [allCourses, enrolledCoursesData, userProfile]);
  
  return {
    data: processedData,
    isLoading: isLoadingCourses || (!!userId && (isLoadingEnrollments || isLoadingProfile))
  };
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, courseId }) => {
      console.log("useEnrollCourse được gọi với:", { userId, courseId });
      
      if (!userId) {
        console.error("userId không được cung cấp cho enrollCourse");
        throw new Error("userId là bắt buộc");
      }
      
      if (!courseId) {
        console.error("courseId không được cung cấp cho enrollCourse");
        throw new Error("courseId là bắt buộc");
      }
      
      return GlobalApi.enrollCourse(userId, courseId);
    },
    onSuccess: (data, variables) => {
      console.log("Đăng ký khóa học thành công:", data);
      // Invalidate các query liên quan để fetch dữ liệu mới
      queryClient.invalidateQueries(["enrolledCourses", variables.userId]);
      queryClient.invalidateQueries(["userProfile", variables.userId]);
      queryClient.invalidateQueries(["course", variables.courseId]);
      // Vô hiệu hóa cache của query useCoursesWithEnrollmentStatus
      queryClient.invalidateQueries(["coursesWithEnrollmentStatus", variables.userId]);
      // Vô hiệu hóa tất cả các query liên quan đến courses
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error, variables) => {
      console.error("Lỗi khi đăng ký khóa học:", error, variables);
    }
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updatedData }) =>
      GlobalApi.updateUserProfile(userId, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["userProfile", variables.userId]);
    },
  });
}
