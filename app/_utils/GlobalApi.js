import {
  doc,
  getDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

const GlobalApi = {
  getAllCourseList: async (options = {}) => {
    const { grade, subject, limit: limitCount = 50, page = 1 } = options;

    try {
      // console.log("Bắt đầu lấy danh sách khóa học với options:", options);

      let coursesQuery = collection(db, "courses");
      let queryConstraints = [];

      // Thêm các điều kiện lọc
      if (grade) {
        queryConstraints.push(where("grade", "==", grade));
      }

      if (subject) {
        queryConstraints.push(where("subject", "==", subject));
      }

      // Thêm sắp xếp và giới hạn
      queryConstraints.push(orderBy("updatedAt", "desc"));
      queryConstraints.push(limit(limitCount));

      // Áp dụng tất cả các ràng buộc
      if (queryConstraints.length > 0) {
        coursesQuery = query(coursesQuery, ...queryConstraints);
      }

      // console.log("Đang thực hiện truy vấn với các ràng buộc");
      const snapshot = await getDocs(coursesQuery);

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học:", error);
      throw error;
    }
  },

  getUserProfile: async (UserId) => {
    try {
      // console.log("Bắt đầu lấy thông tin người dùng");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", UserId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // console.log("Không tìm thấy người dùng với email:", UserId);
        return null;
      }

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log("Đã tìm thấy người dùng với email:", users);
      return users[0];
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
      throw error;
    }
  },

  updateUserProfile: async (UserId, updatedData) => {
    try {
      // console.log("Bắt đầu cập nhật thông tin người dùng");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", UserId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // console.log("Không tìm thấy người dùng với ID:", UserId);
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);

      await updateDoc(userRef, updatedData);

      // console.log("Đã cập nhật thông tin người dùng thành công");

      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUserDoc = await getDoc(userRef);
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data(),
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  },

  purchaseCourse: async (userId, courseId) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const userDoc = querySnapshot.docs[0];
      const courseRef = doc(db, "courses", courseId);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      const userData = userDoc.data();
      const courseData = courseDoc.data();
      const userBalance = userData.balance || 0;
      const coursePrice = courseData.price || 0;

      // Kiểm tra số dư
      if (userBalance < coursePrice) {
        throw new Error("Insufficient balance");
      }

      // Kiểm tra đã mua chưa
      const purchaseSnapshot = await db
        .collection("purchases")
        .where("userId", "==", userId)
        .where("courseId", "==", courseId)
        .limit(1)
        .get();

      if (!purchaseSnapshot.empty) {
        throw new Error("Course already purchased");
      }

      // Thực hiện giao dịch
      await runTransaction(db, async (transaction) => {
        // Trừ tiền
        transaction.update(doc(db, "users", userDoc.id), {
          balance: userBalance - coursePrice,
        });

        // Lưu lịch sử mua
        const purchaseRef = doc(collection(db, "purchases"));
        transaction.set(purchaseRef, {
          userId,
          courseId,
          amount: coursePrice,
          purchasedAt: new Date(),
        });

        // Thêm vào danh sách khóa học đã đăng ký
        transaction.update(doc(db, "users", userDoc.id), {
          enrolledCourses: arrayUnion(courseId),
        });

        // Cập nhật số người đăng ký của khóa học
        transaction.update(courseRef, {
          enrolledUsers: arrayUnion(userId),
          enrollments: (courseData.enrollments || 0) + 1,
        });
      });

      return true;
    } catch (error) {
      console.error("Lỗi khi mua khóa học:", error);
      throw error;
    }
  },

  enrollCourse: async (userId, courseId) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        throw new Error("Không tìm thấy thông tin khóa học");
      }

      const courseData = courseDoc.data();

      // Nếu là khóa học có phí, chuyển sang flow mua khóa học
      if (courseData.price > 0) {
        return await GlobalApi.purchaseCourse(userId, courseId);
      }

      // Lấy document ID của user
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const userDocId = querySnapshot.docs[0].id;
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Nếu là khóa học miễn phí, chỉ cần đăng ký
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", userDocId);

        // Nếu chưa có mảng enrolledCourses, tạo mới với khóa học hiện tại
        if (!userData.enrolledCourses) {
          transaction.update(userRef, {
            enrolledCourses: [courseId],
          });
        } else {
          transaction.update(userRef, {
            enrolledCourses: arrayUnion(courseId),
          });
        }

        // Tương tự với enrolledUsers của khóa học
        if (!courseData.enrolledUsers) {
          transaction.update(courseRef, {
            enrolledUsers: [userId],
            enrollments: 1,
          });
        } else {
          transaction.update(courseRef, {
            enrolledUsers: arrayUnion(userId),
            enrollments: (courseData.enrollments || 0) + 1,
          });
        }
      });

      return true;
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      throw error;
    }
  },

  isUserEnrolled: async (userId, courseId) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("Không tìm thấy người dùng với UID:", userId);
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const enrolledCourses = userData.enrolledCourses || [];

      return enrolledCourses.includes(courseId);
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng ký khóa học:", error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        return { id: courseSnap.id, ...courseSnap.data() };
      } else {
        // console.log("Không tìm thấy khóa học");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      throw error;
    }
  },

  getEnrolledCourses: async (userId) => {
    try {
      // Lấy thông tin người dùng - sử dụng collection query như cũ
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      const userData = querySnapshot.docs[0].data();
      const enrolledCourses = userData.enrolledCourses || [];

      if (!enrolledCourses.length) {
        return [];
      }

      // Lấy thông tin chi tiết của từng khóa học - giữ mô hình batch nhưng đơn giản hơn
      const coursePromises = enrolledCourses.map(async (courseInfo) => {
        const courseId =
          typeof courseInfo === "string" ? courseInfo : courseInfo.courseId;

        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = courseSnap.data();
          const courseInfoObj =
            typeof courseInfo === "string"
              ? { courseId: courseInfo }
              : courseInfo;

          return {
            id: courseSnap.id,
            ...courseData,
            enrolledAt: courseInfoObj.enrolledAt || new Date().toISOString(),
            progress: courseInfoObj.progress || 0,
            lastAccessed: courseInfoObj.lastAccessed || null,
            coverImage: courseInfoObj.coverImage || courseData.coverImage,
            title: courseInfoObj.title || courseData.title,
          };
        }
        return null;
      });

      const courses = await Promise.all(coursePromises);
      const validCourses = courses.filter(Boolean);

      return validCourses;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
      throw error;
    }
  },

  getLessonData: async (courseId, chapterId, lessonId) => {
    // console.log("Bắt đầu lấy dữ liệu bài học:", {
    //   courseId,
    //   chapterId,
    //   lessonId,
    // });
    try {
      const lessonRef = doc(
        db,
        "courses",
        courseId,
        "chapters",
        chapterId,
        "lessons",
        lessonId
      );
      // console.log("Tham chiếu đến bài học:", lessonRef);
      const lessonSnap = await getDoc(lessonRef);
      // console.log("Đã lấy snapshot của bài học");
      if (lessonSnap.exists()) {
        const lessonData = { id: lessonSnap.id, ...lessonSnap.data() };
        // console.log("Dữ liệu bài học:", lessonData);
        return lessonData;
      } else {
        console.error("Không tìm thấy dữ liệu bài học");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học:", error);
      throw error;
    }
  },

  getChapterLessons: async (courseId, chapterId) => {
    try {
      const lessonsRef = collection(
        db,
        "courses",
        courseId,
        "chapters",
        chapterId,
        "lessons"
      );
      const lessonsSnap = await getDocs(lessonsRef);
      return lessonsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học của chương:", error);
      throw error;
    }
  },
  getChapterLessons: async (courseId, chapterId) => {
    try {
      const lessonsRef = collection(
        db,
        "courses",
        courseId,
        "chapters",
        chapterId,
        "lessons"
      );
      const lessonsSnap = await getDocs(lessonsRef);
      return lessonsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài học của chương:", error);
      throw error;
    }
  },
};

export default GlobalApi;
