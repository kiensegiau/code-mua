import mongoose from 'mongoose';

// Schema cho Course
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  instructorId: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  enrollments: {
    type: Number,
    default: 0,
  },
  enrolledUsers: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Tên collection trong MongoDB
  collection: 'courses',
  // Tự động chuyển đổi id từ ObjectId sang String
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  // Tự động cập nhật updatedAt khi update
  timestamps: true
});

// Khởi tạo model
let Course;

// Hàm khởi tạo model
const initModel = async () => {
  try {
    // Kiểm tra kết nối
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB chưa kết nối');
    }
    
    // Kết nối đến database hocmai
    const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
    
    // Kiểm tra model đã tồn tại chưa
    if (!Course) {
      Course = hocmaiDb.model('Course', courseSchema);
    }
    
    return Course;
  } catch (error) {
    console.error('Lỗi khi khởi tạo model Course:', error);
    throw error;
  }
};

// Export hàm khởi tạo và model
export { initModel };
export default Course; 