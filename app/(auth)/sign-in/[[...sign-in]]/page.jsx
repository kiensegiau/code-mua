"use client";
import { useState, useEffect, useCallback } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";
import nookies from 'nookies';

function TypewriterEffect({ text, delay = 50 }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayText}</span>;
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { refreshToken } = useAuth();

  // Theo dõi số lần đăng nhập thất bại để ngăn chặn brute force
  const [loginAttempts, setLoginAttempts] = useState(0);
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 phút
  const [lockedUntil, setLockedUntil] = useState(null);

  // Kiểm tra thời gian khóa
  useEffect(() => {
    if (lockedUntil) {
      const checkLockInterval = setInterval(() => {
        if (Date.now() > lockedUntil) {
          setLockedUntil(null);
          setLoginAttempts(0);
          clearInterval(checkLockInterval);
        }
      }, 1000);
      
      return () => clearInterval(checkLockInterval);
    }
  }, [lockedUntil]);

  // Kiểm tra trạng thái đăng nhập khi trang được tải
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("👤 Đã phát hiện người dùng đăng nhập qua Firebase:", user.email);
        try {
          // Lấy token và truyền tới context để xử lý
          await refreshToken(true);
          console.log("✅ Đã làm mới token Firebase");
          router.push("/");
        } catch (error) {
          console.error("❌ Lỗi khi lấy token:", error);
          setIsCheckingAuth(false);
        }
      } else {
        console.log("🔍 Không phát hiện người dùng Firebase, hiển thị trang đăng nhập");
        setIsCheckingAuth(false);
      }
    });

    // Clean up function để ngăn memory leak
    return () => unsubscribe();
  }, [router, refreshToken]);

  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Kiểm tra khóa đăng nhập
    if (lockedUntil) {
      const remainingMinutes = Math.ceil((lockedUntil - Date.now()) / (60 * 1000));
      setError(`Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau ${remainingMinutes} phút.`);
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔑 Đang đăng nhập với:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Đăng nhập Firebase thành công");
      
      // Đặt lại số lần đăng nhập thất bại
      setLoginAttempts(0);
      
      // Gọi refreshToken trong context để xử lý token
      await refreshToken(true);
      
      // Chuyển hướng đến trang chính
      router.push("/");
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      
      // Tăng số lần đăng nhập thất bại
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Khóa tài khoản nếu vượt quá số lần thử
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_TIME);
        setError(`Đã vượt quá số lần thử đăng nhập. Tài khoản bị khóa trong 15 phút.`);
        setIsLoading(false);
        return;
      }
      
      let errorMessage = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Email hoặc mật khẩu không chính xác.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Tài khoản không tồn tại.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Tài khoản này đã bị vô hiệu hóa.";
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [email, password, loginAttempts, lockedUntil, refreshToken, router]);

  // Nếu đang kiểm tra trạng thái đăng nhập, hiển thị loading
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Đang kiểm tra thông tin đăng nhập...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Animated background - giảm độ mờ để background đen nổi bật hơn */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#ff4d4f]/20 to-[#ff7875]/20 rounded-full mix-blend-screen blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-[#ff4d4f]/15 to-[#ff7875]/15 rounded-full mix-blend-screen blur-3xl animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-[#ff4d4f]/15 to-[#ff7875]/15 rounded-full mix-blend-screen blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Floating particles - giảm số lượng và độ trong suốt cao hơn */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, #000000 60%)",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#ff4d4f] rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-black/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-white mb-3">
              <TypewriterEffect text="Chào mừng trở lại! 👋" delay={80} />
            </h1>
            <p className="text-[#ff7875] text-lg">
              <TypewriterEffect
                text="Đăng nhập để tiếp tục hành trình học tập của bạn"
                delay={50}
              />
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#ff4d4f]/20"
          >
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff7875] h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/80 border border-[#ff4d4f]/30 text-white rounded-lg focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-colors"
                  placeholder="Email của bạn"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff7875] h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-black/80 border border-[#ff4d4f]/30 text-white rounded-lg focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-colors"
                  placeholder="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ff7875] hover:text-[#ff4d4f]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#ff4d4f] to-[#ff7875] text-white py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Đang xử lý...</span>
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center justify-center">
                    Đăng nhập
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                      initial={false}
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  </span>
                )}
              </motion.button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-sm mt-6">
                <Link
                  href="/sign-up"
                  className="text-[#ff4d4f] hover:text-[#ff7875] font-medium transition-colors"
                >
                  Chưa có tài khoản?
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-[#ff4d4f] hover:text-[#ff7875] font-medium transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
