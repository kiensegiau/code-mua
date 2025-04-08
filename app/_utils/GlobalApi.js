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
          body: JSON.stringify({
            userId, 
            ...updatedData
          }),
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
        console.log('Gọi API mua khóa học', { userId, courseId });
        
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
        console.log('Gọi API đăng ký khóa học', { userId, courseId });
        
        // Kiểm tra tham số
        if (!userId) {
          console.error('Lỗi: userId không được cung cấp');
          throw new Error('userId là bắt buộc');
        }
        
        if (!courseId) {
          console.error('Lỗi: courseId không được cung cấp');
          throw new Error('courseId là bắt buộc');
        }
        
        console.log('URL API đăng ký:', `${API_BASE_URL}/courses/${courseId}/enroll`);
        
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        // Log response status
        console.log('API đăng ký trả về status:', response.status);
        
        // Thử đọc body của response để log
        let responseData;
        try {
          responseData = await response.clone().json();
          console.log('API đăng ký trả về data:', responseData);
        } catch (jsonError) {
          console.error('Không thể đọc JSON từ response:', jsonError);
        }
        
        if (!response.ok) {
          const data = responseData || { error: 'Lỗi không xác định' };
          console.error('API trả về lỗi:', data);
          throw new Error(data.error || 'Lỗi khi đăng ký khóa học');
        }
        
        return responseData || await response.json();
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
        console.log(`Kiểm tra đăng ký khóa học: courseId=${courseId}, userId=${userId}`);
        
        if (!userId) {
          console.warn("userId không được cung cấp khi kiểm tra đăng ký khóa học");
          return false;
        }
        
        if (!courseId) {
          console.warn("courseId không được cung cấp khi kiểm tra đăng ký khóa học");
          return false;
        }
        
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
        
        const data = await response.json();
        
        // Đảm bảo trả về đúng dữ liệu khóa học, có thể nằm trong data.course
        return data.course || data;
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
        if (!userId) {
          console.warn('userId không được cung cấp khi gọi getEnrolledCourses');
          return [];
        }
        
        console.log('Gọi API lấy khóa học đã đăng ký:', userId);
        
        const response = await fetch(`${API_BASE_URL}/courses/enrollment?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách khóa học đã đăng ký');
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
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
