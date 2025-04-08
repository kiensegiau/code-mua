const fetch = require('node-fetch');

// URL của API
const API_URL = 'http://localhost:3000/api/courses';

// Hàm lấy danh sách khóa học
async function getCourseList() {
  try {
    console.log('Đang gọi API từ URL:', API_URL);
    
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Tổng số khóa học:', data.length);
    
    // Log các khóa học
    console.log('\nDanh sách khóa học:');
    data.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course.id || course._id}`);
      console.log(`   Tiêu đề: ${course.title || 'Không có tiêu đề'}`);
      console.log(`   Môn học: ${course.subject || 'N/A'}`);
      console.log(`   Lớp: ${course.grade || 'N/A'}`);
      console.log(`   Mô tả: ${(course.description || '').substring(0, 50)}${course.description?.length > 50 ? '...' : ''}`);
      console.log('-------------------');
    });
    
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API:', error.message);
    return null;
  }
}

// Chạy hàm test
getCourseList(); 