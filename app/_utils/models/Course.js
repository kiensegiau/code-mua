import mongoose from 'mongoose';

// Kiểm tra nếu model đã tồn tại 
const CourseSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    thumbnailImage: { 
      type: String, 
      required: true 
    },
    demoVideo: { 
      type: String, 
      default: '' 
    },
    price: { 
      type: Number, 
      default: 0 
    },
    grade: { 
      type: String, 
      required: true 
    },
    subject: { 
      type: String, 
      required: true 
    },
    chapters: { 
      type: Array, 
      default: [] 
    },
    enrolledUsers: { 
      type: [String], 
      default: [] 
    },
    enrollments: { 
      type: Number, 
      default: 0 
    },
    requirements: { 
      type: [String], 
      default: [] 
    },
    whatYouWillLearn: { 
      type: [String], 
      default: [] 
    },
    teacherInfo: {
      type: Object,
      default: {}
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Kiểm tra an toàn và xử lý trường hợp mongoose.models có thể undefined
let Course;

try {
  // Kiểm tra xem model đã tồn tại chưa
  Course = mongoose.models?.Course || mongoose.model('Course', CourseSchema);
} catch (error) {
  // Nếu lỗi "model already exists", sử dụng model đã tồn tại
  Course = mongoose.model('Course');
}

export default Course; 