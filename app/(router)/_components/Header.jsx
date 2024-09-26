"use client"
import { Button } from '@/components/ui/button'
import { BellDot, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import { auth } from '@/app/_utils/firebase'
import { useRouter } from 'next/navigation'

function Header() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/sign-in');
  };

  return (
    <div className='p-4 bg-white flex justify-between items-center border-b' style={{ padding: '1,5rem', height: '3rem' }}>
      {/* Logo */}
      <div className='flex items-center'>
        <span className='ml-2 font-black text-2xl text-purple-800' style={{ fontFamily: 'cursive', fontStyle: 'italic', textShadow: '2px 2px 4px #aaa' }}>ShareAcademy.net</span>
      </div>
      {/* Search bar */}
      <div className='flex gap-2 border p-[5px_15px] rounded-full w-1/3'>
        <Search className='h-5 w-5'/>
        <input type="text" placeholder='Tìm kiếm khóa học, bài viết, video...' className='outline-none w-full rounded-full border-none focus:ring-0'/>
      </div>
      {/* User greeting, Get Started Button & bell Icon */}
      <div className='flex items-center gap-4'>
        {user && profile && (
          <span className="text-gray-700">Xin chào, {profile.fullName || user.email}</span>
        )}
        <BellDot className='text-gray-500 h-6 w-6'/>
        {user
          ? <Button onClick={handleSignOut} className='h-8'>Đăng xuất</Button>
          : <Link href={'/sign-in'}><Button className='h-8'>Đăng nhập</Button></Link>
        }
      </div>
    </div>
  )
}

export default Header