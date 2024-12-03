import React from 'react';
import Image1 from '../images/home/home1.webp';
import Image2 from '../images/home/2.webp';
import Image4 from '../images/home/4.webp';
import { NavLink } from 'react-router-dom'

function LandingPage() {

    return (
        <div className='w-full flex flex-col gap-4 md:flex-row-reverse mt-5 md:mt-10 xl:px-10'>
            {/* Left Section */}
            <div className='w-[95%] mx-auto h-auto flex justify-between pt-2 pl-2 bg-[#0092DB1F] rounded-lg md:w-[50%]'>
                <div className='w-[49%] h-auto'>
                    <img src={Image1} alt="landing image" className='rounded-xl pb-2 object-cover' loading="lazy" />
                </div>
                <div className='w-[49%] h-auto flex flex-col justify-between'>
                    <img src={Image2} alt="landing image 2" className='rounded-xl pb-2 pr-2 object-cover' loading="lazy" />
                    <div className='w-full h-auto flex flex-col justify-evenly bg-white flex-1 rounded-t-xl rounded-r-none'>
                        {/* Mentors & Students Count */}
                        <div className='w-full h-auto flex justify-center lg:justify-between items-center mt-2'>
                            <div className='flex flex-col font-cg-times text-xs sm:w-[48%] sm:text-base md:w-full lg:w-[48%]'>
                                <p className='text-center font-semibold'>100 +</p>
                                <p className='text-center text-gray-500'>Current Mentors</p>
                            </div>
                            <div className='hidden lg:flex flex-col font-cg-times sm:w-[48%] sm:text-base'>
                                <p className='text-center font-semibold'>200 +</p>
                                <p className='text-center text-gray-500'>Current Students</p>
                            </div>
                        </div>
                        {/* Completed Sessions & Image */}
                        <div className='w-full h-auto flex justify-center sm:justify-between items-center mt-2'>
                            <div className='flex flex-col font-cg-times text-xs sm:w-[48%] sm:text-base md:w-full lg:w-[48%]'>
                                <p className='text-center font-semibold'>100 +</p>
                                <p className='text-center text-gray-500'>Completed Sessions</p>
                            </div>
                            <img src={Image4} alt="landing image 3" className='hidden sm:block sm:w-[48%] object-cover lg:block' loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className='w-full flex flex-col px-3 md:w-[50%]'>
                {/* Find Top Mentors Button */}
                <div className='w-full'>
                    <span className='bg-[#0092DB78] px-4 py-1.5 font-cg-times text-sm rounded-md md:text-base xl:px-6 xl:text-lg'>Find Top Mentors</span>
                </div>
                {/* Headline Text */}
                <div className='w-full flex flex-col font-cg-times mt-5 xl:mt-10'>
                    <h1 className='font-semibold text-2xl sm:text-5xl md:text-2xl lg:text-4xl xl:text-5xl'>Personalized Mentorship</h1>
                    <h1 className='font-semibold text-2xl sm:text-5xl md:text-2xl lg:text-4xl xl:text-5xl xl:mt-4'>
                        from <span className='underline underline-offset-[12px] decoration-blue-500'>NEET Toppers</span>
                    </h1>
                    <p className='text-sm mt-4 text-[#5C5B5B] sm:text-base md:text-sm lg:text-lg font-semibold xl:mt-8 xl:text-xl'>
                        Boost your chances of NEET success with one-on-one guidance from those who've been there.
                    </p>
                    <p className='text-sm text-black mt-6 sm:text-base md:text-sm lg:text-lg xl:mt-8 xl:text-xl'>
                        Get tailored strategies, subject-specific advice, and proven study techniques directly from successful NEET achievers.
                    </p>
                </div>

                {/* Call to Action Buttons */}
                <div className='w-full flex justify-between items-center sm:justify-start font-cg-times mt-6 xl:mt-20 xl:gap-4'>
                    <NavLink to='/search-mentor' className='bg-[#0092DB] text-white px-4 py-2 cursor-pointer rounded-md text-xs sm:text-sm md:text-xs lg:text-base xl:text-lg'>
                        Book Your Session Now
                    </NavLink>
                    <NavLink to='/webinar-page' className='px-4 py-2 rounded-md text-xs cursor-pointer sm:text-sm md:text-xs lg:text-base xl:text-lg md:hover:text-blue-500 active:text-blue-500'>
                        Attend a Free Webinar
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
