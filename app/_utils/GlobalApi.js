import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const getAllCourseList = async () => {
  const coursesRef = collection(db, 'courses');
  const snapshot = await getDocs(coursesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getSideBanner = async () => {
  const bannersRef = collection(db, 'sideBanners');
  const snapshot = await getDocs(bannersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getCourseById = async (courseId) => {
  const courseRef = doc(db, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);
  return courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null;
};

const enrollToCourse = async (courseId, email) => {
  const enrollmentRef = collection(db, 'enrollments');
  const newEnrollment = await addDoc(enrollmentRef, {
    courseId,
    userEmail: email,
    enrolledAt: new Date()
  });
  return { id: newEnrollment.id };
};

const getUserAllEnrolledCourseList = async (email) => {
  const enrollmentsRef = collection(db, 'enrollments');
  const q = query(enrollmentsRef, where("userEmail", "==", email));
  const snapshot = await getDocs(q);
  const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Fetch course details for each enrollment
  const coursePromises = enrollments.map(enrollment => getCourseById(enrollment.courseId));
  const courses = await Promise.all(coursePromises);

  return courses.filter(course => course !== null);
};

const createUser = async (userData) => {
  const usersRef = collection(db, 'users');
  const newUser = await addDoc(usersRef, userData);
  return { id: newUser.id };
};

// Thêm vào danh sách export
export { createUser };

export default {
  getAllCourseList,
  getSideBanner,
  getCourseById,
  enrollToCourse,
  getUserAllEnrolledCourseList,createUser
  // ... other functions
};