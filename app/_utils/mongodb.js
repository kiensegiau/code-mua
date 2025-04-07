import mongoose from 'mongoose';

// Kiểm tra xem code đang chạy ở server hay client
const isServer = typeof window === 'undefined';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI trong file .env');
}

console.log('MongoDB URI config:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

let cached = global.mongoose;

if (!cached) {
  console.log('Khởi tạo cache mongoose mới');
  cached = global.mongoose = { conn: null, promise: null };
} else {
  console.log('Sử dụng cache mongoose đã có');
}

async function connectToDatabase() {
  console.log('Gọi hàm connectToDatabase()');
  
  // Chỉ kết nối khi chạy ở server
  if (!isServer) {
    console.warn('Đang cố gắng kết nối MongoDB từ client-side. Hãy sử dụng API routes thay thế.');
    return null;
  }

  console.log('Đang chạy ở môi trường server, tiếp tục kết nối...');
  
  if (cached.conn) {
    console.log('Sử dụng kết nối mongoose đã có trong cache');
    return cached.conn;
  }

  console.log('Không tìm thấy kết nối trong cache, đang khởi tạo kết nối mới...');

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Thời gian timeout
    };

    console.log('Đang kết nối đến MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Kết nối MongoDB thành công!');
        return mongoose;
      })
      .catch((err) => {
        console.error('Lỗi kết nối MongoDB:', err);
        cached.promise = null;
        throw err;
      });
  } else {
    console.log('Đang sử dụng promise kết nối hiện có');
  }

  try {
    console.log('Đang đợi kết nối...');
    cached.conn = await cached.promise;
    console.log('Đã nhận kết nối từ promise');
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