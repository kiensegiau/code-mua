import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Đảm bảo chỉ khởi tạo Firebase Admin SDK một lần 
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
    
    console.log("✅ Firebase Admin SDK đã được khởi tạo thành công");
  } catch (error) {
    console.error("❌ Lỗi khởi tạo Firebase Admin SDK:", error);
    // Ghi log lỗi đến hệ thống giám sát nếu có
  }
}

// Xuất các dịch vụ Firebase Admin cần thiết
const auth = getAuth();
const db = getFirestore();

const admin = {
  auth: () => auth,
  firestore: () => db
};

export default admin; 