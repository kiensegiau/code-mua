import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'video', 'link', 'other'],
    default: 'other',
  }
});

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  resources: [ResourceSchema],
  order: {
    type: Number,
    required: true,
  },
});

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  lessons: [LessonSchema],
});

const CourseContentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  chapters: [ChapterSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  // Đảm bảo tên collection chính xác
  collection: 'courseContents',
  timestamps: true
});

// Tự động cập nhật trường updatedAt khi update document
CourseContentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Tạo index cho courseId để tối ưu truy vấn
CourseContentSchema.index({ courseId: 1 });

// Khởi tạo model
let CourseContent;

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
    if (!CourseContent) {
      CourseContent = hocmaiDb.model('CourseContent', CourseContentSchema);
    }
    
    return CourseContent;
  } catch (error) {
    console.error('Lỗi khi khởi tạo model CourseContent:', error);
    throw error;
  }
};

// Export hàm khởi tạo và model
export { initModel };
export default CourseContent; 