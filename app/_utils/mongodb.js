import mongoose from 'mongoose';

// Kiểm tra môi trường để tránh chạy ở client-side
const isServer = typeof window === 'undefined';

// Chỉ khởi tạo kết nối MongoDB ở phía server
if (!isServer) {
  console.warn('⚠️ Cố gắng sử dụng MongoDB ở client-side. MongoDB chỉ nên được sử dụng ở server-side APIs.');
}

// Lấy chuỗi kết nối từ biến môi trường - chỉ có sẵn ở server-side
const MONGODB_URI = isServer ? process.env.MONGODB_URI : null;

if (isServer && !MONGODB_URI) {
  console.error('❌ Lỗi: Thiếu biến môi trường MONGODB_URI');
  throw new Error('Vui lòng cấu hình biến môi trường MONGODB_URI');
}

// Tạo một connection instance để sử dụng globally
let cached = isServer && global.mongoose;

if (isServer && !cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Trả về một promise rejected nếu được gọi ở client
  if (!isServer) {
    console.error('❌ Không thể kết nối MongoDB ở client-side');
    return Promise.reject(new Error('MongoDB chỉ có thể được sử dụng ở server-side'));
  }

  if (cached.conn) {
    console.log(`🔄 Sử dụng kết nối MongoDB đã cached [${new Date().toISOString()}]`);
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

    console.log(`🔌 Bắt đầu kết nối đến MongoDB: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:***@')} [${new Date().toISOString()}]`);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ Kết nối MongoDB thành công [${new Date().toISOString()}]`);
      return mongoose;
    });
  }

  try {
    console.log(`⏳ Đang chờ kết nối MongoDB... [${new Date().toISOString()}]`);
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`❌ Lỗi kết nối MongoDB: ${e.message} [${new Date().toISOString()}]`);
    console.error('Chi tiết lỗi:', e);
    throw e;
  }

  return cached.conn;
}

// Connect ngay khi import để đảm bảo có kết nối trước khi sử dụng models
// Nhưng chỉ ở server-side
if (isServer && process.env.NODE_ENV !== 'test') {
  connectToDatabase().catch((err) => {
    console.error(`❌ Không thể kết nối đến MongoDB: ${err.message} [${new Date().toISOString()}]`);
    console.error('Chi tiết lỗi:', err);
  });
}

export default connectToDatabase;