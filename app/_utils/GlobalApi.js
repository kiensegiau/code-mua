// Kiểm tra nếu đang chạy ở client-side
const isClient = typeof window !== 'undefined';

// Các API URL
const API_BASE_URL = '/api';

const GlobalApi = {
  getAllCourseList: async (options = {}) => {
    try {
      if (isClient) {
        // Sử dụng API route trên client-side
        const queryParams = new URLSearchParams();
        if (options.grade) queryParams.append('grade', options.grade);
        if (options.subject) queryParams.append('subject', options.subject);
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.page) queryParams.append('page', options.page);
        
        const response = await fetch(`${API_BASE_URL}/courses?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách khóa học');
        }
        
        return await response.json();
      } else {
        // Server-side code sẽ được xử lý thông qua API route
        console.warn('getAllCourseList đang được gọi từ server, hãy sử dụng API route');
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      if (isClient) {
        if (!userId) return null;
        
        const response = await fetch(`${API_BASE_URL}/user/profile?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Lỗi khi lấy thông tin người dùng');
        }
        
        return await response.json();
      } else {
        console.warn('getUserProfile đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
      throw error;
    }
  },

  updateUserProfile: async (userId, updatedData) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
        
        if (!response.ok) {
          throw new Error('Lỗi khi cập nhật thông tin người dùng');
        }
        
        return await response.json();
      } else {
        console.warn('updateUserProfile đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  },

  purchaseCourse: async (userId, courseId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Lỗi khi mua khóa học');
        }
        
        return await response.json();
      } else {
        console.warn('purchaseCourse đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi mua khóa học:", error);
      throw error;
    }
  },

  enrollCourse: async (userId, courseId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Lỗi khi đăng ký khóa học');
        }
        
        return await response.json();
      } else {
        console.warn('enrollCourse đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      throw error;
    }
  },

  isUserEnrolled: async (userId, courseId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/check-enrollment?userId=${userId}`);
        
        if (!response.ok) {
          return false;
        }
        
        const data = await response.json();
        return data.enrolled || false;
      } else {
        console.warn('isUserEnrolled đang được gọi từ server, hãy sử dụng API route');
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng ký khóa học:", error);
      return false;
    }
  },

  getCourseById: async (courseId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy thông tin khóa học');
        }
        
        return await response.json();
      } else {
        console.warn('getCourseById đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      throw error;
    }
  },

  getEnrolledCourses: async (userId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/user/enrolled-courses?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách khóa học đã đăng ký');
        }
        
        return await response.json();
      } else {
        console.warn('getEnrolledCourses đang được gọi từ server, hãy sử dụng API route');
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
      throw error;
    }
  },

  getLessonData: async (courseId, chapterId, lessonId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu bài học');
        }
        
        return await response.json();
      } else {
        console.warn('getLessonData đang được gọi từ server, hãy sử dụng API route');
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học:", error);
      throw error;
    }
  },

  getChapterLessons: async (courseId, chapterId) => {
    try {
      if (isClient) {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}/lessons`);
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu bài học của chương');
        }
        
        return await response.json();
      } else {
        console.warn('getChapterLessons đang được gọi từ server, hãy sử dụng API route');
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học của chương:", error);
      throw error;
    }
  }
};

export default GlobalApi;
