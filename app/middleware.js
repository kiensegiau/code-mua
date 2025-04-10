import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import admin from '../_utils/firebaseAdmin';

// Định nghĩa các đường dẫn công khai một lần để tránh tạo lại mỗi request
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/sign-out",
];
const STATIC_FILE_PATHS = ["/_next", "/static", "/favicon.ico", "/public", "/assets"];
const API_PATHS = ["/api"];

// Cache cho xác thực token để tránh gọi nhiều lần
const tokenVerificationCache = new Map();
const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 phút

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Kiểm tra nhanh các đường dẫn tĩnh trước
  if (STATIC_FILE_PATHS.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Kiểm tra đường dẫn API
  if (API_PATHS.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Kiểm tra xem đường dẫn có phải là public path không
  const isPublicPath = PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // Lấy token từ cookie
  const firebaseToken = request.cookies.get("firebaseToken");

  // Nếu không có token và đang truy cập route được bảo vệ
  if (!firebaseToken && !isPublicPath) {
    console.log(`❌ Không tìm thấy token, chuyển hướng đến trang đăng nhập từ ${path}`);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Nếu có token và đường dẫn không phải là public, xác thực token
  if (firebaseToken && !isPublicPath) {
    try {
      // Kiểm tra xem token đã được xác thực trong cache chưa
      const cachedVerification = tokenVerificationCache.get(firebaseToken.value);
      const now = Date.now();
      
      let decodedToken;
      
      if (cachedVerification && cachedVerification.expiry > now) {
        // Sử dụng kết quả từ cache
        decodedToken = cachedVerification.decodedToken;
      } else {
        // Xác thực token Firebase
        decodedToken = await admin.auth().verifyIdToken(firebaseToken.value);
        
        // Lưu kết quả vào cache
        tokenVerificationCache.set(firebaseToken.value, {
          decodedToken,
          expiry: now + CACHE_MAX_AGE,
        });
        
        // Dọn dẹp cache cũ để tránh memory leak
        cleanupCache();
      }
      
      // Thêm thông tin user vào request headers để có thể sử dụng ở phía server
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decodedToken.uid);
      requestHeaders.set('x-user-role', decodedToken.role || 'user');
      
      // Trả về request với headers đã được cập nhật
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("❌ Token Firebase không hợp lệ:", error.message);
      // Chuyển hướng về trang đăng nhập
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Nếu có token và đang truy cập public routes (như sign-in)
  if (firebaseToken && isPublicPath) {
    // Chỉ chuyển hướng nếu đang ở trang đăng nhập chính
    if (path === "/sign-in" || path === "/sign-up") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Hàm dọn dẹp cache để tránh memory leak
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of tokenVerificationCache.entries()) {
    if (value.expiry < now) {
      tokenVerificationCache.delete(key);
    }
  }
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
