import { firestore } from '../../../_utils/firebase-admin';
import { verifyAuth } from '../../../_utils/auth-utils';
import { randomBytes } from 'crypto';

// Hàm tạo key ngẫu nhiên
function generateTrialKey(length = 12) {
  const bytes = randomBytes(Math.ceil(length * 3 / 4));
  return bytes.toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
    .substring(0, length)
    .toUpperCase();
}

export async function POST(req) {
  try {
    // Xác thực người dùng là admin
    const { userId, userRole } = await verifyAuth(req);
    
    if (!userId || userRole !== 'admin') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Không có quyền truy cập' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Lấy tham số từ body request
    const { quantity = 10, expiryDays = 30, campaign = 'default' } = await req.json();
    
    // Tính ngày hết hạn của key
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Tạo batch để thực hiện nhiều thao tác cùng lúc
    const batch = firestore.batch();
    const keys = [];
    
    // Tạo các key mới
    for (let i = 0; i < quantity; i++) {
      const keyValue = generateTrialKey();
      const keyRef = firestore.collection('trial_keys').doc(keyValue);
      
      batch.set(keyRef, {
        key: keyValue,
        createdAt: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        isUsed: false,
        campaign,
        createdBy: userId
      });
      
      keys.push(keyValue);
    }
    
    // Thực hiện batch
    await batch.commit();
    
    return new Response(JSON.stringify({ 
      success: true,
      keys,
      expiryDate: expiryDate.toISOString(),
      campaign
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Lỗi khi tạo key:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi tạo key. Vui lòng thử lại sau.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 