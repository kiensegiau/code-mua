import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { generatePassword } from "../../../_utils/generators";
import { MongoClient } from "mongodb";

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

// Lấy service Firebase Auth
const auth = getAuth();

export async function POST(request) {
  try {
    // Tạo email và mật khẩu ngẫu nhiên
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const email = `trial_user_${randomNumber}@khoahoc.temp`;
    const password = generatePassword(12); // Function tạo mật khẩu mạnh
    
    try {
      console.log("🔄 Bắt đầu tạo tài khoản học thử...");
      
      // Tạo tài khoản trên Firebase Auth
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: `Học viên thử ${randomNumber}`,
        emailVerified: true,
      });
      
      console.log(`✅ Đã tạo tài khoản Firebase Auth: ${userRecord.uid}`);

      // Thêm custom claims với vai trò và trạng thái VIP
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Thời hạn 1 giờ
      
      await auth.setCustomUserClaims(userRecord.uid, {
        role: "user",
        isVip: true,
        vipExpiresAt: expiryDate.toISOString()
      });
      
      console.log(`✅ Đã thiết lập VIP claims cho: ${userRecord.uid}`);

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
      
      console.log(`🔄 Đang lưu thông tin vào MongoDB...`);

      // Lưu vào MongoDB - kết nối trực tiếp đến database "hocmai"
      try {
        console.log(`🔄 Kết nối đến database: hocmai`);
        
        // Sử dụng connection string trực tiếp
        const mongoURI = process.env.MONGODB_URI;
        const client = new MongoClient(mongoURI);
        await client.connect();
        
        // Chọn database "hocmai" thay vì database mặc định
        const db = client.db('hocmai');
        
        // Lưu người dùng vào collection users
        await db.collection("users").insertOne(userData);
        console.log(`✅ Đã lưu thông tin vào MongoDB (hocmai) thành công`);
        
        // Đóng kết nối
        await client.close();
      } catch (mongoError) {
        console.error("❌ Lỗi khi lưu vào MongoDB:", mongoError);
        
        // Thử cách khác: gọi API
        try {
          console.log("🔄 Thử lưu dữ liệu qua API...");
          const apiResponse = await fetch("/api/user/create", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...userData,
              dbName: "hocmai" // Thêm thông tin database
            }),
          });
          
          if (apiResponse.ok) {
            console.log("✅ Đã lưu dữ liệu qua API thành công");
          } else {
            console.error("❌ Lỗi lưu qua API:", await apiResponse.text());
          }
        } catch (apiError) {
          console.error("❌ Lỗi khi gọi API tạo người dùng:", apiError);
        }
      }

      // Tạo custom token để đăng nhập tự động
      const customToken = await auth.createCustomToken(userRecord.uid);
      console.log("✅ Đã tạo custom token thành công");

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
      console.error("❌ Firebase error:", firebaseError);
      return NextResponse.json(
        { success: false, message: "Không thể tạo tài khoản: " + firebaseError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi server" },
      { status: 500 }
    );
  }
} 