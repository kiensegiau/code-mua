// Script kiểm tra kết nối MongoDB và dữ liệu trực tiếp

const mongoose = require('mongoose');
require('dotenv').config();

// Biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI không được định nghĩa trong .env');
  process.exit(1);
}

console.log('MongoDB URI:', MONGODB_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://****:****@'));

// Định nghĩa schema cho Course
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  coverImage: String,
  price: Number,
  grade: String,
  subject: String,
  instructorId: String,
  instructorName: String,
  enrollments: Number,
  enrolledUsers: [String],
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { 
  collection: 'courses',
  strict: false // Cho phép dữ liệu không có trong schema
});

async function testDatabase() {
  try {
    console.log('Đang kết nối đến MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    console.log('Kết nối MongoDB thành công!');
    
    // Liệt kê tất cả collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nDanh sách collections:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    // Kiểm tra collection courses
    const Course = mongoose.model('Course', CourseSchema);
    const courseCount = await Course.countDocuments();
    console.log(`\nSố lượng khóa học trong collection 'courses': ${courseCount}`);
    
    // Kiểm tra dữ liệu trong courses
    if (courseCount > 0) {
      console.log('\nDanh sách 5 khóa học đầu tiên:');
      const courses = await Course.find().limit(5).lean();
      courses.forEach((course, index) => {
        console.log(`\n${index + 1}. ${course.title || 'Không có tiêu đề'}`);
        console.log(`   ID: ${course._id}`);
        console.log(`   Grade: ${course.grade || 'N/A'}, Subject: ${course.subject || 'N/A'}`);
        console.log(`   Price: ${course.price || 0}`);
      });
    }
    
    // Kiểm tra collection courseContents (nếu có)
    if (collections.some(c => c.name === 'courseContents')) {
      const courseContentCount = await mongoose.connection.db
        .collection('courseContents')
        .countDocuments();
      console.log(`\nSố lượng nội dung khóa học trong collection 'courseContents': ${courseContentCount}`);
    }
    
  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nĐã đóng kết nối MongoDB');
  }
}

testDatabase(); 