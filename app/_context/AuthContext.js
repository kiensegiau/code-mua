"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { auth } from "../_utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { verifyJwtToken } from "../_utils/jwt";

const AuthContext = createContext({});

// Thay đổi cách lấy thông tin người dùng, sử dụng API route
const fetchUserProfileFromAPI = async (userId) => {
  try {
    // Lấy token từ localStorage nếu có
    const accessToken = localStorage.getItem("accessToken");
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Thêm token vào header nếu có
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include' // Gửi cookie
    });
    
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi component re-render
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const userProfile = await fetchUserProfileFromAPI(userId);
      if (userProfile) {
        setProfile(userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return false;
    }
  }, []);

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
        } else {
          // Khi không có user từ Firebase, kiểm tra token trong localStorage
          try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
              const payload = await verifyJwtToken(accessToken);

              if (payload && payload.uid) {
                // Nếu token hợp lệ, thử lấy thông tin user profile
                const profileFetched = await fetchUserProfile(payload.uid);

                if (profileFetched && isMounted) {
                  // Tạo một user object giả để duy trì session
                  setUser({
                    uid: payload.uid,
                    email: payload.email || "",
                    isTokenUser: true, // Đánh dấu đây là user từ token
                  });
                } else if (isMounted) {
                  // Nếu không thể lấy profile, logout
                  setUser(null);
                  setProfile(null);
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                }
              } else if (isMounted) {
                // Token không hợp lệ
                setUser(null);
                setProfile(null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
              }
            } else if (isMounted) {
              // Không có token nào trong localStorage
              setUser(null);
              setProfile(null);
            }
          } catch (error) {
            console.error("❌ Error verifying token:", error);
            if (isMounted) {
              setUser(null);
              setProfile(null);
            }
          }
        }

        if (isMounted) setLoading(false);
      });
    };

    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sử dụng useMemo để tránh tạo lại object context mỗi khi component re-render
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      setProfile,
      loading,
    }),
    [user, profile, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
