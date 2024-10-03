"use client"
import { useAuth } from '@/app/_context/AuthContext'
import { BadgeCheck, BadgeIcon, BookOpen, GraduationCap, LayoutDashboard, LayoutGrid, Mail, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function SideNav() {
  const {user}=useAuth();
  const menu=[
   
    {
      id:1,
      name:'Tất cả khóa học',
      icon:BookOpen,
      path:'/courses',
      auth:true
    },
    {
      id:4,
      name:'Cửa hàng',
      icon:LayoutGrid,
      path:'/store',
      auth:true
    },
    
    // {
    //   id:3,
    //   name:'Trở thành giảng viên',
    //   icon:GraduationCap,
    //   path:'/instructor',
    //   auth:true
    // },
    {
      id:5,
      name:'Bản tin',
      icon:Mail,
      path:'/newsletter',
      auth:true
    },
    {
      id: 6,
      name: 'Cá nhân',
      icon: User,
      path: '/profile',
      auth: true
    },
    {
      id: 7,
      name: 'Khóa học của tôi',
      icon: BookOpen,
      path: '/my-courses',
      auth: true
    }
  ]

  const path=usePathname();

  return (
    <div className='px-5 pb-5 bg-white 
    shadow-sm border h-screen'>
        <div>
          {menu.map((item,index)=>item.auth&&(
            <Link key={index} href={item.path}>
            <div className={`group flex gap-3
            mt-2 p-3 text-[18px] items-center
             text-gray-500 cursor-pointer
             hover:bg-primary
             hover:text-white
             rounded-md
             transition-all ease-in-out duration-200
             ${path.includes(item.path)&&'bg-primary text-white'}
             `}>
              <item.icon className='group-hover:animate-bounce'/>
              <h2>{item.name}</h2>
            </div>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default SideNav