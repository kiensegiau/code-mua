import { Inter, Outfit } from "next/font/google";
import "plyr-react/plyr.css";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import Toast from "./(router)/_components/Toast";
import PageTransition from "./(router)/_components/PageTransition";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./_context/ThemeContext";

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

const inter = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-bg theme-text`}>
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
