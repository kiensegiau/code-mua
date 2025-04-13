import { firestore } from '../../../_utils/firebase-admin';
import { verifyAuth } from '../../../_utils/auth-utils';

export async function POST(req) {
  try {
    // Xác thực người dùng
    const { userId } = await verifyAuth(req);
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Bạn cần đăng nhập để sử dụng key' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Lấy dữ liệu từ body
    const { key } = await req.json();
    
    if (!key) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Vui lòng nhập key' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Kiểm tra key trong database
    const keyDoc = await firestore.collection('trial_keys').doc(key).get();
    
    if (!keyDoc.exists) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Key không hợp lệ' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const keyData = keyDoc.data();
    
    // Kiểm tra key đã được sử dụng chưa
    if (keyData.isUsed) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Key đã được sử dụng' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Kiểm tra key có còn hiệu lực không
    if (keyData.expiryDate && new Date(keyData.expiryDate) < new Date()) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Key đã hết hạn' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Kiểm tra người dùng đã sử dụng key khác trong 30 ngày qua chưa
    const userRef = firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.lastKeyUsed && userData.lastKeyUsedAt) {
        const lastKeyDate = new Date(userData.lastKeyUsedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (lastKeyDate > thirtyDaysAgo) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Bạn đã sử dụng key trong 30 ngày qua. Vui lòng thử lại sau.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    
    // Tính thời gian hết hạn VIP (24 giờ sau khi kích hoạt)
    const now = new Date();
    const vipExpiresAt = new Date(now);
    vipExpiresAt.setHours(now.getHours() + 24);
    
    // Cập nhật trạng thái key
    await firestore.collection('trial_keys').doc(key).update({
      isUsed: true,
      usedBy: userId,
      usedAt: now.toISOString(),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // Cập nhật trạng thái VIP cho người dùng
    await userRef.update({
      isVip: true,
      vipExpiresAt: vipExpiresAt.toISOString(),
      vipActivatedAt: now.toISOString(),
      vipActivationType: 'trial-key',
      lastKeyUsed: key,
      lastKeyUsedAt: now.toISOString()
    });
    
    // Ghi log sử dụng key
    await firestore.collection('key_usage_logs').add({
      key,
      userId,
      activatedAt: now.toISOString(),
      expiresAt: vipExpiresAt.toISOString(),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown'
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      vipExpiresAt: vipExpiresAt.toISOString() 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Lỗi khi kích hoạt key:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi kích hoạt key. Vui lòng thử lại sau.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 