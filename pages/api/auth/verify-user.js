import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Khởi tạo Firebase Admin SDK nếu chưa được khởi tạo
if (!getApps().length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK đã được khởi tạo thành công trong API");
  } catch (error) {
    console.error("❌ Lỗi khởi tạo Firebase Admin SDK trong API:", error);
  }
}

export default async function handler(req, res) {
  // Chỉ cho phép phương thức GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
  }

  // Lấy UID từ query parameter
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'Thiếu tham số UID', exists: false });
  }

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const userRecord = await getAuth().getUser(uid);
    
    // Nếu tài khoản bị vô hiệu hóa, coi như không tồn tại
    if (userRecord.disabled) {
      return res.status(200).json({ exists: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    }
    
    return res.status(200).json({ exists: true, email: userRecord.email });
  } catch (error) {
    // Nếu là lỗi không tìm thấy người dùng
    if (error.code === 'auth/user-not-found') {
      return res.status(200).json({ exists: false, message: 'Không tìm thấy người dùng' });
    }
    
    // Lỗi khác
    console.error('Lỗi kiểm tra người dùng:', error);
    return res.status(500).json({ 
      error: 'Lỗi khi kiểm tra người dùng', 
      message: error.message,
      exists: false 
    });
  }
} 