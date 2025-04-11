import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

// Cache cho thông tin profile người dùng
const userProfileCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 phút

export async function GET(request) {
  try {
    // Lấy userId từ query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      );
    }
    
    // Kiểm tra cache trước khi truy vấn database
    const cachedProfile = userProfileCache.get(userId);
    if (cachedProfile && cachedProfile.expires > Date.now()) {
      return NextResponse.json(cachedProfile.data);
    }
    
    // Xóa cache hết hạn
    if (cachedProfile) {
      userProfileCache.delete(userId);
    }
    
    // Kết nối đến database
    try {
      await connectToDatabase();
      
      // Kết nối trực tiếp đến collection users trong database hocmai
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      const usersCollection = hocmaiDb.collection('users');
      
      // Tìm người dùng theo uid
      const user = await usersCollection.findOne({ uid: userId });
      
      if (!user) {
        return NextResponse.json(
          { error: 'Không tìm thấy người dùng' },
          { status: 404 }
        );
      }
      
      // Định dạng dữ liệu trả về
      const formattedUser = {
        ...user,
        id: user._id.toString(),
        _id: user._id.toString()
      };
      
      // Lưu vào cache
      userProfileCache.set(userId, {
        data: formattedUser,
        expires: Date.now() + CACHE_DURATION
      });
      
      return NextResponse.json(formattedUser);
    } catch (dbError) {
      console.error("Lỗi database:", dbError);
      return NextResponse.json(
        { error: 'Lỗi cơ sở dữ liệu', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error /user/profile:", error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin người dùng', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      );
    }
    
    const updateData = body;
    
    // Loại bỏ các trường không được phép cập nhật
    const { uid, email, role, balance, enrolledCourses, ...allowedUpdates } = updateData;
    
    // Kết nối đến database
    try {
      await connectToDatabase();
      
      // Kết nối trực tiếp đến collection users trong database hocmai
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      const usersCollection = hocmaiDb.collection('users');
      
      // Cập nhật người dùng
      const result = await usersCollection.findOneAndUpdate(
        { uid: userId },
        { $set: allowedUpdates },
        { returnDocument: 'after' }
      );
      
      const updatedUser = result.value;
      
      if (!updatedUser) {
        return NextResponse.json(
          { error: "Người dùng không tồn tại" },
          { status: 404 }
        );
      }
      
      // Định dạng dữ liệu trả về
      const formattedUser = {
        ...updatedUser,
        id: updatedUser._id.toString(),
        _id: updatedUser._id.toString()
      };
      
      // Cập nhật cache với dữ liệu mới
      userProfileCache.set(userId, {
        data: formattedUser,
        expires: Date.now() + CACHE_DURATION
      });
      
      return NextResponse.json(formattedUser);
    } catch (dbError) {
      console.error("Lỗi database:", dbError);
      return NextResponse.json(
        { error: 'Lỗi cơ sở dữ liệu', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error PUT /user/profile:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật thông tin người dùng", details: error.message },
      { status: 500 }
    );
  }
} 