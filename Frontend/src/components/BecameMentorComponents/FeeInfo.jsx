import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

function FeeInfo() {
    return (
        <div className='w-full h-auto flex flex-col gap-3 justify-center md:flex-row xl:px-20 xl:my-10 xl:gap-10'>
            <div className='w-full h-auto flex flex-col px-5'>
                <p className="py-1.5 border-l-2 px-3 md:text-lg font-semibold md:py-2 border-l-black text-[#000B26]">
                    Why We Charge?
                </p>
                <div className="w-full h-auto flex flex-col text-3xl font-bold mt-5 gap-2 md:gap-4 xl:text-5xl">
                    <h2>Why We Charge a</h2>
                    <h2>One-Time Application</h2>
                    <h2>Fee of ₹149?</h2>
                </div>
                <p className='mt-5'>This small fee reflects your commitment to making a difference. It enables us to build a community of dedicated mentors and allows you to quickly recoup the cost with just one session.</p>
            </div>
            <div className='w-full h-auto flex flex-col justify-center items-center px-5 gap-6 xl:gap-10'>
                <div className='w-full h-auto flex justify-center items-center gap-4'>
                    <div className='w-auto h-full'>
                        <span className='p-3 rounded-full flex justify-center items-center shadow-md' style={{
                            background: "linear-gradient(180deg, #757575 0%, #000000 100%)",
                        }}><FaArrowRightLong size={20} className='text-white' /></span>
                    </div>
                    <div className='w-full h-auto flex flex-col text-[#000B26]'>
                        <span className='font-semibold text-2xl xl:text-4xl'>Quality & Commitment</span>
                        <span className='text-[#2C2C2C] xl:text-xl'>Ensures we bring in mentors who genuinely care.</span>
                    </div>
                </div>
                <div className='w-full h-auto flex justify-center items-center gap-4'>
                    <div className='w-auto h-full'>
                        <span className='p-3 rounded-full flex justify-center items-center shadow-md' style={{
                            background: "linear-gradient(180deg, #757575 0%, #000000 100%)",
                        }}><FaArrowRightLong size={20} className='text-white' /></span>
                    </div>
                    <div className='w-full h-auto flex flex-col text-[#000B26]'>
                        <span className='font-semibold text-2xl xl:text-4xl'>Saves Time for Both</span>
                        <span className='text-[#2C2C2C] xl:text-xl'>Shows us your dedication and passion.</span>
                    </div>
                </div>
                <div className='w-full h-auto flex justify-center items-center gap-4'>
                    <div className='w-auto h-full'>
                        <span className='p-3 rounded-full flex justify-center items-center shadow-md' style={{
                            background: "linear-gradient(180deg, #757575 0%, #000000 100%)",
                        }}><FaArrowRightLong size={20} className='text-white' /></span>
                    </div>
                    <div className='w-full h-auto flex flex-col text-[#000B26]'>
                        <span className='font-semibold text-2xl xl:text-4xl'>Quick Recovery</span>
                        <span className='text-[#2C2C2C] xl:text-xl'>Earn it back with your first impactful session.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeeInfo