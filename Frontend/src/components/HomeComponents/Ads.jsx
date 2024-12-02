import React from 'react'
import Marquee from 'react-fast-marquee';


function Ads() {
    return (
        <div className='w-full h-auto my-10 py-2'><Marquee direction='left' speed={70} className='text-sm text-gray-600 font-cg-times font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:tracking-widest'><span>MENTORSHIP FROM ARCHEIVER </span> <span className='hidden md:inline ml-20'> MENTORSHIP FROM ARCHEIVER</span></Marquee></div>
    )
}

export default Ads