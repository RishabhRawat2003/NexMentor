import React from 'react'
import BgImage from '../images/home/whychoose.webp'
import CenterImage from '../images/home/whychoose2.webp'
import { LuShieldCheck } from "react-icons/lu";

function WhyChoose() {
    return (
        <div className='my-10 pb-10 flex flex-col w-full font-cg-times pt-8 xl:pt-14' style={{ backgroundImage: `url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h1 className='font-semibold text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl'>Why Choose <span className='text-[#0092DB]'>NexMentor</span> ?</h1>
            <p className='mt-5 text-center text-[#595959] text-xs md:px-10 md:text-sm lg:text-base lg:px-20'>Empower your NEET preparation with expert guidance from recent toppers, tailored study plans, and supportive
                resources that keep you motivated and on track. With NexMentor, you’re not just studying — you’re preparing with
                confidence and insights.</p>
            <div className='w-full h-auto flex justify-center items-center relative'>
                <img src={CenterImage} alt="image" className='w-[60%] mt-8 md:w-[40%] xl:w-[32%] rounded-md' />
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:absolute lg:top-32 lg:left-36 lg:px-6 xl:left-60 2xl:left-80 lg:py-2 2xl:py-4 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <p className='flex-1 2xl:text-lg'>Expert Guidance From Recent NEET Toppers</p>
                    <LuShieldCheck size={30} className='text-white' />
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:absolute lg:top-64 lg:left-20 xl:left-48 2xl:left-72 2xl:top-96 2xl:py-4 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <p className='flex-1 2xl:text-lg'>Customized Study Plans</p>
                    <LuShieldCheck size={30} className='text-white' />
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:gap-5 lg:absolute lg:bottom-32 lg:right-36 xl:right-60 2xl:right-80 2xl:bottom-20 2xl:py-4 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <LuShieldCheck size={30} className='text-white' />
                    <p className='flex-1 2xl:text-lg'>Free Educational Webinars</p>
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:gap-5 lg:absolute lg:bottom-80 lg:right-20 xl:right-48 2xl:right-72 2xl:py-4 2xl:bottom-80 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <LuShieldCheck size={30} className='text-white' />
                    <p className='flex-1 2xl:text-lg'>Real-Life Success Stories</p>
                </div>
            </div>
        </div>
    )
}

export default WhyChoose