"use client"
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseVideoDescription from './_components/CourseVideoDescription'
import GlobalApi from '@/app/_utils/GlobalApi'
import CourseEnrollSection from './_components/CourseEnrollSection'
import CourseContentSection from './_components/CourseContentSection'
import { useAuth } from '@/app/_context/AuthContext'
import WatchOnYoutube from './_components/WatchOnYoutube'
import Sources from './_components/Sources'
import { logToServer } from '@/app/_utils/logger'
import Image from 'next/image'
import { UserMemberContext } from '@/app/_context/UserMemberContext'

function CoursePreview({params}) {
    
    const { user } = useAuth();
    const [courseInfo, setCourseInfo] = useState(null);
    const [isUserAlreadyEnrolled, setIsUserAlreadyEnrolled] = useState(false);

    useEffect(() => {
        if (params) {
            getCourseInfoById();
        }
    }, [params]);

    useEffect(() => {
        if (courseInfo && user) {
            checkUserEnrolledToCourse();
        }
    }, [courseInfo, user]);

    const getCourseInfoById = () => {
        GlobalApi.getCourseById(params?.courseId).then(resp => {
            setCourseInfo(resp);
            logToServer('Đã nhận thông tin khóa học', {
                courseId: params?.courseId,
                courseInfo: resp
            });
        }).catch(error => {
            logToServer('Lỗi khi lấy thông tin khóa học', {
                courseId: params?.courseId,
                error: error.message
            });
        });
    }

    const checkUserEnrolledToCourse = () => {
        if (user && user.email && courseInfo && courseInfo.id) {
            // Temporary placeholder
            console.log('Checking if user is enrolled:', user.email, courseInfo.id);
            // TODO: Implement actual check once GlobalApi is fixed
            setIsUserAlreadyEnrolled(false);
        }
    }

    if (!courseInfo) {
        return <div>Đang tải...</div>;
    }

    return (
        <UserMemberContext.Provider value={{ isMember: false, setIsMember: () => {} }}>
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
                    <CourseVideoDescription courseInfo={courseInfo} />
                </div>

                <div className='col-span-1'>
                    <CourseEnrollSection 
                        courseInfo={courseInfo}
                        isUserAlreadyEnrolled={isUserAlreadyEnrolled}
                    />
                    <Sources courseInfo={courseInfo} />
                    {courseInfo.chapter?.length > 0 && (
                        <CourseContentSection 
                            courseInfo={courseInfo}
                            isUserAlreadyEnrolled={isUserAlreadyEnrolled} 
                        />
                    )}
                </div>
            </div>
        </UserMemberContext.Provider>
    )
}

export default CoursePreview