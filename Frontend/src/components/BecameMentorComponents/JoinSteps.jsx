import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { MdSettingsSuggest } from "react-icons/md";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import Image3 from '../images/becamementor/image3.webp'

function JoinSteps() {
    return (
        <div className='w-full h-auto flex flex-col my-5 lg:flex-row lg:items-center lg:my-10 xl:pr-20'>
            <div className='w-full h-auto flex flex-col px-5 gap-5 lg:px-10 xl:px-20 xl:gap-8 lg:w-[80%] xl:w-[70%]'>
                <div className='w-full h-auto flex justify-center items-center gap-4'>
                    <div className='w-auto h-full flex justify-center items-center'>
                        <span className='p-3 rounded-full flex justify-center items-center shadow-md' style={{
                            background: "linear-gradient(180deg, #757575 0%, #000000 100%)",
                        }}><FaArrowRightLong size={20} className='text-white' /></span>
                    </div>
                    <div className='w-full h-auto flex flex-col text-[#000B26] font-bold text-3xl lg:text-4xl'>
                        <span>How to Join</span>
                        <span className='underline decoration-2 underline-offset-2'>NexMentor</span>
                    </div>
                </div>
                <p className='font-semibold xl:text-lg'>Start your journey as a mentor, guide, and friend to those who need you most.</p>
                <div className='w-full h-auto grid grid-cols-1 justify-items-center sm:grid-cols-2 gap-6 xl:mt-10'>
                    <div className='w-full h-auto p-3 bg-white shadow-custom flex flex-col gap-4 xl:p-4'>
                        <div className='w-full h-auto flex items-center gap-3'>
                            <span className='p-3 bg-[#F3F3F3] flex justify-center items-center'><IoNewspaperOutline size={20} /></span>
                            <span className='font-semibold xl:text-lg'>Submit Your Application</span>
                        </div>
                        <p className='text-[#413E3E]'>Provide your basic details along with your NEET scorecard and college ID card to initiate the application process.</p>
                    </div>
                    <div className='w-full h-auto p-3 bg-[#0092DB] shadow-custom flex flex-col gap-4 xl:p-4'>
                        <div className='w-full h-auto flex items-center gap-3'>
                            <span className='p-3 bg-[#F3F3F3] flex justify-center items-center text-black'><MdVerifiedUser size={20} /></span>
                            <span className='font-semibold text-white xl:text-lg'>Document Verification and Soft Skills Assessment</span>
                        </div>
                        <p className='text-[#CACACA]'>We’ll verify your documents and evaluate your soft skills through a brief interview.</p>
                    </div>
                    <div className='w-full h-auto p-3 bg-white shadow-custom flex flex-col gap-4 xl:p-4'>
                        <div className='w-full h-auto flex items-center gap-3'>
                            <span className='p-3 bg-[#F3F3F3] flex justify-center items-center'><MdSettingsSuggest size={20} /></span>
                            <span className='font-semibold xl:text-lg'>Training and Onboarding</span>
                        </div>
                        <p className='text-[#413E3E]'>Approved candidates will undergo a short training session to understand the platform and effective mentoring practices.</p>
                    </div>
                    <div className='w-full h-auto p-3 bg-white shadow-custom flex flex-col gap-4 xl:p-4'>
                        <div className='w-full h-auto flex items-center gap-3'>
                            <span className='p-3 bg-[#F3F3F3] flex justify-center items-center'><MdOutlinePublishedWithChanges size={20} /></span>
                            <span className='font-semibold xl:text-lg'>Get Set Up and Start Mentoring</span>
                        </div>
                        <p className='text-[#413E3E]'>Set up your mentor profile and begin conducting impactful mentorship sessions to help others succeed.</p>
                    </div>
                </div>
                <div className='w-full h-auto my-5'>
                    <p className='w-[160px] pl-4 border-2 border-black rounded-3xl flex justify-between items-center'>
                        Know More
                        <span className='p-3 bg-[#0092DB] rounded-full flex justify-center items-center'><FaArrowRightLong size={20} /></span>
                    </p>
                </div>
            </div>
            <div className='w-full h-auto my-5 px-3 sm:w-[53%] sm:mx-auto md:w-[43%] lg:w-[38%] 2xl:w-[30%]'>
                <div className='w-full h-auto relative'>
                    <img src={Image3} alt="image" className='w-[300px] relative z-50 xl:w-[380px]' />
                    <div className='w-full h-[300px] absolute bg-black top-7 xl:h-[380px] left-1'></div>
                </div>
            </div>
        </div>
    )
}

export default JoinSteps