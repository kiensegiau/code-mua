import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/_utils/jwt";

// Danh sách các đường dẫn không yêu cầu xác thực
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log("🚀 Middleware đang chạy cho đường dẫn:", pathname);

  // Cho phép truy cập các route công khai
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    console.log("✅ Đường dẫn công khai, cho phép truy cập");
    return NextResponse.next();
  }

  // Lấy token từ cookie
  const token = request.cookies.get("accessToken")?.value;
  console.log("🔑 Token từ cookie:", token ? "Tìm thấy" : "Không tìm thấy");

  // Nếu không có token, chuyển hướng về trang đăng nhập
  if (!token) {
    console.log("❌ Không tìm thấy token, chuyển hướng đến trang đăng nhập");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Xác thực token
    const verifiedToken = await verifyJwtToken(token);
    console.log(
      "🔒 Kết quả xác thực token:",
      verifiedToken ? "Hợp lệ" : "Không hợp lệ"
    );

    if (!verifiedToken || !verifiedToken.uid) {
      console.log("❌ Token không hợp lệ, chuyển hướng đến trang đăng nhập");
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // Kiểm tra tài khoản có tồn tại không qua API route
    try {
      // Gọi API để kiểm tra tài khoản
      const apiUrl = new URL("/api/auth/verify-user", request.url);
      apiUrl.searchParams.append("uid", verifiedToken.uid);
      
      const apiResponse = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const apiData = await apiResponse.json();
      
      if (!apiResponse.ok || !apiData.exists) {
        console.log("❌ Người dùng không tồn tại hoặc đã bị xóa, xóa token và chuyển hướng");
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        response.cookies.delete("accessToken");
        return response;
      }
      
      console.log("✅ Người dùng tồn tại, cho phép truy cập");
      return NextResponse.next();
    } catch (userError) {
      console.error("❌ Lỗi kiểm tra người dùng:", userError);
      // Lỗi khi kiểm tra tài khoản, tạm thời cho phép truy cập
      // Để tránh người dùng bị khóa vì lỗi kỹ thuật
      return NextResponse.next();
    }
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    // Token không hợp lệ, chuyển hướng về trang đăng nhập
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("accessToken");
    return response;
  }
}

// Cấu hình các route cần áp dụng middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
