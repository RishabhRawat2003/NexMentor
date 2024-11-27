import React from 'react'
import BgImage from '../images/home/whychoose.png'
import CenterImage from '../images/home/whychoose2.png'
import { LuShieldCheck } from "react-icons/lu";

function WhyChoose() {
    return (
        <div className='my-10 flex flex-col w-full font-cg-times pt-8 xl:pt-14' style={{ backgroundImage: `url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h1 className='font-semibold text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl'>Why Choose <span className='text-[#0092DB]'>NexMentor</span> ?</h1>
            <p className='mt-5 text-center text-[#595959] text-xs md:px-10 md:text-sm lg:text-base lg:px-20'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, tempora facilis, culpa suscipit tenetur, cumque iusto dolores consequatur iure nobis quam modi animi quae nostrum! Vero, earum quidem neque reprehenderit reiciendis necessitatibus quis consectetur, veniam molestiae praesentium amet, distinctio incidunt.</p>
            <div className='w-full h-auto flex justify-center items-center relative'>
                <img src={CenterImage} alt="image" className='w-[90%] md:w-[60%] xl:w-[45%] rounded-md' />
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:absolute lg:top-32 lg:left-36 lg:px-6 xl:left-60 2xl:left-80 lg:py-2 2xl:py-4 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <p className='flex-1'>Lorem ipsum dolor sit amet consectetur</p>
                    <LuShieldCheck size={30} className='text-white' />
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:absolute lg:top-64 lg:left-20 xl:left-48 2xl:left-72 2xl:top-96 2xl:py-4 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <p className='flex-1'>Lorem ipsum dolor sit amet consectetur</p>
                    <LuShieldCheck size={30} className='text-white' />
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:gap-5 lg:absolute lg:bottom-32 lg:right-36 xl:right-60 2xl:right-80 2xl:py-4 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <LuShieldCheck size={30} className='text-white' />
                    <p className='flex-1'>Lorem ipsum dolor sit amet consectetur</p>
                </div>
                <div className='hidden lg:w-[300px] lg:h-auto lg:flex lg:justify-between lg:gap-5 lg:absolute lg:bottom-80 lg:right-20 xl:right-48 2xl:right-72 2xl:py-4 2xl:bottom-96 lg:px-6 lg:py-2 lg:text-white lg:rounded-xl lg:bg-gradient-to-r lg:from-[#0092DB] lg:to-[#355F9F]'>
                    <LuShieldCheck size={30} className='text-white' />
                    <p className='flex-1'>Lorem ipsum dolor sit amet consectetur</p>
                </div>
            </div>
        </div>
    )
}

export default WhyChoose