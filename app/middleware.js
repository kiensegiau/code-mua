import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const publicPaths = ["/sign-in", "/sign-up", "/forgot-password"];
  const path = request.nextUrl.pathname;

  // Cho phép truy cập các static files và API routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  console.log('🔒 Middleware - Token:', token ? 'Exists' : 'None');
  console.log('🛣️ Middleware - Path:', path);

  // Nếu không có token và đang truy cập route được bảo vệ
  if (!token && !publicPaths.includes(path)) {
    console.log('⚠️ No token, redirecting to sign-in');
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Nếu có token và đang truy cập public routes
  if (token && publicPaths.includes(path)) {
    console.log('✅ Has token, redirecting to dashboard');
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
