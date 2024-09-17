import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
  return (
    <div className='flex gap-5 items-center bg-white rounded-xl 
    p-8'>
        <Image src='/panda.png' alt='panda'
        width={120}
        height={130}/>
        <div>
            <h2 className='font-bold text-[29px]'>
                Welcome to <span className='text-primary'>TubeGuruji</span> Academy</h2>
            <h2 className='text-gray-500'>Explore, Learn and Build All Real Life Projects</h2>
        </div>
    </div>
  )
}

export default WelcomeBanner