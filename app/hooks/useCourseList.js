import { useState, useEffect } from 'react';

export function useCourseList({ grade = null } = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Xây dựng URL với các tham số query
        const params = new URLSearchParams();
        if (grade) params.append('grade', grade);

        const response = await fetch(`/api/courses?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Lỗi khi tải danh sách khóa học');
        }

        // Kiểm tra và đảm bảo courses là một mảng
        if (result.courses && Array.isArray(result.courses)) {
          setData(result.courses);
        } else {
          console.error('Dữ liệu khóa học không hợp lệ:', result);
          setData([]);
        }
      } catch (err) {
        console.error('Lỗi khi tải khóa học:', err);
        setError(err.message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [grade]);

  return { data, isLoading, error };
} 