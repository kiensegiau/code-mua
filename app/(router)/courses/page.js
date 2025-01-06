"use client"
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import SideBanners from './_components/SideBanners'
import Header from '../_components/Header'
import SideNav from '../_components/SideNav'

function Courses() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <div className='flex flex-1'>
        {/* Sidebar for desktop */}
        <div className='w-64 hidden md:block fixed h-[calc(100vh-4rem)] top-16'>
          <SideNav />
        </div>
        
        {/* Main content */}
        <main className='flex-1 md:ml-64 px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6'>
          <div className='max-w-[1920px] mx-auto'>
            {/* Banner */}
            <WelcomeBanner />
            
            {/* Course List */}
            <div className='mt-6'>
              <CourseList className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6' />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Courses