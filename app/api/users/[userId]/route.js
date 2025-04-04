import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
import { verifyJwtToken } from '@/app/_utils/jwt';

export async function GET(request, { params }) {
  const requestId = `api_users_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`👤 [${requestId}] GET /api/users/${params.userId} - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    // Xác thực người dùng bằng token từ header
    const authorization = request.headers.get('authorization');
    let isAuthenticated = false;
    let authenticatedUserId = null;
    
    if (authorization) {
      const token = authorization.split(' ')[1];
      
      try {
        const payload = await verifyJwtToken(token);
        if (payload && payload.uid) {
          isAuthenticated = true;
          authenticatedUserId = payload.uid;
        }
      } catch (error) {
        console.error(`🔒 [${requestId}] Lỗi khi xác thực token: ${error.message}`);
      }
    } else {
      // Kiểm tra cookie
      const cookies = request.cookies;
      const sessionCookie = cookies.get('session');
      
      if (sessionCookie) {
        try {
          const payload = await verifyJwtToken(sessionCookie.value);
          if (payload && payload.uid) {
            isAuthenticated = true;
            authenticatedUserId = payload.uid;
          }
        } catch (error) {
          console.error(`🔒 [${requestId}] Lỗi khi xác thực cookie: ${error.message}`);
        }
      }
    }
    
    // Nếu không được xác thực
    if (!isAuthenticated) {
      console.log(`🔒 [${requestId}] Yêu cầu không được xác thực [${new Date().toISOString()}]`);
      return NextResponse.json(
        { error: 'Không được phép' },
        { status: 401 }
      );
    }
    
    // Kiểm tra quyền truy cập - người dùng chỉ được xem thông tin của chính mình trừ khi là admin
    if (authenticatedUserId !== params.userId) {
      // Kiểm tra xem người dùng hiện tại có phải là admin không
      await connectToDatabase();
      const currentUser = await User.findOne({ uid: authenticatedUserId });
      
      if (!currentUser || !currentUser.isAdmin) {
        console.log(`🔒 [${requestId}] Người dùng ${authenticatedUserId} không có quyền xem thông tin của ${params.userId} [${new Date().toISOString()}]`);
        return NextResponse.json(
          { error: 'Không được phép' },
          { status: 403 }
        );
      }
    }
    
    // Kết nối đến cơ sở dữ liệu
    console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
    await connectToDatabase();
    
    // Tìm kiếm người dùng theo userId
    console.log(`🔍 [${requestId}] Tìm kiếm người dùng với uid: ${params.userId} [${new Date().toISOString()}]`);
    const user = await User.findOne({ uid: params.userId });
    
    if (!user) {
      console.log(`❓ [${requestId}] Không tìm thấy người dùng với uid: ${params.userId} [${new Date().toISOString()}]`);
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }
    
    // Chuyển đổi định dạng kết quả để tương thích với client
    const result = {
      id: user._id.toString(),
      ...user.toObject()
    };
    
    console.log(`✅ [${requestId}] Lấy thông tin người dùng thành công [${new Date().toISOString()}]`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi lấy thông tin người dùng: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    
    return NextResponse.json(
      { error: 'Không thể lấy thông tin người dùng', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const requestId = `user_patch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`🔄 [${requestId}] PATCH /api/users/${params.userId} - Bắt đầu [${new Date().toISOString()}]`);
  
  try {
    const session = await getServerSession();
    const { userId } = params;
    
    console.log(`👤 [${requestId}] Người dùng hiện tại: ${session?.user?.id || 'Chưa đăng nhập'}`);
    console.log(`🎯 [${requestId}] Cập nhật thông tin cho userId: ${userId}`);
    
    if (!session?.user) {
      console.log(`🔒 [${requestId}] Từ chối truy cập: Người dùng chưa đăng nhập [${new Date().toISOString()}]`);
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để cập nhật thông tin" },
        { status: 401 }
      );
    }
    
    // Chỉ cho phép người dùng cập nhật thông tin của chính họ
    if (session.user.id !== userId) {
      console.log(`🔒 [${requestId}] Từ chối truy cập: Người dùng ${session.user.id} không có quyền cập nhật thông tin của ${userId} [${new Date().toISOString()}]`);
      return NextResponse.json(
        { message: "Bạn không có quyền cập nhật thông tin này" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    console.log(`📝 [${requestId}] Dữ liệu cập nhật: ${JSON.stringify(data)} [${new Date().toISOString()}]`);
    
    console.log(`🔄 [${requestId}] Đang kết nối đến MongoDB... [${new Date().toISOString()}]`);
    await connectToDatabase();
    
    console.log(`🔄 [${requestId}] Đang cập nhật thông tin người dùng với ID: ${userId} [${new Date().toISOString()}]`);
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      { $set: data },
      { new: true }
    );
    
    if (!updatedUser) {
      console.log(`❓ [${requestId}] Không tìm thấy người dùng với ID: ${userId} [${new Date().toISOString()}]`);
      return NextResponse.json(
        { message: "Không tìm thấy thông tin người dùng" },
        { status: 404 }
      );
    }
    
    // Chuyển đổi định dạng để tương thích với code cũ
    const userData = {
      id: updatedUser._id.toString(),
      ...updatedUser.toObject()
    };
    
    // Loại bỏ các thông tin nhạy cảm trước khi trả về
    delete userData.password;
    delete userData.__v;
    
    console.log(`✅ [${requestId}] Đã cập nhật thông tin người dùng thành công [${new Date().toISOString()}]`);
    return NextResponse.json(userData);
  } catch (error) {
    console.error(`❌ [${requestId}] Lỗi khi cập nhật thông tin người dùng: ${error.message} [${new Date().toISOString()}]`);
    console.error(`🔍 [${requestId}] Chi tiết lỗi:`, error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật thông tin người dùng" },
      { status: 500 }
    );
  }
} 