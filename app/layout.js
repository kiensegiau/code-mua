import { Outfit } from "next/font/google";
import "plyr-react/plyr.css";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import Toast from "./(router)/_components/Toast";
import PageTransition from "./(router)/_components/PageTransition";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./_context/ThemeContext";
import QueryProvider from "./_providers/QueryProvider";
import ErrorBoundary from "./_components/ErrorBoundary";

// Tối ưu font loading với display swap
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

// Thêm metadata để cải thiện SEO
export const metadata = {
  title: "Hocmai - Nền tảng học trực tuyến",
  description: "Nền tảng học trực tuyến hàng đầu Việt Nam",
};

// Tách viewport thành hàm riêng theo hướng dẫn mới của Next.js
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>{/* Không có Script disable-devtool */}</head>
      <body className={`${outfit.className} theme-bg theme-text`}>
        {/* Không có DisableDevTools */}
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              {/* Bọc toàn bộ ứng dụng trong ErrorBoundary để xử lý lỗi client-side */}
              <ErrorBoundary>
                <PageTransition>{children}</PageTransition>
              </ErrorBoundary>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
        <Toast />
      </body>
    </html>
  );
}
