import { Outfit } from "next/font/google";
import "plyr-react/plyr.css";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import Toast from "./(router)/_components/Toast";
import PageTransition from "./(router)/_components/PageTransition";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./_context/ThemeContext";

// Tối ưu font loading với display swap
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

// Lazy load AuthWrapper để cải thiện thời gian tải trang ban đầu
const AuthWrapper = dynamic(() => import("./_components/AuthWrapper"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>Loading...</div>
    </div>
  ),
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
      <body className={`${outfit.className} theme-bg theme-text`}>
        <AuthProvider>
          <ThemeProvider>
            <AuthWrapper>
              <PageTransition>{children}</PageTransition>
            </AuthWrapper>
          </ThemeProvider>
        </AuthProvider>
        <Toast />
      </body>
    </html>
  );
}
