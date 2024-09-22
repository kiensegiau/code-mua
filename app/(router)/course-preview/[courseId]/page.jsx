"use client"
import { useEffect, useState } from 'react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/_utils/firebase';
import CourseVideoDescription from './_components/CourseVideoDescription'
import CourseContentSection from './_components/CourseContentSection'
import Image from 'next/image'

function CoursePreview({params}) {
    const [courseInfo, setCourseInfo] = useState(null);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    useEffect(() => {
        if (params?.courseId) {
            getCourseInfoById();
        }
    }, [params?.courseId]);

    const getCourseInfoById = async () => {
        try {
            const courseRef = doc(db, 'courses', params.courseId);
            const courseSnap = await getDoc(courseRef);

            if (courseSnap.exists()) {
                const courseData = { id: courseSnap.id, ...courseSnap.data() };
                
                // Lấy thông tin về các chương
                const chaptersSnapshot = await getDocs(collection(db, 'courses', params.courseId, 'chapters'));
                const chaptersData = await Promise.all(chaptersSnapshot.docs.map(async (chapterDoc) => {
                    const chapterData = { id: chapterDoc.id, ...chapterDoc.data() };
                    
                    // Lấy thông tin về các bài học trong chương
                    const lessonsSnapshot = await getDocs(collection(db, 'courses', params.courseId, 'chapters', chapterDoc.id, 'lessons'));
                    chapterData.lessons = lessonsSnapshot.docs.map(lessonDoc => ({ id: lessonDoc.id, ...lessonDoc.data() }));
                    
                    return chapterData;
                }));
                
                courseData.chapters = chaptersData.sort((a, b) => a.order - b.order);
                setCourseInfo(courseData);
            } else {
                console.error("Không tìm thấy khóa học");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin khóa học:", error);
        }
    };

    if (!courseInfo) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 p-5 gap-5'>
            <div className='col-span-2 bg-white p-5 rounded-lg shadow'>
                <Image 
                    src={courseInfo.imageUrl && courseInfo.imageUrl.startsWith('http') 
                        ? courseInfo.imageUrl 
                        : '/default-course-image.jpg'}
                    alt={courseInfo.title || 'Course banner'}
                    width={800}
                    height={400}
                    className='w-full h-64 object-cover rounded-lg mb-5'
                />
                <h1 className='text-3xl font-bold mb-3'>{courseInfo.title}</h1>
                <p className='text-gray-600 mb-4'>{courseInfo.description}</p>
                <div className='flex items-center mb-4'>
                    <span className='mr-4'>
                        <strong>Giảng viên:</strong> {courseInfo.teacher}
                    </span>
                    <span className='mr-4'>
                        <strong>Cấp độ:</strong> {courseInfo.level}
                    </span>
                    <span>
                        <strong>Thời lượng:</strong> {courseInfo.duration} giờ
                    </span>
                </div>
                <CourseVideoDescription 
                    courseInfo={courseInfo}
                    activeChapterIndex={activeChapterIndex}
                    watchMode={true}
                />
            </div>

            <div className='col-span-1'>
                <CourseContentSection 
                    courseInfo={courseInfo}
                    isUserAlreadyEnrolled={true}
                    watchMode={false}
                    setActiveChapterIndex={(index) => setActiveChapterIndex(index)}
                />
            </div>
        </div>
    )
}

export default CoursePreview