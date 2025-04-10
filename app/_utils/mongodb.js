import mongoose from 'mongoose';

// Kiểm tra xem code đang chạy ở server hay client
const isServer = typeof window === 'undefined';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI trong file .env');
}

// Giữ lại log này để theo dõi URI đang được sử dụng
console.log('MongoDB URI config:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Chỉ kết nối khi chạy ở server
  if (!isServer) {
    console.warn('Đang cố gắng kết nối MongoDB từ client-side. Hãy sử dụng API routes thay thế.');
    return null;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Thời gian timeout
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        console.error('Lỗi kết nối MongoDB:', err);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Lỗi khi đợi kết nối MongoDB:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Thêm trình xử lý sự kiện để log trạng thái kết nối
if (isServer && mongoose.connection) {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose đã kết nối thành công');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Lỗi kết nối Mongoose:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose đã ngắt kết nối');
  });
}

export default connectToDatabase; 