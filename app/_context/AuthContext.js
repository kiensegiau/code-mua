"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { auth } from "../_utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import GlobalApi from "../_utils/GlobalApi";
import { useRouter } from "next/navigation";
import nookies from 'nookies';
import { usePathname } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Thời gian hết hạn mặc định của Firebase Token (1 giờ)
const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 giờ tính bằng ms
// Làm mới trước 5 phút khi hết hạn
const REFRESH_TIME_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 phút tính bằng ms
// Thời hạn cookie: 1 năm
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 năm tính bằng giây

// Danh sách các đường dẫn công khai
const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/sign-out'];
const EXCLUDED_PATHS = ['/api', '/_next', '/static', '/favicon.ico', '/public', '/assets'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi component re-render
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const userProfile = await GlobalApi.getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return false;
    }
  }, []);

  // Khai báo logout trước refreshToken để tránh lỗi tham chiếu
  const logout = useCallback(async () => {
    try {
      // Dừng timer làm mới token nếu đang chạy
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      // Gọi API để xóa cookie
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Xóa dữ liệu từ localStorage
      localStorage.removeItem("tokenExpiryTime");

      // Xóa cookie
      nookies.destroy(null, 'firebaseToken', { path: '/' });

      // Đăng xuất khỏi Firebase
      await signOut(auth);

      // Reset state
      setUser(null);
      setProfile(null);

      // Chuyển hướng về trang đăng nhập
      router.push("/sign-in");
      
      return true;
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return false;
    }
  }, [router]);

  // Hàm để làm mới token và lưu vào cookie
  const refreshToken = useCallback(async (forceRefresh = true) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const idToken = await currentUser.getIdToken(forceRefresh);
      
      // Sử dụng nookies để quản lý cookies đồng nhất
      nookies.set(null, 'firebaseToken', idToken, {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      });
      
      console.log("🔄 Đã làm mới token Firebase");
      
      // Lưu thời điểm làm mới và thời điểm hết hạn
      const expiryTime = Date.now() + TOKEN_EXPIRY_TIME;
      localStorage.setItem("tokenExpiryTime", expiryTime.toString());
      
      // Kiểm tra xem người dùng có đang ở trang đăng nhập không và tự động chuyển hướng
      const currentPath = window.location.pathname;
      if (currentPath === '/sign-in' || currentPath === '/sign-up') {
        console.log('🔄 Token đã được làm mới, chuyển hướng đến trang chủ...');
        // Chuyển hướng bằng window.location để đảm bảo trang được tải lại
        setTimeout(() => {
          window.location.href = '/';
        }, 300);
      }
      
      return idToken;
    } catch (error) {
      console.error("❌ Lỗi khi làm mới token Firebase:", error);
      
      // Kiểm tra lỗi liên quan đến tài khoản bị vô hiệu
      if (
        error.code === 'auth/user-token-expired' || 
        error.code === 'auth/user-disabled' || 
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/id-token-expired'
      ) {
        console.log("🚫 Tài khoản không hợp lệ hoặc bị vô hiệu hóa");
        await logout();
      }
      
      return null;
    }
  }, [logout]);

  // Hàm thiết lập hẹn giờ làm mới token
  const setupTokenRefresh = useCallback((currentUser) => {
    // Xóa hẹn giờ cũ nếu có
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Lấy thời gian hết hạn token từ localStorage
    const expiryTime = localStorage.getItem("tokenExpiryTime");
    const now = Date.now();
    
    // Tính thời gian cần làm mới token (5 phút trước khi hết hạn)
    let timeUntilRefresh;
    
    if (expiryTime && parseInt(expiryTime) > now) {
      timeUntilRefresh = Math.max(
        0, 
        parseInt(expiryTime) - now - REFRESH_TIME_BEFORE_EXPIRY
      );
    } else {
      // Làm mới ngay lập tức nếu không có thời gian hết hạn hoặc đã hết hạn
      refreshToken(true);
      // Đặt thời gian làm mới tiếp theo là 55 phút
      timeUntilRefresh = TOKEN_EXPIRY_TIME - REFRESH_TIME_BEFORE_EXPIRY;
    }
    
    console.log(`⏱️ Đặt lịch làm mới token sau ${Math.floor(timeUntilRefresh/60000)} phút`);
    
    // Thiết lập hẹn giờ mới
    refreshTimerRef.current = setTimeout(async () => {
      console.log("⏱️ Đến thời gian làm mới token Firebase");
      if (auth.currentUser) {
        await refreshToken(true);
        // Thiết lập lại hẹn giờ cho lần làm mới tiếp theo
        setupTokenRefresh(auth.currentUser);
      }
    }, timeUntilRefresh);
  }, [refreshToken]);

  // Kiểm tra và chuyển hướng dựa trên trạng thái đăng nhập và đường dẫn hiện tại
  useEffect(() => {
    // Bỏ qua kiểm tra khi đang tải hoặc không có router/pathname
    if (loading || !pathname) return;

    console.log(`🧭 Đang kiểm tra đường dẫn: ${pathname}`);

    // Kiểm tra nếu là đường dẫn loại trừ (API, tệp tĩnh, v.v.)
    if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
      console.log(`⏩ Bỏ qua đường dẫn đặc biệt: ${pathname}`);
      return;
    }

    // Kiểm tra xem đường dẫn có phải là công khai không
    const isPublicPath = PUBLIC_PATHS.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isPublicPath) {
      console.log(`🔓 Đường dẫn công khai: ${pathname}`);
    } else {
      console.log(`🔒 Đường dẫn được bảo vệ: ${pathname}`);
    }

    // Người dùng đã đăng nhập và đang truy cập trang đăng nhập/đăng ký
    // Xử lý case này trước để ưu tiên chuyển hướng người dùng đã đăng nhập
    if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
      console.log(`✅ Người dùng đã đăng nhập, chuyển hướng từ ${pathname} đến trang chủ`);
      // Dùng setTimeout để đảm bảo chuyển hướng xảy ra sau khi tất cả state được cập nhật
      setTimeout(() => {
        router.push('/');
      }, 100);
      return;
    }

    // Người dùng chưa đăng nhập và đang truy cập đường dẫn được bảo vệ
    if (!user && !isPublicPath) {
      console.log(`⛔ Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập từ ${pathname}`);
      router.replace('/sign-in');
      return;
    }

    console.log(`✓ Cho phép truy cập: ${pathname}`);
  }, [user, loading, pathname, router]);

  useEffect(() => {
    let unsubscribe;
    let isMounted = true; // Sử dụng biến để kiểm tra component còn mounted không

    const initAuth = async () => {
      // Lắng nghe sự thay đổi trạng thái xác thực từ Firebase
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return; // Tránh cập nhật state nếu component đã unmounted

        if (firebaseUser) {
          console.log("👤 Phát hiện người dùng Firebase:", firebaseUser.email);
          
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser.uid);
          
          // Làm mới token và thiết lập hẹn giờ
          await refreshToken(false); // false để tránh làm mới không cần thiết
          setupTokenRefresh(firebaseUser);
        } else {
          console.log("👤 Không có người dùng Firebase đăng nhập");
          setUser(null);
          setProfile(null);
          
          // Xóa hẹn giờ làm mới token
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
          }
        }

        if (isMounted) setLoading(false);
      });
    };

    // Khởi tạo xác thực ngay khi component mount
    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      // Dọn dẹp hẹn giờ khi component unmount
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [fetchUserProfile, setupTokenRefresh, refreshToken]);

  // Thêm hàm để xác thực token ở server-side
  const verifyTokenServer = useCallback(async () => {
    try {
      console.log('🔍 Đang gửi request xác thực token đến API...');
      
      // Đảm bảo gửi credentials để cookie được gửi cùng request
      const response = await fetch('/api/auth/verify-token', {
        method: 'GET',
        credentials: 'include', // Quan trọng: đảm bảo cookie được gửi
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.valid) {
        console.error('❌ Token không hợp lệ:', data.message || response.statusText);
        return false;
      }
      
      console.log('✅ Token hợp lệ, hết hạn:', data.expiresAt);
      return true;
    } catch (error) {
      console.error('❌ Lỗi xác thực token:', error);
      return false;
    }
  }, []);

  // Kiểm tra token hợp lệ chỉ sau khi token đã được làm mới
  useEffect(() => {
    let tokenCheckTimeout;
    
    const checkToken = async () => {
      // Bỏ qua kiểm tra nếu đang trong quá trình loading hoặc không có user
      if (loading || !user) return;
      
      // Đã phát hiện đăng nhập thành công, đảm bảo người dùng được chuyển hướng khỏi trang đăng nhập
      if (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up') {
        console.log('🔄 Đăng nhập thành công, chuyển hướng đến trang chủ...');
        window.location.href = '/'; // Dùng window.location để đảm bảo chuyển hướng xảy ra
        return;
      }
      
      // Đợi một chút để đảm bảo token đã được lưu vào cookie
      tokenCheckTimeout = setTimeout(async () => {
        console.log('🔄 Bắt đầu kiểm tra token server-side...');
        
        // Kiểm tra token
        const isValid = await verifyTokenServer();
        
        // Nếu token không hợp lệ, đăng xuất
        if (!isValid) {
          console.log('🚫 Token không hợp lệ, đăng xuất');
          await logout();
        } else {
          console.log('✅ Xác thực token thành công!');
        }
      }, 1000); // Đợi 1s sau khi user được xác định
    };
    
    checkToken();
    
    return () => {
      if (tokenCheckTimeout) clearTimeout(tokenCheckTimeout);
    };
  }, [loading, user, verifyTokenServer, logout]);

  // Sử dụng useMemo để tránh tạo lại object context mỗi khi component re-render
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      setProfile,
      loading,
      logout,
      refreshToken,
      verifyTokenServer,
      isAuthenticated: !!user,
    }),
    [user, profile, loading, logout, refreshToken, verifyTokenServer]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
