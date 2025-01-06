"use client"
import { Button } from '@/components/ui/button'
import { BellDot, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import { auth } from '@/app/_utils/firebase'
import { useRouter } from 'next/navigation'
import SideNav from './SideNav'

function Header() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/sign-in');
  };

  return (
    <>
      <div className='p-3 md:p-4 bg-white flex justify-between items-center border-b fixed top-0 left-0 right-0 z-50'>
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='md:hidden'
        >
          {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>

        {/* Logo */}
        <div className='flex items-center'>
          <Link href="/">
            <span className='font-black text-lg md:text-2xl text-purple-800' style={{ fontFamily: 'cursive', fontStyle: 'italic', textShadow: '2px 2px 4px #aaa' }}>ShareAcademy.net</span>
          </Link>
        </div>

        {/* Search bar - Desktop */}
        <div className='hidden md:flex gap-2 border p-[5px_15px] rounded-full w-1/3'>
          <Search className='h-5 w-5'/>
          <input type="text" placeholder='Tìm kiếm khóa học, bài viết, video...' className='outline-none w-full rounded-full border-none focus:ring-0'/>
        </div>

        {/* Search Icon & User Actions - Mobile */}
        <div className='flex items-center gap-2 md:gap-4'>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className='md:hidden'
          >
            <Search className='h-5 w-5' />
          </button>
          
          <BellDot className='text-gray-500 h-5 w-5 md:h-6 md:w-6'/>
          
          {/* User greeting - Desktop only */}
          {user && profile && (
            <span className="hidden md:inline text-gray-700">Xin chào, {profile.fullName || user.email}</span>
          )}
          
          {user
            ? <Button onClick={handleSignOut} className='h-8 text-sm md:text-base'>Đăng xuất</Button>
            : <Link href={'/sign-in'}><Button className='h-8 text-sm md:text-base'>Đăng nhập</Button></Link>
          }
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className='fixed top-[60px] left-0 right-0 p-3 bg-white border-b z-40 md:hidden'>
          <div className='flex gap-2 border p-[5px_15px] rounded-full'>
            <Search className='h-5 w-5'/>
            <input 
              type="text" 
              placeholder='Tìm kiếm...' 
              className='outline-none w-full rounded-full border-none focus:ring-0'
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='fixed top-[60px] left-0 bottom-0 w-64 bg-white z-40 md:hidden overflow-y-auto'>
          <SideNav />
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className='h-[60px]'></div>
    </>
  )
}

export default Header