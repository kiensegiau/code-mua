import mongoose from 'mongoose';

// Schema cho Purchase
const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed',
  },
  paymentMethod: {
    type: String,
    default: 'wallet',
  },
  transactionId: {
    type: String,
    default: '',
  }
}, {
  // Tên collection trong MongoDB
  collection: 'purchases',
  timestamps: true
});

// Khởi tạo model
let Purchase;

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
    if (!Purchase) {
      Purchase = hocmaiDb.model('Purchase', purchaseSchema);
    }
    
    return Purchase;
  } catch (error) {
    console.error('Lỗi khi khởi tạo model Purchase:', error);
    throw error;
  }
};

// Export hàm khởi tạo và model
export { initModel };
export default Purchase; 