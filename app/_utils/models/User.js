import mongoose from 'mongoose';

// Kiểm tra nếu model đã tồn tại để tránh overwrite khi hot-reload
const UserSchema = new mongoose.Schema(
  {
    uid: { 
      type: String, 
      required: true,
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    displayName: { 
      type: String,
      default: ''
    },
    photoURL: { 
      type: String,
      default: ''
    },
    balance: { 
      type: Number, 
      default: 0 
    },
    enrolledCourses: { 
      type: [String], 
      default: [] 
    },
    role: { 
      type: String, 
      default: 'user' 
    },
    phoneNumber: { 
      type: String,
      default: ''
    },
    profileComplete: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true 
  }
);

// Kiểm tra an toàn và xử lý trường hợp mongoose.models có thể undefined
let User;

try {
  // Kiểm tra xem model đã tồn tại chưa
  User = mongoose.models?.User || mongoose.model('User', UserSchema);
} catch (error) {
  // Nếu lỗi "model already exists", sử dụng model đã tồn tại
  User = mongoose.model('User');
}

export default User; 