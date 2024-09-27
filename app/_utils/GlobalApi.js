import { doc, getDoc, runTransaction, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const GlobalApi = {
  getAllCourseList: async () => {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
 
  getUserProfile: async (UserId) => {
    
    try {
      console.log('Bắt đầu lấy thông tin người dùng');
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("uid", "==", UserId));
      const querySnapshot = await getDocs(q);
    
      if (querySnapshot.empty) {
        console.log('Không tìm thấy người dùng với email:', UserId);
        return null;
      }
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Đã tìm thấy người dùng với email:', users);
      return users[0];
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      throw error;
    }
  },

  updateUserProfile: async (UserId, updatedData) => {
    try {
      console.log('Bắt đầu cập nhật thông tin người dùng');
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("uid", "==", UserId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('Không tìm thấy người dùng với ID:', UserId);
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'users', userDoc.id);
      
      await updateDoc(userRef, updatedData);
      
      console.log('Đã cập nhật thông tin người dùng thành công');
      
      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUserDoc = await getDoc(userRef);
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      throw error;
    }
  },

  enrollCourse: async (userId, courseId) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Không tìm thấy người dùng với UID:', userId);
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const userDoc = querySnapshot.docs[0];
      const courseRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        console.error('Không tìm thấy khóa học với ID:', courseId);
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      await runTransaction(db, async (transaction) => {
        const userData = userDoc.data();
        const enrolledCourses = userData.enrolledCourses || [];
        const enrolledUsers = courseDoc.data().enrolledUsers || [];

        const userRef = doc(db, 'users', userDoc.id);

        if (!enrolledCourses.includes(courseId)) {
          transaction.update(userRef, {
            enrolledCourses: arrayUnion(courseId)
          });
        }

        if (!enrolledUsers.includes(userId)) {
          transaction.update(courseRef, {
            enrolledUsers: arrayUnion(userId)
          });
        }
      });

      console.log('Đăng ký khóa học thành công');
      return true;
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      throw error;
    }
  },

  isUserEnrolled: async (userId, courseId) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Không tìm thấy người dùng với UID:', userId);
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const enrolledCourses = userData.enrolledCourses || [];
      
      return enrolledCourses.includes(courseId);
    } catch (error) {
      console.error('Lỗi khi kiểm tra đăng ký khóa học:', error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        return { id: courseSnap.id, ...courseSnap.data() };
      } else {
        console.log('Không tìm thấy khóa học');
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin khóa học:', error);
      throw error;
    }
  },

  getEnrolledCourses: async (userId) => {
    try {
      const enrollmentsRef = collection(db, 'users', userId, 'enrollments');
      const enrollmentsSnapshot = await getDocs(enrollmentsRef);
      
      const enrolledCourses = await Promise.all(enrollmentsSnapshot.docs.map(async (enrollmentDoc) => {
        const courseId = enrollmentDoc.id;
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          const courseData = courseSnap.data();
          return { 
            id: courseSnap.id, 
            ...courseData,
            totalLessons: courseData.chapters ? courseData.chapters.reduce((acc, chapter) => acc + (chapter.lessons ? chapter.lessons.length : 0), 0) : 0,
            duration: courseData.duration || 'Chưa xác định'
          };
        }
        return null;
      }));

      return enrolledCourses.filter(course => course !== null);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
      throw error;
    }
  },

  getLessonData: async (courseId, chapterId, lessonId) => {
    console.log('Bắt đầu lấy dữ liệu bài học:', { courseId, chapterId, lessonId });
    try {
      const lessonRef = doc(db, 'courses', courseId, 'chapters', chapterId, 'lessons', lessonId);
      console.log('Tham chiếu đến bài học:', lessonRef);
      const lessonSnap = await getDoc(lessonRef);
      console.log('Đã lấy snapshot của bài học');
      if (lessonSnap.exists()) {
        const lessonData = { id: lessonSnap.id, ...lessonSnap.data() };
        console.log('Dữ liệu bài học:', lessonData);
        return lessonData;
      } else {
        console.error('Không tìm thấy dữ liệu bài học');
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài học:', error);
      throw error;
    }
  },

  getChapterLessons: async (courseId, chapterId) => {
    try {
      const lessonsRef = collection(db, 'courses', courseId, 'chapters', chapterId, 'lessons');
      const lessonsSnap = await getDocs(lessonsRef);
      return lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài học của chương:', error);
      throw error;
    }
  }
  ,getChapterLessons: async (courseId, chapterId) => {
    try {
      const lessonsRef = collection(db, 'courses', courseId, 'chapters', chapterId, 'lessons');
      const lessonsSnap = await getDocs(lessonsRef);
      return lessonsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài học của chương:', error);
      throw error;
    }
  },
};

export default GlobalApi;