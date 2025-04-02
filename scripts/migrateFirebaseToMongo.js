// Script để di chuyển dữ liệu từ Firebase sang MongoDB
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Khởi tạo Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// Khởi tạo MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Đăng ký models
const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, default: '' },
  photoURL: { type: String, default: '' },
  balance: { type: Number, default: 0 },
  enrolledCourses: { type: [String], default: [] },
  role: { type: String, default: 'user' },
  phoneNumber: { type: String, default: '' },
  profileComplete: { type: Boolean, default: false },
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailImage: { type: String, required: true },
  demoVideo: { type: String, default: '' },
  price: { type: Number, default: 0 },
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  chapters: { type: Array, default: [] },
  enrolledUsers: { type: [String], default: [] },
  enrollments: { type: Number, default: 0 },
  requirements: { type: [String], default: [] },
  whatYouWillLearn: { type: [String], default: [] },
  teacherInfo: { type: Object, default: {} },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

const PurchaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  amount: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now }
}, { timestamps: true });

PurchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);

// Đường dẫn để lưu trữ bản sao dữ liệu
const backupDir = path.join(__dirname, 'firestore-backup');

// Hàm di chuyển users
async function migrateUsers() {
  console.log('Bắt đầu di chuyển users...');
  try {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    
    // Backup dữ liệu
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    
    console.log(`Đã sao lưu ${users.length} người dùng vào ${path.join(backupDir, 'users.json')}`);
    
    // Chuyển đổi cấu trúc dữ liệu nếu cần
    const processedUsers = users.map(user => {
      // Đảm bảo mỗi user có uid và email
      if (!user.uid || !user.email) {
        console.warn(`Người dùng ${user.id} thiếu uid hoặc email`);
      }
      
      return {
        uid: user.uid || user.id,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        balance: user.balance || 0,
        enrolledCourses: user.enrolledCourses || [],
        role: user.role || 'user',
        phoneNumber: user.phoneNumber || '',
        profileComplete: user.profileComplete || false,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
      };
    });
    
    // Lưu vào MongoDB
    for (const user of processedUsers) {
      await User.findOneAndUpdate(
        { uid: user.uid }, 
        user, 
        { upsert: true, new: true }
      );
    }
    
    console.log(`Di chuyển ${processedUsers.length} người dùng thành công`);
  } catch (error) {
    console.error('Lỗi khi di chuyển users:', error);
  }
}

// Hàm di chuyển courses
async function migrateCourses() {
  console.log('Bắt đầu di chuyển courses...');
  try {
    const coursesSnapshot = await getDocs(collection(firestore, 'courses'));
    
    // Backup dữ liệu
    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    fs.writeFileSync(
      path.join(backupDir, 'courses.json'),
      JSON.stringify(courses, null, 2)
    );
    
    console.log(`Đã sao lưu ${courses.length} khóa học vào ${path.join(backupDir, 'courses.json')}`);
    
    // Thêm dữ liệu vào MongoDB
    for (const course of courses) {
      const courseData = {
        _id: course.id, // Sử dụng ID cũ để giữ nguyên tham chiếu
        title: course.title || '',
        description: course.description || '',
        thumbnailImage: course.thumbnailImage || '',
        demoVideo: course.demoVideo || '',
        price: course.price || 0,
        grade: course.grade || '',
        subject: course.subject || '',
        chapters: course.chapters || [],
        enrolledUsers: course.enrolledUsers || [],
        enrollments: course.enrollments || 0,
        requirements: course.requirements || [],
        whatYouWillLearn: course.whatYouWillLearn || [],
        teacherInfo: course.teacherInfo || {},
        isPublished: course.isPublished || false,
        createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
        updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date()
      };
      
      await Course.findOneAndUpdate(
        { _id: courseData._id },
        courseData,
        { upsert: true, new: true }
      );
    }
    
    console.log(`Di chuyển ${courses.length} khóa học thành công`);
  } catch (error) {
    console.error('Lỗi khi di chuyển courses:', error);
  }
}

// Hàm di chuyển purchases
async function migratePurchases() {
  console.log('Bắt đầu di chuyển purchases...');
  try {
    const purchasesSnapshot = await getDocs(collection(firestore, 'purchases'));
    
    // Backup dữ liệu
    const purchases = purchasesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    fs.writeFileSync(
      path.join(backupDir, 'purchases.json'),
      JSON.stringify(purchases, null, 2)
    );
    
    console.log(`Đã sao lưu ${purchases.length} giao dịch vào ${path.join(backupDir, 'purchases.json')}`);
    
    // Thêm dữ liệu vào MongoDB
    for (const purchase of purchases) {
      try {
        const purchaseData = {
          userId: purchase.userId,
          courseId: purchase.courseId,
          amount: purchase.amount || 0,
          purchasedAt: purchase.purchasedAt ? new Date(purchase.purchasedAt) : new Date(),
          createdAt: purchase.createdAt ? new Date(purchase.createdAt) : new Date(),
          updatedAt: purchase.updatedAt ? new Date(purchase.updatedAt) : new Date()
        };
        
        await Purchase.findOneAndUpdate(
          { userId: purchase.userId, courseId: purchase.courseId },
          purchaseData,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error(`Lỗi khi di chuyển giao dịch ${purchase.id}:`, err);
      }
    }
    
    console.log(`Di chuyển ${purchases.length} giao dịch thành công`);
  } catch (error) {
    console.error('Lỗi khi di chuyển purchases:', error);
  }
}

// Thực hiện di chuyển dữ liệu
async function migrateAll() {
  try {
    await migrateUsers();
    await migrateCourses();
    await migratePurchases();
    console.log('Di chuyển dữ liệu hoàn tất!');
  } catch (error) {
    console.error('Lỗi trong quá trình di chuyển dữ liệu:', error);
  } finally {
    mongoose.connection.close();
    console.log('Đã đóng kết nối MongoDB');
    process.exit(0);
  }
}

migrateAll(); 