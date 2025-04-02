import mongoose from 'mongoose';

// Kiểm tra model đã tồn tại
const PurchaseSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    courseId: { 
      type: String, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    purchasedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { 
    timestamps: true 
  }
);

// Tạo index để tìm kiếm theo userId + courseId
PurchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Kiểm tra an toàn và xử lý trường hợp mongoose.models có thể undefined
let Purchase;

try {
  // Kiểm tra xem model đã tồn tại chưa
  Purchase = mongoose.models?.Purchase || mongoose.model('Purchase', PurchaseSchema);
} catch (error) {
  // Nếu lỗi "model already exists", sử dụng model đã tồn tại
  Purchase = mongoose.model('Purchase');
}

export default Purchase; 