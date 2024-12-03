import React from 'react'
import Image4 from '../images/becamementor/image4.webp'
import { FaArrowRightLong } from "react-icons/fa6";

function Banner() {
    return (
        <div className='w-full h-auto flex flex-col justify-center items-center mx-auto my-10 relative md:w-[90%] xl:w-[75%]'>
            <img src={Image4} alt="banner" className='w-full h-72 sm:w-full' />
            <div className='w-full h-auto flex flex-col justify-center items-center absolute top-5 text-white my-auto'>
                <h1 className='sm:text-lg lg:text-xl xl:text-3xl'>Join NexMentor and Make a Difference Today!</h1>
                <div className='w-full h-[1px] bg-white mx-auto my-4 xl:my-8'></div>
                <p className='text-xs text-center sm:text-base xl:px-20'>Start your journey as a mentor, guide, and friend to those who need you most. Your experiences aren’t just stories—they’re beacons for aspirants who dream of wearing the white coat. Join NexMentor today and become the light that leads someone to their future.</p>
                <div className='w-full h-auto flex justify-center items-center mt-14 sm:mt-10 md:mt-16 xl:mt-10'>
                    <p className='w-[160px] pl-4 border-2 border-white text-white rounded-3xl flex justify-between items-center'>
                        Know More
                        <span className='p-3 bg-white text-black rounded-full flex justify-center items-center'><FaArrowRightLong size={20} /></span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Banner