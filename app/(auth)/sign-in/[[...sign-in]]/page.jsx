"use client"
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/_utils/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateTokens, setTokenCookie } from '@/app/_utils/jwt';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

function TypewriterEffect({ text, delay = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayText}</span>;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔑 Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase login successful");
      
      const user = userCredential.user;
      console.log("👤 User info:", { email: user.email, uid: user.uid });
      
      const { accessToken, refreshToken } = await generateTokens(user);
      console.log("🎟️ Tokens generated");
      
      await setTokenCookie(accessToken);
      console.log("🍪 Token saved to cookie");
      
      // Lưu token vào localStorage để sử dụng khi cần
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log("💾 Tokens saved to localStorage");
      
      toast.success('Đăng nhập thành công!');
      router.replace('/');
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Tài khoản này đã bị vô hiệu hóa.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
          break;
      }
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#141414] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#ff4d4f]/30 to-[#ff7875]/30 rounded-full mix-blend-screen blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full mix-blend-screen blur-3xl animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full mix-blend-screen blur-3xl animate-pulse delay-700"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, #141414 70%)' }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
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
            <p className="text-gray-400 text-lg">
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
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800/50"
          >
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-colors"
                  placeholder="Email của bạn"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#ff4d4f] focus:border-[#ff4d4f] transition-colors"
                  placeholder="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                className="w-full bg-gradient-to-r from-[#ff4d4f] to-[#ff7875] text-white py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
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
