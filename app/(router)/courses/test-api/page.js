"use client";

import { useState, useEffect } from "react";
import { useCourseList } from "@/app/_hooks/useGlobalApi";

export default function TestCoursesAPI() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng hook useCourseList để lấy dữ liệu
  const { data: coursesFromHook, isLoading: hookLoading, error: hookError } = useCourseList();

  // Gọi API trực tiếp
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Lỗi khi gọi API');
        }
        const data = await response.json();
        setApiData(data);
        console.log("Dữ liệu từ API trực tiếp:", data);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test API Danh sách khóa học</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dữ liệu từ hook useCourseList</h2>
        {hookLoading ? (
          <p>Đang tải...</p>
        ) : hookError ? (
          <p className="text-red-500">Lỗi: {hookError.message}</p>
        ) : (
          <div>
            <p className="mb-2">Số lượng khóa học: {coursesFromHook?.length || 0}</p>
            <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
              <pre className="text-sm text-gray-300">
                {JSON.stringify(coursesFromHook || [], null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dữ liệu từ API trực tiếp</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">Lỗi: {error}</p>
        ) : (
          <div>
            <p className="mb-2">Số lượng khóa học: {apiData?.length || 0}</p>
            <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
              <pre className="text-sm text-gray-300">
                {JSON.stringify(apiData || [], null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Danh sách tên khóa học</h2>
        {(hookLoading || loading) ? (
          <p>Đang tải...</p>
        ) : (hookError || error) ? (
          <p className="text-red-500">Lỗi khi tải dữ liệu</p>
        ) : (
          <ul className="space-y-2 bg-gray-800 p-4 rounded-lg">
            {(coursesFromHook || []).map((course, index) => (
              <li key={course.id || index} className="flex items-start">
                <span className="mr-2 font-bold">{index + 1}.</span>
                <div>
                  <div className="font-medium">{course.title || 'Không có tiêu đề'}</div>
                  <div className="text-sm text-gray-400">
                    ID: {course.id}, Môn: {course.subject || 'N/A'}, Lớp: {course.grade || 'N/A'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 