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
    <div className='p-4 bg-white flex justify-between items-center'>
      {/* Search bar */}
      <div className='flex gap-2 border p-2 rounded-md'>
        <Search className='h-5 w-5'/>
        <input type="text" placeholder='Search...' className='outline-none'/>
      </div>
      {/* User greeting, Get Started Button & bell Icon */}
      <div className='flex items-center gap-4'>
        {user && profile && (
          <span className="text-gray-700">Xin chào, {profile.fullName || user.email}</span>
        )}
        <BellDot className='text-gray-500'/>
        {user
          ? <Button onClick={handleSignOut}>Đăng xuất</Button>
          : <Link href={'/sign-in'}><Button>Get Started</Button></Link>
        }
      </div>
    </div>
  )
}

export default Header