"use client"
import React from 'react'
import SideNav from './_components/SideNav'
import Header from './_components/Header'

function layout({children}) {
  return (
    <div>
        <div
       >
            {/* <SideNav/> */}
        </div>
        <div>
            {/* <Header/> */}
        {children}
        </div>
    </div>
  )
}

export default layout