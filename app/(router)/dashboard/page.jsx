"use client"
import React, { useEffect, useState } from 'react'
import SideBanners from '../courses/_components/SideBanners';
import WelcomeBannerDashboard from './_components/WelcomeBannerDashboard';
import InProgressCourseList from './_components/InProgressCourseList';
import GlobalApi from '@/app/_utils/GlobalApi';
import { useAuth } from '@/app/_context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [userEnrolledCourses, setUserEnrolledCourse] = useState([]);

  useEffect(() => {
    user && getAllUserEnrolledCourses();
  }, [user])

  const getAllUserEnrolledCourses = () => {
    GlobalApi.getUserAllEnrolledCourseList(user.email).then(resp => {
      console.log(resp);
      setUserEnrolledCourse(resp);
    })
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 p-5 gap-5'>
      <div className='col-span-3'>
        <WelcomeBannerDashboard user={user} />
        <InProgressCourseList userEnrolledCourses={userEnrolledCourses} />
      </div>
      <div className=''>
        <SideBanners />
      </div>
    </div>
  )
}

export default Dashboard;