import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const GlobalApi = {
  getAllCourseList: async () => {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getSideBanner: async () => {
    const bannersRef = collection(db, 'sideBanners');
    const snapshot = await getDocs(bannersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getCourseById: async (courseId) => {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    console.log(courseSnap.data());
    return courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null;
  },

  enrollToCourse: async (courseId, email) => {
    const enrollmentRef = collection(db, 'enrollments');
    const newEnrollment = await addDoc(enrollmentRef, {
      courseId,
      userEmail: email,
      enrolledAt: new Date()
    });
    return { id: newEnrollment.id };
  },

  getUserAllEnrolledCourseList: async (email) => {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(enrollmentsRef, where("userEmail", "==", email));
    const snapshot = await getDocs(q);
    const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const coursePromises = enrollments.map(enrollment => GlobalApi.getCourseById(enrollment.courseId));
    const courses = await Promise.all(coursePromises);

    return courses.filter(course => course !== null);
  },

  createUser: async (userData) => {
    const usersRef = collection(db, 'users');
    const newUser = await addDoc(usersRef, userData);
    return { id: newUser.id };
  }
};

export default GlobalApi;