import { firestore } from '../../../_utils/firebase-admin';
import { verifyAuth } from '../../../_utils/auth-utils';

export async function GET(req) {
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
    
    // Lấy tham số từ URL
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const campaign = url.searchParams.get('campaign');
    const isUsed = url.searchParams.get('isUsed');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortDir = url.searchParams.get('sortDir') || 'desc';
    
    // Tạo query cơ bản
    let query = firestore.collection('trial_keys');
    
    // Thêm điều kiện lọc
    if (campaign) {
      query = query.where('campaign', '==', campaign);
    }
    
    if (isUsed !== null && isUsed !== undefined) {
      const isUsedBool = isUsed === 'true';
      query = query.where('isUsed', '==', isUsedBool);
    }
    
    // Sắp xếp
    query = query.orderBy(sortBy, sortDir);
    
    // Phân trang
    const startAt = (page - 1) * limit;
    query = query.limit(limit).offset(startAt);
    
    // Thực hiện query
    const snapshot = await query.get();
    
    // Lấy tổng số key (không phân trang)
    const countQuery = firestore.collection('trial_keys');
    if (campaign) {
      countQuery.where('campaign', '==', campaign);
    }
    if (isUsed !== null && isUsed !== undefined) {
      const isUsedBool = isUsed === 'true';
      countQuery.where('isUsed', '==', isUsedBool);
    }
    const countSnapshot = await countQuery.count().get();
    const totalCount = countSnapshot.data().count;
    
    // Chuyển đổi dữ liệu
    const keys = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      keys.push({
        key: doc.id,
        createdAt: data.createdAt,
        expiryDate: data.expiryDate,
        isUsed: data.isUsed,
        usedAt: data.usedAt || null,
        usedBy: data.usedBy || null,
        campaign: data.campaign,
        ipAddress: data.ipAddress || null
      });
    });
    
    // Lấy danh sách các campaigns
    const campaignsSnapshot = await firestore.collection('trial_keys')
      .select('campaign')
      .distinct()
      .get();
    
    const campaigns = [];
    campaignsSnapshot.forEach(doc => {
      const campaign = doc.data().campaign;
      if (campaign && !campaigns.includes(campaign)) {
        campaigns.push(campaign);
      }
    });
    
    // Thống kê
    const statsSnapshot = await firestore.collection('trial_keys').get();
    let totalKeys = 0;
    let usedKeys = 0;
    
    statsSnapshot.forEach(doc => {
      const data = doc.data();
      totalKeys++;
      if (data.isUsed) usedKeys++;
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      keys,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      },
      filters: {
        availableCampaigns: campaigns
      },
      stats: {
        totalKeys,
        usedKeys,
        unusedKeys: totalKeys - usedKeys,
        usageRate: totalKeys ? (usedKeys / totalKeys * 100).toFixed(2) : 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách key:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi lấy danh sách key. Vui lòng thử lại sau.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 