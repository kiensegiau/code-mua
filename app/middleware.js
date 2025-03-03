import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Định nghĩa các đường dẫn công khai một lần để tránh tạo lại mỗi request
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/forgot-password"];
const STATIC_FILE_PATHS = ["/_next", "/api", "/static", "/favicon.ico"];

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Kiểm tra nhanh các đường dẫn tĩnh trước
  if (STATIC_FILE_PATHS.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken");

  // Nếu không có token và đang truy cập route được bảo vệ
  if (!token && !PUBLIC_PATHS.includes(path)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Nếu có token và đang truy cập public routes
  if (token && PUBLIC_PATHS.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
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
