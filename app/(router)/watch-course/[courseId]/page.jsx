"use client"
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';
import CourseVideoDescription from '../../course-preview/[courseId]/_components/CourseVideoDescription';
import CourseContentSection from '../../course-preview/[courseId]/_components/CourseContentSection';
import { toast } from 'sonner';

function WatchCourse({params}) {
  const [courseInfo, setCourseInfo] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    getCourseInfoById();
  }, []);

  const getCourseInfoById = async () => {
    try {
      console.log('Bắt đầu lấy thông tin khóa học:', params.courseId);
      const courseRef = doc(db, 'courses', params.courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = { id: courseSnap.id, ...courseSnap.data() };
        console.log('Thông tin khóa học:', courseData);
        
        // Lấy thông tin về các chương
        const chaptersSnapshot = await getDocs(collection(db, 'courses', params.courseId, 'chapters'));
        const chaptersData = await Promise.all(chaptersSnapshot.docs.map(async (chapterDoc) => {
          const chapterData = { id: chapterDoc.id, ...chapterDoc.data() };
          console.log('Thông tin chương:', chapterData);
          
          // Lấy thông tin về các bài học trong chương
          const lessonsSnapshot = await getDocs(collection(db, 'courses', params.courseId, 'chapters', chapterDoc.id, 'lessons'));
          chapterData.lessons = lessonsSnapshot.docs.map(lessonDoc => {
            const lessonData = { id: lessonDoc.id, ...lessonDoc.data() };
            console.log('Thông tin bài học:', lessonData);
            return lessonData;
          });
          
          return chapterData;
        }));
        
        courseData.chapters = chaptersData.sort((a, b) => a.order - b.order);
        console.log('Thông tin khóa học đầy đủ:', courseData);
        setCourseInfo(courseData);
      } else {
        console.log('Không tìm thấy khóa học:', params.courseId);
        toast.error("Không tìm thấy khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khóa học:", error);
      toast.error("Không thể tải thông tin khóa học");
    }
  };

  if (!courseInfo) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className='flex flex-col items-center p-5'>
      <div className='w-full max-w-4xl bg-white p-3 rounded-lg shadow'>
        <CourseVideoDescription 
          courseInfo={courseInfo}
          activeChapterIndex={activeChapterIndex}
          activeLesson={activeLesson}
          watchMode={true}
        />
      </div>
      <div className='w-full max-w-4xl mt-5'>
        <CourseContentSection 
          courseInfo={courseInfo}
          isUserAlreadyEnrolled={true}
          watchMode={true}
          setActiveChapterIndex={(index) => setActiveChapterIndex(index)}
          setActiveLesson={setActiveLesson}
        />
      </div>
    </div>
  );
}

export default WatchCourse;