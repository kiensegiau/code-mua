"use client"
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import SideBanners from './_components/SideBanners'
import Header from '../_components/Header'
import SideNav from '../_components/SideNav'

function Courses() {
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-64 hidden md:block fixed h-full'>
          <SideNav />
        </div>
        <div className='flex-1 md:ml-64 p-5 overflow-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-5 h-full'>
            {/* Left Container  */}
            <div className='col-span-3 flex flex-col col-span-4'>
              {/* Banner  */}
              <WelcomeBanner />
              {/* Course List  */}
              <div className='flex-1 overflow-auto'>
                <CourseList className='grid grid-cols-1 md:grid-cols-4 gap-5' />
              </div>
            </div>
            {/* Right Container */}
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses