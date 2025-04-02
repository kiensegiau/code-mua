# Tổng kết Chuyển đổi từ Firebase sang MongoDB

## Danh sách file đã được chuyển đổi

1. **Kết nối và Models MongoDB**
   - `app/_utils/mongodb.js` - File kết nối MongoDB
   - `app/_utils/models/User.js` - Schema cho người dùng
   - `app/_utils/models/Course.js` - Schema cho khóa học
   - `app/_utils/models/Purchase.js` - Schema cho giao dịch mua khóa học
   - `app/_utils/GlobalMongoApi.js` - API wrapper cho MongoDB

2. **API Routes**
   - `app/api/courses/[courseId]/check-purchased/route.js` - Kiểm tra trạng thái mua khóa học
   - `app/api/courses/[courseId]/purchase/route.js` - API mua khóa học
   - `app/api/courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]/route.js` - API lấy thông tin bài học

3. **Components và Pages**
   - `app/(router)/courses/_components/CourseItem.jsx` - Component hiển thị khóa học
   - `app/(router)/course-preview/[courseId]/_components/CourseContentSection.jsx` - Component hiển thị nội dung khóa học
   - `app/(router)/course-preview/[courseId]/_components/CourseEnrollSection.jsx` - Component đăng ký khóa học
   - `app/(router)/course-preview/[courseId]/page.jsx` - Trang xem trước khóa học
   - `app/(router)/_components/Header.jsx` - Component header với thông tin người dùng
   - `app/_context/AuthContext.js` - Context quản lý xác thực người dùng

4. **Scripts và Công cụ**
   - `scripts/migrateFirebaseToMongo.js` - Script di chuyển dữ liệu từ Firebase sang MongoDB
   - Đã thêm lệnh `migrate-db` vào `package.json`

## Mô hình dữ liệu MongoDB

1. **User**
   - `uid`: ID người dùng từ Firebase Auth
   - `email`: Email
   - `displayName`: Tên hiển thị
   - `photoURL`: URL ảnh đại diện
   - `balance`: Số dư
   - `enrolledCourses`: Danh sách khóa học đã đăng ký
   - Các thông tin khác liên quan đến người dùng

2. **Course**
   - `title`: Tên khóa học
   - `description`: Mô tả
   - `thumbnailImage`: Ảnh đại diện
   - `price`: Giá khóa học
   - `chapters`: Mảng chứa các chương học
   - `enrolledUsers`: Danh sách người dùng đã đăng ký
   - Các thông tin khác về khóa học

3. **Purchase**
   - `userId`: ID người dùng
   - `courseId`: ID khóa học
   - `amount`: Số tiền giao dịch
   - `purchasedAt`: Thời gian mua

## Hướng dẫn sử dụng

### Phía Backend (API Routes)

Các API routes đã được cập nhật để sử dụng MongoDB thay vì Firebase. Quy trình chung là:

1. Import kết nối MongoDB và các models
   ```javascript
   import connectToDatabase from "@/app/_utils/mongodb";
   import User from "@/app/_utils/models/User";
   import Course from "@/app/_utils/models/Course";
   import Purchase from "@/app/_utils/models/Purchase";
   ```

2. Kết nối đến MongoDB trong mỗi API handler
   ```javascript
   await connectToDatabase();
   ```

3. Sử dụng Mongoose để thao tác với dữ liệu
   ```javascript
   const user = await User.findOne({ uid: userId });
   const course = await Course.findById(courseId);
   // ...
   ```

### Phía Frontend

Các components đã được cập nhật để gọi API từ backend thay vì truy cập trực tiếp vào Firebase:

1. Sử dụng GlobalMongoApi thay vì GlobalApi
   ```javascript
   import GlobalMongoApi from "@/app/_utils/GlobalMongoApi";
   
   // Thay vì
   // const userProfile = await GlobalApi.getUserProfile(userId);
   
   // Sử dụng
   const userProfile = await GlobalMongoApi.getUserProfile(userId);
   ```

2. Sử dụng Axios để gọi API
   ```javascript
   import axios from "axios";
   
   // Thay vì truy cập Firestore trực tiếp
   // const response = await axios.post(`/api/courses/${courseId}/purchase`);
   ```

3. Xử lý kết quả trả về
   ```javascript
   if (response.data.success) {
     // Xử lý thành công
   }
   ```

## Lưu ý

1. **Xác thực người dùng**: Firebase Auth vẫn được sử dụng để xác thực người dùng, nhưng dữ liệu người dùng được lưu trữ trong MongoDB.

2. **ID tham chiếu**: Các ID từ Firebase Firestore được giữ nguyên trong quá trình chuyển đổi để đảm bảo tương thích với dữ liệu hiện có.

3. **Transactions**: MongoDB hỗ trợ transactions tương tự như Firebase Firestore, được sử dụng trong các tác vụ quan trọng như mua khóa học.

4. **Schema Validation**: MongoDB schemas được thiết kế để khớp với cấu trúc dữ liệu Firestore để đảm bảo sự tương thích.

## Chạy Migration Script

Để di chuyển dữ liệu từ Firebase sang MongoDB:

```bash
npm run migrate-db
```

Script sẽ tự động sao lưu dữ liệu từ Firebase và chuyển sang MongoDB, giữ nguyên cấu trúc và mối quan hệ dữ liệu.

## Testing

Sau khi hoàn tất chuyển đổi, bạn nên kiểm tra các tính năng quan trọng sau:

1. Đăng nhập/đăng ký người dùng
2. Xem danh sách khóa học
3. Xem chi tiết khóa học
4. Đăng ký khóa học mới
5. Xem khóa học đã đăng ký
6. Xem bài học từ khóa học đã đăng ký 