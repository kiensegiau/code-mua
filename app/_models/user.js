import mongoose from 'mongoose';

// Schema cho User
const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    default: '',
  },
  displayName: {
    type: String,
    default: '',
  },
  photoURL: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: 'user',
  },
  isVip: {
    type: Boolean,
    default: false,
  },
  vipExpiresAt: {
    type: Date,
    default: null,
  },
  enrolledCourses: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  // Tên collection trong MongoDB
  collection: 'users',
  timestamps: true
});

// Khởi tạo model
let User;

// Hàm khởi tạo model
const initModel = async () => {
  try {
    // Kiểm tra kết nối
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.error('Lỗi: mongoose.connection chưa sẵn sàng, readyState =', 
        mongoose.connection ? mongoose.connection.readyState : 'undefined');
      throw new Error('MongoDB chưa kết nối');
    }
    
    // Kết nối đến database hocmai
    try {
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      
      // Kiểm tra model đã tồn tại chưa
      if (!User) {
        User = hocmaiDb.model('User', userSchema);
      }
      
      return User;
    } catch (dbError) {
      console.error('Lỗi khi kết nối đến database hocmai:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo model User:', error);
    throw error;
  }
};

// Export hàm khởi tạo và model
export { initModel };
export default User; 