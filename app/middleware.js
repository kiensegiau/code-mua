import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Định nghĩa các đường dẫn công khai một lần để tránh tạo lại mỗi request
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/sign-out",
];
const STATIC_FILE_PATHS = ["/_next", "/static", "/favicon.ico", "/public"];
const API_PATHS = ["/api"];

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Logging cho debug
  console.log(`🚀 Middleware đang chạy cho đường dẫn: ${path}`);

  // Kiểm tra nhanh các đường dẫn tĩnh trước
  if (STATIC_FILE_PATHS.some((prefix) => path.startsWith(prefix))) {
    console.log(`✅ Đường dẫn tĩnh, bỏ qua middleware: ${path}`);
    return NextResponse.next();
  }

  // Kiểm tra đường dẫn API
  if (API_PATHS.some((prefix) => path.startsWith(prefix))) {
    console.log(`✅ Đường dẫn API, bỏ qua middleware: ${path}`);
    return NextResponse.next();
  }

  // Kiểm tra xem đường dẫn có phải là public path không
  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // Lấy token từ cookie
  const token = request.cookies.get("accessToken");
  console.log(`🔑 Token từ cookie: ${token ? "Tìm thấy" : "Không tìm thấy"}`);

  if (token) {
    console.log(`🔍 Token value: ${token.value.substring(0, 10)}...`);
  }

  // Nếu không có token và đang truy cập route được bảo vệ
  if (!token && !isPublicPath) {
    console.log(
      `❌ Không tìm thấy token, chuyển hướng đến trang đăng nhập từ ${path}`
    );
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Nếu có token và đang truy cập public routes
  if (token && isPublicPath) {
    console.log(`🔄 Đã đăng nhập, chuyển hướng từ ${path} đến trang chủ`);
    // Chỉ chuyển hướng nếu đang ở trang đăng nhập chính
    if (path === "/sign-in" || path === "/sign-up") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  console.log(
    `✅ Đường dẫn ${
      isPublicPath ? "công khai" : "được bảo vệ"
    }, cho phép truy cập`
  );
  return NextResponse.next();
}

// Cấu hình các route cần áp dụng middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
