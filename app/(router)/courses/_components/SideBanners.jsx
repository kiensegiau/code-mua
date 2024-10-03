import GlobalApi from '@/app/_utils/GlobalApi'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function SideBanners() {

    const [sideBannerList,setSideBannerList]=useState();
   
  return (
    <div>
        {sideBannerList&&sideBannerList.map((item,index)=>(
            <div key={index} className='m-2 p-3 bg-white rounded-xl'>
                <Image src={item.banner.url} alt='banner'
                width={500}
                height={300}
                onClick={()=>window.open(item?.url)}
                className='rounded-xl cursor-pointer' />
            </div>
        ))}
    </div>
  )
}

export default SideBanners