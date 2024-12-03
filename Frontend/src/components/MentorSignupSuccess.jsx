import React from 'react'
import Logo from './images/logo2.webp';
import { NavLink } from 'react-router-dom';
import Slider from './utils/Slider';



function MentorSignupSuccess() {
  return (
    <>
      <header className='w-full h-auto flex items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" className='w-40 sm:w-52 md:w-60'/>
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Image slider */}
          <Slider />
          {/* Main form */}
          <div className='w-auto h-auto flex flex-col justify-center mt-10 mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex flex-col justify-center items-center font-cg-times'>
              <h1 className='text-3xl font-semibold'>CONRATULATIONS !</h1>
              <span className='text-lg text-[#959595] mt-10'>Thank You! 🎉</span>
              <p className='text-lg text-[#959595] mt-5'>Your application to become a mentor at NexMentor has been successfully submitted. We appreciate your interest and are currently reviewing your application.</p>
              <p className='text-lg text-[#959595] mt-5'>Please wait for our approval. We’ll be in touch soon!</p>
              <NavLink to='/login' className='w-full h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentorSignupSuccess