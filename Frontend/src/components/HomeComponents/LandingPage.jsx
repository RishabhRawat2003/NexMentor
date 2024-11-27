import React from 'react'
import Image1 from '../images/home/1.png'
import Image2 from '../images/home/2.png'
import Image3 from '../images/home/3.png'
import Image4 from '../images/home/4.png'

function LandingPage() {

    return (
        <div className='w-full h-auto flex flex-col gap-4 md:flex-row-reverse mt-5 md:mt-10 xl:px-10'>
            <div className='w-[95%] mx-auto h-auto flex justify-between pt-2 pl-2 bg-[#0092DB1F] rounded-lg md:w-[50%]'>
                <div className='w-[49%] h-auto'>
                    <img src={Image1} alt="landing image" className='rounded-xl pb-2 object-cover' />
                </div>
                <div className='w-[49%] h-auto flex flex-col justify-between'>
                    <img src={Image2} alt="landing image 2" className='rounded-xl pb-2 pr-2 object-cover' />
                    <div className='w-full h-auto flex flex-col bg-white flex-1 rounded-t-xl rounded-r-none sm:justify-evenly'>
                        <div className='w-full h-auto flex justify-between items-center mt-2'>
                            <div className='w-full h-auto flex flex-col font-cg-times text-xs sm:w-[48%] sm:text-base md:w-full lg:w-[48%]'>
                                <p className='text-center font-semibold'>100 + </p>
                                <p className='text-center text-gray-500'>Current Mentors </p>
                            </div>
                            <div className='sm:w-[48%] sm:h-auto hidden md:hidden lg:flex sm:flex sm:flex-col sm:font-cg-times sm:text-base'>
                                <p className='text-center font-semibold'>200 + </p>
                                <p className='text-center text-gray-500'>Current Students </p>
                            </div>
                        </div>
                        <div className='w-full h-auto flex justify-center sm:justify-between items-center md:justify-center lg:justify-between mt-2'>
                            <img src={Image3} alt="landing image 3" className=' w-32 sm:w-[48%] object-cover' />
                            <img src={Image4} alt="landing image 3" className=' hidden sm:block sm:w-[48%] object-cover md:hidden lg:block' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-auto flex flex-col px-3 md:w-[50%]'>
                <div className='w-full h-auto'>
                    <span className='bg-[#0092DB78] px-4 py-1.5 font-cg-times text-sm rounded-md md:text-base md:py-2 sm:text-base xl:px-6 xl:text-lg'>Find Top Mentors</span>
                </div>
                <div className='w-full h-auto flex flex-col font-cg-times mt-5 xl:mt-10'>
                    <h1 className='font-semibold text-2xl sm:text-5xl md:text-2xl lg:text-4xl xl:text-5xl'>Personalized Mentorship</h1>
                    <h1 className='font-semibold text-2xl sm:text-5xl md:text-2xl lg:text-4xl xl:text-5xl xl:mt-4'>from <span className='underline underline-offset-8 decoration-blue-500'>NEET Toppers</span></h1>
                    <p className='text-sm mt-4 text-[#5C5B5B] sm:text-base md:text-sm lg:text-lg font-semibold xl:mt-8 xl:text-xl'>Boost your chances of NEET success with one-on-one guidance from those who've been there.</p>
                    <p className='text-sm text-black mt-6 sm:text-base md:text-sm lg:text-lg xl:mt-8 xl:text-xl'>Get tailored strategies, subject-specific advice, and proven study techniques directly from successful NEET achievers.</p>
                </div>
                <div className='w-full h-auto flex justify-between items-center sm:justify-start font-cg-times mt-6 xl:mt-20 xl:gap-4'>
                    <span className='bg-[#0092DB] text-white px-4 py-2 cursor-pointer rounded-md text-xs sm:text-sm md:text-xs lg:text-base md:hover:bg-[#0092dbc6] active:bg-[#0092dbc6] xl:text-lg'>Book Your Session Now</span>
                    <span className='px-4 py-2 rounded-md text-xs cursor-pointer sm:text-sm md:text-xs lg:text-base xl:text-lg'>Attend a Free Webinar</span>
                </div>
            </div>
        </div>
    )
}

export default LandingPage