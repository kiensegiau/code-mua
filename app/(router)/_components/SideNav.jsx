"use client"
import { useAuth } from '@/app/_context/AuthContext'
import { BadgeCheck, BadgeIcon, BookOpen, GraduationCap, Home, LayoutDashboard, LayoutGrid, Mail, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {
  const {user, profile}=useAuth();
  const menu=[
    {
      id:0,
      name:'Trang chủ',
      icon:Home,
      path:'/',
      auth:true
    },
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
    <div className='h-full bg-white'>
      {/* User Profile Section - Mobile Only */}
      <div className='md:hidden p-4 border-b'>
        {user && profile ? (
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
              <User className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h3 className='font-medium'>{profile.fullName || 'Người dùng'}</h3>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </div>
          </div>
        ) : (
          <Link href="/sign-in">
            <div className='text-primary font-medium'>Đăng nhập</div>
          </Link>
        )}
      </div>

      {/* Navigation Menu */}
      <div className='p-3 md:p-5'>
        {menu.map((item,index)=>item.auth&&(
          <Link key={index} href={item.path}>
            <div className={`group flex gap-3
              p-3 text-[15px] md:text-[16px] items-center
              text-gray-500 cursor-pointer
              hover:bg-primary/10 hover:text-primary
              rounded-md
              transition-all ease-in-out duration-200
              ${path === item.path ? 'bg-primary/10 text-primary' : ''}
            `}>
              <item.icon className='w-5 h-5 md:w-[18px] md:h-[18px]'/>
              <span className='font-medium'>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideNav