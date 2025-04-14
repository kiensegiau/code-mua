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
import { onAuthStateChanged, signOut, signInWithCustomToken, getIdToken } from "firebase/auth";
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
// Thời gian học thử VIP: 24 giờ
const VIP_TRIAL_PERIOD = 24 * 60 * 60 * 1000; // 24 giờ tính bằng ms

// Danh sách các đường dẫn công khai
const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/sign-out'];
const EXCLUDED_PATHS = ['/api', '/_next', '/static', '/favicon.ico', '/public', '/assets', '/topuni'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActivatingVip, setIsActivatingVip] = useState(false);
  const [vipActivationError, setVipActivationError] = useState(null);
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

  // Hàm lưu ID token vào cookie thông qua API
  const setTokenInCookie = useCallback(async (idToken) => {
    try {
      const response = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        throw new Error('Không thể lưu token vào cookie');
      }
      
      return true;
    } catch (error) {
      console.error("❌ Lỗi khi lưu token vào cookie:", error);
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

  // Hàm để làm mới token bằng cách gọi API
  const refreshToken = useCallback(async (forceRefresh = true) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      // Gọi API để lấy custom token
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          forceRefresh,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể lấy custom token');
      }

      const data = await response.json();
      const customToken = data.customToken;
      
      // Đăng nhập với custom token để lấy ID token mới
      await signInWithCustomToken(auth, customToken);
      
      // Lấy ID token mới
      const idToken = await getIdToken(auth.currentUser, true);
      
      // Lưu ID token vào cookie thông qua API
      await setTokenInCookie(idToken);
      
      // Lưu thời điểm làm mới và thời điểm hết hạn
      localStorage.setItem("tokenExpiryTime", data.expiryTime.toString());
      
      // Kiểm tra xem người dùng có đang ở trang đăng nhập không và tự động chuyển hướng
      const currentPath = window.location.pathname;
      if (currentPath === '/sign-in' || currentPath === '/sign-up') {
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
        await logout();
      }
      
      return null;
    }
  }, [logout, setTokenInCookie]);

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
    
    // Thiết lập hẹn giờ mới
    refreshTimerRef.current = setTimeout(async () => {
      if (auth.currentUser) {
        await refreshToken(true);
        // Thiết lập lại hẹn giờ cho lần làm mới tiếp theo
        setupTokenRefresh(auth.currentUser);
      }
    }, timeUntilRefresh);
  }, [refreshToken]);

  // Hàm kích hoạt VIP bằng key
  const activateVipWithKey = useCallback(async (trialKey) => {
    try {
      setIsActivatingVip(true);
      setVipActivationError(null);
      
      // Đảm bảo người dùng đã đăng nhập
      if (!user) {
        throw new Error('Vui lòng đăng nhập để kích hoạt khóa học');
      }
      
      // Gọi API kiểm tra và kích hoạt key
      const response = await fetch("/api/vip/activate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          key: trialKey,
          userId: user.uid 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể kích hoạt key');
      }
      
      const data = await response.json();
      
      // Cập nhật profile với quyền VIP
      setProfile(prev => ({
        ...prev,
        isVip: true,
        vipExpiresAt: data.vipExpiresAt,
        vipActivatedBy: 'trial-key'
      }));
      
      return { success: true, expiresAt: data.vipExpiresAt };
    } catch (error) {
      console.error("Lỗi khi kích hoạt VIP với key:", error);
      setVipActivationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsActivatingVip(false);
    }
  }, [user]);

  // Kiểm tra trạng thái VIP
  const checkVipStatus = useCallback(() => {
    if (!profile) return false;
    
    // Kiểm tra người dùng có quyền VIP và chưa hết hạn
    const isVipActive = profile.isVip === true && 
      profile.vipExpiresAt && 
      new Date(profile.vipExpiresAt) > new Date();
      
    return isVipActive;
  }, [profile]);

  // Hàm lấy thời gian còn lại của VIP
  const getVipTimeRemaining = useCallback(() => {
    if (!profile || !profile.vipExpiresAt) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const now = new Date();
    const expiryDate = new Date(profile.vipExpiresAt);
    const timeRemaining = expiryDate - now;
    
    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [profile]);

  // Kiểm tra và chuyển hướng dựa trên trạng thái đăng nhập và đường dẫn hiện tại
  useEffect(() => {
    // Bỏ qua kiểm tra khi đang tải hoặc không có router/pathname
    if (loading || !pathname) return;

    // Kiểm tra nếu là đường dẫn loại trừ (API, tệp tĩnh, v.v.)
    if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
      return;
    }

    // Kiểm tra xem đường dẫn có phải là công khai không
    const isPublicPath = PUBLIC_PATHS.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );

    // Người dùng đã đăng nhập và đang truy cập trang đăng nhập/đăng ký
    // Xử lý case này trước để ưu tiên chuyển hướng người dùng đã đăng nhập
    if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
      // Dùng setTimeout để đảm bảo chuyển hướng xảy ra sau khi tất cả state được cập nhật
      setTimeout(() => {
        router.push('/');
      }, 100);
      return;
    }

    // Người dùng chưa đăng nhập và đang truy cập đường dẫn được bảo vệ
    if (!user && !isPublicPath) {
      router.replace('/sign-in');
      return;
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    let unsubscribe;
    let isMounted = true; // Sử dụng biến để kiểm tra component còn mounted không

    const initAuth = async () => {
      // Lắng nghe sự thay đổi trạng thái xác thực từ Firebase
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return; // Tránh cập nhật state nếu component đã unmounted

        if (firebaseUser) {
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser.uid);
          
          // Làm mới token và thiết lập hẹn giờ
          await refreshToken(false); // false để tránh làm mới không cần thiết
          setupTokenRefresh(firebaseUser);
        } else {
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
        return false;
      }
      
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
        window.location.href = '/'; // Dùng window.location để đảm bảo chuyển hướng xảy ra
        return;
      }
      
      // Đợi một chút để đảm bảo token đã được lưu vào cookie
      tokenCheckTimeout = setTimeout(async () => {
        // Kiểm tra token
        const isValid = await verifyTokenServer();
        
        // Nếu token không hợp lệ, đăng xuất
        if (!isValid) {
          await logout();
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
      // Các chức năng liên quan đến VIP
      isVip: checkVipStatus(),
      vipExpiresAt: profile?.vipExpiresAt || null,
      activateVipWithKey,
      isActivatingVip,
      vipActivationError,
      getVipTimeRemaining,
    }),
    [user, profile, loading, logout, refreshToken, verifyTokenServer, checkVipStatus, activateVipWithKey, isActivatingVip, vipActivationError, getVipTimeRemaining]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
