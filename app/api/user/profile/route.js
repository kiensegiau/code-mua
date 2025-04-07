import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    console.log("API /user/profile được gọi");
    
    // Lấy userId từ query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log("userId từ query params:", userId);
    
    if (!userId) {
      console.log("Lỗi: userId không được cung cấp");
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      );
    }
    
    // Kết nối đến database
    try {
      await connectToDatabase();
      console.log("Đã kết nối đến database");
      
      // Kết nối trực tiếp đến collection users trong database hocmai
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      const usersCollection = hocmaiDb.collection('users');
      
      console.log("Đã kết nối đến collection users trong database hocmai");
      
      // Tìm người dùng theo uid
      const user = await usersCollection.findOne({ uid: userId });
      console.log("Kết quả tìm kiếm user:", user ? "Tìm thấy" : "Không tìm thấy");
      
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
    console.log("API PUT /user/profile được gọi");
    
    const body = await request.json();
    const { userId } = body;
    
    console.log("userId từ body:", userId);
    
    if (!userId) {
      console.log("Lỗi: userId không được cung cấp");
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
      console.log("Đã kết nối đến database");
      
      // Kết nối trực tiếp đến collection users trong database hocmai
      const hocmaiDb = mongoose.connection.useDb('hocmai', { useCache: true });
      const usersCollection = hocmaiDb.collection('users');
      
      console.log("Đã kết nối đến collection users trong database hocmai");
      
      // Cập nhật người dùng
      const result = await usersCollection.findOneAndUpdate(
        { uid: userId },
        { $set: allowedUpdates },
        { returnDocument: 'after' }
      );
      
      const updatedUser = result.value;
      console.log("Kết quả cập nhật user:", updatedUser ? "Thành công" : "Không tìm thấy");
      
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