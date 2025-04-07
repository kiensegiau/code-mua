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
    console.log('Bắt đầu khởi tạo model User...');
    
    // Kiểm tra kết nối
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      console.error('Lỗi: mongoose.connection chưa sẵn sàng, readyState =', 
        mongoose.connection ? mongoose.connection.readyState : 'undefined');
      throw new Error('MongoDB chưa kết nối');
    }
    
    console.log('Kết nối mongoose OK, readyState =', mongoose.connection.readyState);
    
    // Kết nối đến database hocmai
    try {
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      console.log('Đã kết nối đến database hocmai thành công');
      
      // Kiểm tra model đã tồn tại chưa
      if (!User) {
        console.log('Tạo model User mới...');
        User = hocmaiDb.model('User', userSchema);
        console.log('Đã tạo model User thành công');
      } else {
        console.log('Model User đã tồn tại, sử dụng lại');
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