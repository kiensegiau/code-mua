"use client"
import { useEffect, useState } from 'react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/_utils/firebase';
import CourseVideoDescription from './_components/CourseVideoDescription'
import CourseContentSection from './_components/CourseContentSection'
import Image from 'next/image'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import CourseHeader from './_components/CourseHeader';

const storage = getStorage();

function CoursePreview({params}) {
    const [courseInfo, setCourseInfo] = useState(null);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [activeLesson, setActiveLesson] = useState(null);

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
                    chapterData.lessons = await Promise.all(lessonsSnapshot.docs.map(async (lessonDoc) => {
                        const lessonData = { id: lessonDoc.id, ...lessonDoc.data() };
                        if (lessonData.files && Array.isArray(lessonData.files)) {
                            const videoFile = lessonData.files.find(file => file.type.startsWith('video/'));
                            if (videoFile && videoFile.url) {
                                lessonData.videoUrl = videoFile.url;
                            }
                        }
                        console.log('Dữ liệu bài học:', JSON.stringify(lessonData, null, 2));
                        return lessonData;
                    }));
                    
                    return chapterData;
                }));
                
                courseData.chapters = chaptersData.sort((a, b) => a.order - b.order);
                setCourseInfo(courseData);
                console.log('Dữ liệu khóa học sau khi xử lý:', JSON.stringify(courseData, null, 2));
            } else {
                console.error("Không tìm thấy khóa học");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin khóa học:", error);
        }
    };

    const handleActiveLessonChange = (lesson) => {
        console.log('handleActiveLessonChange called with:', lesson);
        setActiveLesson(lesson);
    };

    if (!courseInfo) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <CourseHeader courseInfo={courseInfo} />
            <div className="flex-1 grid grid-cols-12 gap-4 p-4">
                <div className="col-span-9 grid grid-rows-6 gap-4">
                    <div className="row-span-5">
                        <CourseVideoDescription 
                            courseInfo={courseInfo}
                            activeChapterIndex={activeChapterIndex}
                            activeLesson={activeLesson}
                            watchMode={true}
                        />
                    </div>
                    <div className="row-span-1 bg-white p-4 rounded-lg shadow">
                        <h1 className='text-3xl font-bold mb-3'>{courseInfo.title}</h1>
                        <p className='text-gray-600 mb-4'>{courseInfo.description}</p>
                        <div className='flex items-center mb-4'>
                            <span className='mr-4'>
                                <strong>Giảng viên:</strong> {courseInfo.teacher}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <CourseContentSection 
                        courseInfo={courseInfo}
                        isUserAlreadyEnrolled={true}
                        watchMode={false}
                        setActiveChapterIndex={(index) => setActiveChapterIndex(index)}
                        setActiveLesson={setActiveLesson}
                    />
                </div>
            </div>
        </div>
    )
}

export default CoursePreview