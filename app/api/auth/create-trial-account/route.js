import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { generatePassword } from "../../../_utils/generators";

// Khởi tạo Firebase Admin nếu chưa được khởi tạo
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
  }
}

// Lấy các service Firebase Admin
const auth = getAuth();
const db = getFirestore();

export async function POST(request) {
  try {
    // Tạo email và mật khẩu ngẫu nhiên
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const email = `trial_user_${randomNumber}@khoahoc.temp`;
    const password = generatePassword(12); // Function tạo mật khẩu mạnh
    
    try {
      // Tạo tài khoản trên Firebase Auth
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: `Học viên thử ${randomNumber}`,
        emailVerified: true,
      });

      // Thêm custom claims với vai trò và trạng thái VIP
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // Thời hạn 24 giờ
      
      await auth.setCustomUserClaims(userRecord.uid, {
        role: "user",
        isVip: true,
        vipExpiresAt: expiryDate.toISOString()
      });

      // Tạo document trong collection users
      const userData = {
        _id: userRecord.uid,
        uid: userRecord.uid,
        email: email,
        fullName: `Học viên thử ${randomNumber}`,
        phoneNumber: null,
        isActive: true,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        isVip: true,
        vipExpiresAt: expiryDate
      };

      // Lưu trong database
      await db.collection("users").doc(userRecord.uid).set(userData);

      // Tạo custom token để đăng nhập tự động
      const customToken = await auth.createCustomToken(userRecord.uid);

      // Trả về thông tin tài khoản đã tạo và token
      return NextResponse.json({
        success: true,
        user: {
          uid: userRecord.uid,
          email: email,
          fullName: `Học viên thử ${randomNumber}`,
          isVip: true,
          vipExpiresAt: expiryDate.toISOString()
        },
        customToken: customToken
      });
      
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError);
      return NextResponse.json(
        { success: false, message: "Không thể tạo tài khoản: " + firebaseError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi server" },
      { status: 500 }
    );
  }
} 