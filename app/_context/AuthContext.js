import { createContext, useContext, useEffect, useState } from 'react';
import { auth,db } from '../_utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../_utils/jwt';
import { doc, getDoc } from 'firebase/firestore';
const AuthContext = createContext();
import GlobalApi from '../_utils/GlobalApi';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userProfile = await GlobalApi.getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const checkTokens = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        const decodedAccessToken = verifyAccessToken(accessToken);
        if (decodedAccessToken) {
          setUser(decodedAccessToken);
        } else if (refreshToken) {
          const decodedRefreshToken = verifyRefreshToken(refreshToken);
          if (decodedRefreshToken) {
            const { accessToken: newAccessToken } = await generateTokens(decodedRefreshToken);
            localStorage.setItem('accessToken', newAccessToken);
            setUser(decodedRefreshToken);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        }
      }
    };

    checkTokens();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { accessToken, refreshToken } = await generateTokens(firebaseUser);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(firebaseUser);
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile ,loading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);