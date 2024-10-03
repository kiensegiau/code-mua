import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase/auth";
import { app } from "./_utils/firebase";
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="Đang tải..." />
  </div>
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const publicPaths = ["/sign-in", "/sign-up", "/forgot-password"];
  const path = request.nextUrl.pathname;

  console.log('Token:', token);
  console.log('Path:', path);

  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
