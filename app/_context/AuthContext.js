"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../_utils/firebase';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import GlobalApi from '../_utils/GlobalApi';
import { verifyJwtToken } from '../_utils/jwt';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm này sẽ lấy user profile từ database dựa trên user ID
  const fetchUserProfile = async (userId) => {
    try {
      const userProfile = await GlobalApi.getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
  };

  useEffect(() => {
    let unsubscribe;
    
    const initAuth = async () => {
      // Lắng nghe sự thay đổi trạng thái xác thực từ Firebase
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("🔄 Auth state changed:", firebaseUser ? `User: ${firebaseUser.email}` : "No user");
        
        if (firebaseUser) {
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser.uid);
        } else {
          // Khi không có user từ Firebase, kiểm tra token trong localStorage
          try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
              console.log("🔍 Found token in localStorage, verifying...");
              const payload = await verifyJwtToken(accessToken);
              
              if (payload && payload.uid) {
                console.log("✅ Token verified, attempting to restore session");
                // Nếu token hợp lệ, thử lấy thông tin user profile
                const profileFetched = await fetchUserProfile(payload.uid);
                
                if (profileFetched) {
                  // Tạo một user object giả để duy trì session
                  setUser({
                    uid: payload.uid,
                    email: payload.email || '',
                    isTokenUser: true  // Đánh dấu đây là user từ token
                  });
                } else {
                  // Nếu không thể lấy profile, logout
                  setUser(null);
                  setProfile(null);
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                }
              } else {
                // Token không hợp lệ
                console.log("❌ Token invalid, clearing localStorage");
                setUser(null);
                setProfile(null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
              }
            } else {
              // Không có token nào trong localStorage
              setUser(null);
              setProfile(null);
            }
          } catch (error) {
            console.error("❌ Error verifying token:", error);
            setUser(null);
            setProfile(null);
          }
        }
        
        setLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};