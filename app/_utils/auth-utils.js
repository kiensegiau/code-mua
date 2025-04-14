import { auth } from './firebase-admin';
import { cookies } from 'next/headers';

/**
 * Xác thực người dùng từ token trong cookie
 */
export async function verifyAuth(req) {
  try {
    // Lấy token từ cookie
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    
    if (!token) {
      return { userId: null, userRole: null };
    }
    
    // Xác thực token với Firebase Auth
    const decodedToken = await auth.verifyIdToken(token);
    
    // Lấy thông tin user từ Firebase
    const userRecord = await auth.getUser(decodedToken.uid);
    
    // Xác định role của user (mặc định là 'user')
    const userRole = userRecord.customClaims?.role || 'user';
    
    return {
      userId: decodedToken.uid,
      userRole
    };
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    return { userId: null, userRole: null };
  }
} 