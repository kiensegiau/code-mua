# Hướng dẫn Chuyển đổi từ Firebase sang MongoDB

## Giới thiệu

Tài liệu này hướng dẫn quy trình chuyển đổi dự án từ Firebase sang MongoDB để sử dụng tại backend. Việc chuyển đổi này giúp:

- Tách biệt dữ liệu giữa frontend và backend
- Tăng khả năng mở rộng và tùy biến
- Giảm chi phí khi dự án phát triển lớn

## Thiết lập MongoDB

1. Đảm bảo bạn đã cài đặt và thiết lập MongoDB ở máy chủ của bạn, hoặc đăng ký một tài khoản MongoDB Atlas.

2. Tạo database "hocmai" và các collections: 
   - users
   - courses
   - purchases

3. Cập nhật biến môi trường trong file `.env`:

```
MONGODB_URI=mongodb://localhost:27017/hocmai
# hoặc chuỗi kết nối MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hocmai?retryWrites=true&w=majority
```

## Di chuyển Dữ liệu

Dự án cung cấp một script tự động di chuyển dữ liệu từ Firebase Firestore sang MongoDB:

```bash
npm run migrate-db
```

Script này sẽ:
1. Đọc dữ liệu từ Firestore
2. Sao lưu dữ liệu vào thư mục `scripts/firestore-backup`
3. Chuyển đổi dữ liệu sang định dạng phù hợp với MongoDB
4. Lưu dữ liệu vào MongoDB

## Cấu trúc Code

Sau khi chuyển đổi, dự án sẽ có cấu trúc như sau:

- `app/_utils/mongodb.js` - File kết nối MongoDB
- `app/_utils/models/` - Chứa các Mongoose models
  - `User.js` - Model người dùng
  - `Course.js` - Model khóa học
  - `Purchase.js` - Model giao dịch mua khóa học
- `app/_utils/GlobalMongoApi.js` - API functions mới sử dụng MongoDB
- `scripts/migrateFirebaseToMongo.js` - Script di chuyển dữ liệu

## Cách Sử dụng

Để sử dụng MongoDB thay cho Firebase:

1. Trong các components và API routes, import `GlobalMongoApi` thay vì `GlobalApi`:

```javascript
// Thay vì
import GlobalApi from "@/app/_utils/GlobalApi";

// Sử dụng
import GlobalMongoApi from "@/app/_utils/GlobalMongoApi";
```

2. Các phương thức của `GlobalMongoApi` tương thích với `GlobalApi`, nên bạn có thể thay thế trực tiếp:

```javascript
// Thay vì
const user = await GlobalApi.getUserProfile(userId);

// Sử dụng
const user = await GlobalMongoApi.getUserProfile(userId);
```

3. Trong API routes, thay đổi imports và sử dụng MongoDB models:

```javascript
// Thay vì
import { db } from "@/app/_utils/firebase";

// Sử dụng
import connectToDatabase from "@/app/_utils/mongodb";
import User from "@/app/_utils/models/User";
```

## Xử lý Xác thực

Hệ thống xác thực người dùng vẫn sử dụng Firebase Auth như cũ. Khi người dùng đăng nhập, userId từ Firebase Auth được dùng để tra cứu thông tin trong MongoDB.

## Lưu ý

- Mã nguồn đã được cập nhật để sử dụng MongoDB, nhưng các phương thức của `GlobalApi` vẫn giữ nguyên để đảm bảo tương thích ngược.
- Đối với các API route tùy chỉnh, cần thực hiện chuyển đổi thủ công từ Firebase sang MongoDB.
- Nếu gặp vấn đề trong quá trình chuyển đổi, vui lòng kiểm tra logs để debug.

## Hệ Thống Backup

Trước khi di chuyển dữ liệu, script sẽ tạo backup của tất cả dữ liệu Firebase vào thư mục `scripts/firestore-backup`. Nếu có lỗi xảy ra, bạn có thể sử dụng dữ liệu này để khôi phục.