import React from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import { Sparkles, Rocket, BookOpen } from 'lucide-react'

function WelcomeBanner() {
  const { user } = useAuth()

  return (
    <div className='relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 rounded-2xl'>
      <div className='absolute inset-0 bg-grid-white/10' />
      <div className='relative p-6 md:p-8'>
        <div className='max-w-2xl'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-3'>
            {user ? `Chào mừng trở lại, ${user.displayName || 'bạn'}!` : 'Khám phá kiến thức mới'}
          </h1>
          <p className='text-white/90 text-sm md:text-base mb-6'>
            Học tập, phát triển và nâng cao kỹ năng của bạn với hơn 100+ khóa học chất lượng cao
          </p>
          
          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 md:gap-6'>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
              <div className='flex items-center gap-2 mb-1'>
                <Sparkles className='w-4 h-4 text-yellow-300' />
                <span className='text-white font-medium'>100+</span>
              </div>
              <p className='text-white/80 text-xs'>Khóa học</p>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
              <div className='flex items-center gap-2 mb-1'>
                <BookOpen className='w-4 h-4 text-blue-300' />
                <span className='text-white font-medium'>50+</span>
              </div>
              <p className='text-white/80 text-xs'>Giảng viên</p>
            </div>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
              <div className='flex items-center gap-2 mb-1'>
                <Rocket className='w-4 h-4 text-orange-300' />
                <span className='text-white font-medium'>1000+</span>
              </div>
              <p className='text-white/80 text-xs'>Học viên</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl' />
      <div className='absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl' />
    </div>
  )
}

export default WelcomeBanner