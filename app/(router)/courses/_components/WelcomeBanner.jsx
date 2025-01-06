import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
  return (
    <div className='flex gap-3 md:gap-5 items-center bg-white rounded-xl 
    p-4 md:p-8'>
        <Image src='/panda.png' alt='panda'
        width={120}
        height={130}
        className='w-20 h-20 md:w-[120px] md:h-[130px]'
        />
        <div>
            <h2 className='font-bold text-lg sm:text-xl md:text-[29px] leading-tight'>
                Chào mừng đến <span className='text-primary'>ShareAcademy</span></h2>
            <h2 className='text-sm sm:text-base text-gray-500 mt-1'>Khóa học chi tiết đầy đủ, dễ hiểu, dễ làm</h2>
        </div>
    </div>
  )
}

export default WelcomeBanner