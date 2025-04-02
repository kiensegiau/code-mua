import mongoose from 'mongoose';

// Lấy chuỗi kết nối từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Lỗi: Thiếu biến môi trường MONGODB_URI');
  throw new Error('Vui lòng cấu hình biến môi trường MONGODB_URI');
}

// Tạo một connection instance để sử dụng globally
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout nếu không thể kết nối trong 5 giây
    };

    // Bật mongoose debug mode trong development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Kết nối MongoDB thành công');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Lỗi kết nối MongoDB:', e.message);
    throw e;
  }

  return cached.conn;
}

// Connect ngay khi import để đảm bảo có kết nối trước khi sử dụng models
if (process.env.NODE_ENV !== 'test') {
  connectToDatabase().catch((err) => {
    console.error('❌ Không thể kết nối đến MongoDB:', err.message);
  });
}

export default connectToDatabase;