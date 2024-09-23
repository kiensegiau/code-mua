"use client"
import React from 'react'
import Header from '../_components/Header'

function WatchCourseLayout({children}) {
  return (
    <div>
        <Header/>
        <div className='p-5'>
            {children}
        </div>
    </div>
  )
}

export default WatchCourseLayout