import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Danh sách các đường dẫn không yêu cầu xác thực
  const publicPaths = ["/sign-in", "/sign-up", "/forgot-password", "/login"];
  
  // Các route cần xác thực
  const protectedRoutes = [
    '/dashboard',
    '/my-courses',
    '/purchases',
    '/profile'
  ];

  // Kiểm tra xem route hiện tại có cần xác thực không
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Cho phép truy cập các route công khai
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Kiểm tra route được bảo vệ - đơn giản hóa logic
  if (isProtectedRoute) {
    // Trong khi phát triển, luôn cho phép truy cập để tránh lỗi xác thực
    // TODO: Thêm logic xác thực thực tế sau
    return NextResponse.next();
    
    // Sau này sẽ bật xác thực với đoạn code như sau:
    // const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname);
    // return NextResponse.redirect(loginUrl);
  }

  // Cho phép truy cập các route không được bảo vệ
  return NextResponse.next();
}

// Cấu hình các route cần áp dụng middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-courses/:path*',
    '/purchases/:path*',
    '/profile/:path*',
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/login/:path*',
    '/forgot-password/:path*'
  ]
};
