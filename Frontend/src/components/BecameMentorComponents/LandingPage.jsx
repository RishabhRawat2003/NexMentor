import React from 'react'
import LandingImage from '../images/becamementor/landingimage1.webp'

function LandingPage() {
    return (
        <div className='w-full h-auto flex flex-col justify-center items-center relative font-cg-times text-white'>
            <img src={LandingImage} alt="bg-image" className='w-full' />
            <div className='bg-[linear-gradient(180deg,_rgba(19,34,57,0.9)_0%,_rgba(0,146,219,0.9)_100%)] w-full h-full absolute opacity-45'></div>
            <div className='absolute w-full h-auto font-semibold'>
                <p className='text-center text-sm md:text-base lg:text-lg xl:text-xl'>Why ?</p>
                <p className='text-center text-lg my-3 sm:text-xl md:text-5xl md:my-6 lg:text-6xl lg:px-40 xl:my-10 xl:px-60'>Inspire the Next Generation with NexMentor: Become a Guide, Friend, and Beacon of Hope</p>
                <p className='text-center hidden sm:block text-[#D1D1D1] text-sm md:text-base lg:text-lg lg:px-20 xl:px-32 xl:text-xl'>Welcome to NexMentor! Your journey in medicine tells a story of resilience, passion, and purpose—a story that can inspire and guide others. As a mentor, you have the chance to be the reassuring voice NEET aspirants rely on, the advice they trust, and the guide they’ll remember for a lifetime.</p>
            </div>
        </div>
    )
}

export default LandingPage