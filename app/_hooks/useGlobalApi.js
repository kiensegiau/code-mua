"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API functions dùng fetch để gọi server-side API
const fetchCourseList = async (options = {}) => {
  const queryParams = new URLSearchParams();
  if (options.grade) queryParams.append('grade', options.grade);
  if (options.subject) queryParams.append('subject', options.subject);
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.page) queryParams.append('page', options.page);
  
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const url = `/api/courses?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
    credentials: 'include' // Gửi cookie
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const fetchUserProfile = async (userId) => {
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`/api/users/${userId}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include' // Gửi cookie
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const fetchEnrolledCourses = async (userId) => {
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`/api/courses/enrolled?userId=${userId}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include' // Gửi cookie
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const fetchCourseById = async (courseId) => {
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`/api/courses/${courseId}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include' // Gửi cookie
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const enrollCourseAPI = async (userId, courseId) => {
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`/api/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: headers,
    credentials: 'include', // Gửi cookie
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

const updateUserProfileAPI = async (userId, updatedData) => {
  // Lấy token từ localStorage nếu có
  const accessToken = localStorage.getItem("accessToken");
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Thêm token vào header nếu có
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: headers,
    credentials: 'include', // Gửi cookie
    body: JSON.stringify(updatedData),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// React Query hooks
export function useCourseList(options) {
  return useQuery({
    queryKey: ["courses", options],
    queryFn: () => fetchCourseList(options),
  });
}

export function useUserProfile(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
}

export function useEnrolledCourses(userId) {
  return useQuery({
    queryKey: ["enrolledCourses", userId],
    queryFn: () => fetchEnrolledCourses(userId),
    enabled: !!userId,
  });
}

export function useCourseById(courseId) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId),
    enabled: !!courseId,
  });
}

export function useEnrollCourse() {
  return useMutation({
    mutationFn: ({ userId, courseId }) => enrollCourseAPI(userId, courseId),
  });
}

export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: ({ userId, updatedData }) => updateUserProfileAPI(userId, updatedData),
  });
}
