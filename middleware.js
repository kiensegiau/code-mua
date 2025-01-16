import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/_utils/jwt";

const PUBLIC_PATHS = ["/sign-in"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log("🚀 Middleware running for path:", pathname);

  // Cho phép truy cập các route công khai
  if (PUBLIC_PATHS.includes(pathname)) {
    console.log("✅ Public path, allowing access");
    return NextResponse.next();
  }

  // Lấy token từ cookie
  const token = request.cookies.get("accessToken")?.value;
  console.log("🔑 Token from cookie:", token ? "Found" : "Not found");

  // Nếu không có token, chuyển hướng về trang đăng nhập
  if (!token) {
    console.log("❌ No token found, redirecting to login");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Xác thực token
    const verifiedToken = await verifyJwtToken(token);
    console.log("🔒 Token verification result:", verifiedToken ? "Valid" : "Invalid");
    
    if (!verifiedToken) {
      console.log("❌ Token invalid, redirecting to login");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    console.log("✅ Token valid, allowing access");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    // Token không hợp lệ, chuyển hướng về trang đăng nhập
    return NextResponse.redirect(new URL("/sign-in", request.url));
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