import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_models/user";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    const user = await User.findOne({ uid: userId }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Loại bỏ thông tin nhạy cảm
    const { _id, ...userData } = user;

    return NextResponse.json({
      ...userData,
      id: _id.toString()
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const updateData = await request.json();

    // Loại bỏ các trường không được phép cập nhật
    const { uid, email, role, balance, enrolledCourses, ...allowedUpdates } = updateData;

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      { $set: allowedUpdates },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Loại bỏ thông tin nhạy cảm
    const { _id, ...userData } = updatedUser;

    return NextResponse.json({
      ...userData,
      id: _id.toString()
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật thông tin người dùng" },
      { status: 500 }
    );
  }
} 