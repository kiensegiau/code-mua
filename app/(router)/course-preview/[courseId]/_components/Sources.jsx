import { UserMemberContext } from '@/app/_context/UserMemberContext'
import Image from 'next/image'
import React, { useContext } from 'react'

function Sources({courseInfo}) {
    const optionsList=[
        {
            id:1,
            name:'Source Code',
            icon:'/open-source.png',
            url:'sourceCode'
        },
        {
            id:2,
            name:'App Demo',
            icon:'/web-design.png',
            url:'demoUrl'
        },
        {
            id:3,
            name:'Youtube',
            icon:'/youtube.png',
            url:'youtubeUrl'
        },
    ]

    const {isMember,setIsMember}=useContext(UserMemberContext)
    
  return (
    <div className='flex items-center gap-3'>
        {optionsList.map((option,index)=>(
            <div key={index}
            className='p-2 border rounded-lg flex flex-col 
            items-center w-full cursor-pointer bg-white mb-3'
            onClick={()=>
                !isMember
                ?router.push('/tubeguruji-pro')
                :window.open(courseInfo
                    [option.url])}
            >
                <Image src={option.icon}
                width={30}
                height={30}
                alt='icons'
                />
                <h2 className='text-[14px]
                texr-gray-500'>{option.name}</h2>
            </div>
        ))}
    </div>
  )
}

export default Sources