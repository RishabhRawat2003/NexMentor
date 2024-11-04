import React, { useState, useEffect, useMemo } from 'react'
import Logo from './images/logo.png';
import { FaBars, FaArrowLeftLong } from "react-icons/fa6";
import sliderImage1 from './images/loginSignupPageImages/slider1.jpg';
import sliderImage2 from './images/loginSignupPageImages/slider2.jpg';
import sliderImage3 from './images/loginSignupPageImages/slider3.jpg';
import { NavLink } from 'react-router-dom';


const images = [sliderImage1, sliderImage2, sliderImage3];

function MentorSignupSuccess() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleBulletClick = (index) => setCurrentIndex(index);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sliderContent = useMemo(() => (
    images.map((image, index) => (
      <img src={image} key={index} alt={`Slide ${index + 1}`} className="w-full h-auto min-w-full object-contain" />
    ))
  ), [images]);
  return (
    <>
      <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" />
        <div className='md:hidden'><FaBars size={30} /></div>
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Image slider */}
          <div className='hidden xl:flex xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden'>
            <div className="relative w-full mx-auto overflow-hidden flex items-center justify-center">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {sliderContent}
              </div>
              <div className='absolute left-5 bottom-24 flex flex-col gap-1 font-cg-times text-white'>
                <span className='text-6xl'>Welcome Back</span>
                <span className='text-3xl'>Something will come here</span>
              </div>
              <NavLink to="/" className='absolute top-5 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                <FaArrowLeftLong /> Back to Homepage
              </NavLink>
              <div className="absolute flex justify-center mt-2 bottom-5">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-14 h-1.5 rounded-full mx-1 cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-gray-300' : 'bg-gray-800'}`}
                    onClick={() => handleBulletClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
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