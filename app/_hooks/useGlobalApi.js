"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GlobalApi from "@/app/_utils/GlobalApi";

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
