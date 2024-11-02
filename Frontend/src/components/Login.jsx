import React, { useEffect, useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import Logo from './images/logo.png'
import { FaBars } from "react-icons/fa6";
import { AiFillLinkedin } from 'react-icons/ai';
import TextField from '@mui/material/TextField';
import sliderImage1 from './images/loginSignupPageImages/slider1.jpg'
import sliderImage2 from './images/loginSignupPageImages/slider2.jpg'
import sliderImage3 from './images/loginSignupPageImages/slider3.jpg'
import { FaArrowLeftLong } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Login() {
  const [activeContainer, setActiveContainer] = useState('student')
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [sliderImage1, sliderImage2, sliderImage3];

  function handleButtonClick(params) {
    setActiveContainer(params)
  }

  const handleLogin = () => {
    window.location.href = "http://localhost:8000/api/v1/students/auth/linkedin";
  };

  const handleLoginSuccess = async (response) => {
    const idToken = response.credential;

    try {
      const res = await axios.post("/api/v1/students/google-auth", { idToken })
      console.log(res.data);

    } catch (error) {
      console.error('Error sending ID token to backend:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  const handleBulletClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length])

  return (
    <>
      <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" />
        <div className='md:hidden'><FaBars size={30} /></div>
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times xl:hidden'>
          <h1 className='text-[#0092DB] text-3xl font-bold'>Welcome Back</h1>
          <p className='text-lg'>Somewords will come here </p>
        </div>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Image slider start here */}
          <div className='hidden xl:flex xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden'>
            <div className="relative w-full mx-auto overflow-hidden flex items-center justify-center">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                  <img src={image} key={index} alt={`Slide ${index + 1}`} className="w-full h-auto min-w-full object-contain" />
                ))}
              </div>
              <div className='absolute left-5 bottom-24 flex flex-col gap-1 font-cg-times text-white'>
                <span className='text-6xl'>Welcome Back</span>
                <span className='text-3xl'>Something will come here</span>
              </div>
              <NavLink to="/" className='absolute top-5 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                <FaArrowLeftLong />Back to Homepage
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
          {/* main form start here */}
          <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex justify-center items-center text-2xl font-cg-times font-bold'>LOGIN</div>
            <div className='w-auto h-auto flex font-cg-times text-sm mt-5'>
              <p onClick={() => handleButtonClick('student')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Student</p>
              <p onClick={() => handleButtonClick('mentor')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Mentor</p>
            </div>
            <div className={`${activeContainer === 'student' ? 'translate-x-0' : 'translate-x-[50%]'} w-auto h-auto flex transition duration-300`}>
              <p className='w-[50%] h-[2px] bg-[#0092DB]'></p>
            </div>
            <div className='relative w-full h-[65vh] overflow-hidden'>
              {/* student login */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out ${activeContainer === 'student' ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
                <div className='w-full h-auto flex items-center justify-between mt-7'>
                  <div className='w-[45%]'>
                    <GoogleOAuthProvider clientId={googleClientId}>
                      <div className='w-full h-10 bg-gray-300'>
                        <GoogleLogin
                          onSuccess={handleLoginSuccess}
                          onError={handleLoginFailure}
                          text="signin"
                        />
                      </div>
                    </GoogleOAuthProvider>
                  </div>
                  <div className='w-[45%] py-1 border-[1px] md:hover:bg-blue-50 active:bg-blue-50'>
                    <button className='flex items-center px-2 rounded-sm w-full h-7.5' onClick={handleLogin}><AiFillLinkedin size={30} className='text-blue-700' /><p className='flex-1'>LinkedIn</p></button>
                  </div>
                </div>
                <div className='h-auto mt-7 mx-4 flex items-center gap-3 justify-center'>
                  <p className='w-full h-[1px] bg-gray-400'></p>
                  <span className='w-[20%] text-xs text-gray-400 font-semibold text-center font-cg-times'>OR</span>
                  <p className='w-full h-[1px] bg-gray-400'></p>
                </div>
                <div className='w-full h-auto flex flex-col'>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type='password'
                  />
                  <div className='w-full h-auto flex justify-between items-center font-cg-times my-3 text-xs px-2'>
                    <div className='flex items-center gap-2 select-none'><input type="checkbox" className='w-3' id='check' /> <label htmlFor="check">Remember Me</label></div>
                    <NavLink to='forgot-password' className='text-gray-500 md:hover:text-[#0092DB] active:text-[#0092DB]'>Forgot Password ?</NavLink>
                  </div>
                  <div className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                    Login
                  </div>
                  <div className='w-full h-auto font-cg-times text-gray-500 text-xs xl:text-sm'>
                    <p className='text-center'>Don’t Have an Account? Join Now as <NavLink to="/signup" className='text-black font-bold md:hover:text-[#0092DB] cursor-pointer active:text-[#0092DB]'> Student</NavLink></p>
                  </div>
                </div>
              </div>
              {/* mentor login */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out mb-20 ${activeContainer === 'mentor' ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
                <div className='w-full h-auto my-10 flex justify-center items-center font-cg-times text-[#0092DB] font-semibold'>
                  Only Verified mentors can login
                </div>
                <div className='w-full h-auto flex flex-col'>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type='password'
                  />
                  <div className='w-full h-auto flex justify-between items-center font-cg-times my-3 text-xs px-2'>
                    <div className='flex items-center gap-2 select-none'><input type="checkbox" className='w-3' id='check' /> <label htmlFor="check">Remember Me</label></div>
                    <NavLink to='forgot-password' className='text-gray-500 md:hover:text-[#0092DB] active:text-[#0092DB]'>Forgot Password ?</NavLink>
                  </div>
                  <div className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                    Login
                  </div>
                  <div className='w-full h-auto font-cg-times text-gray-500 text-xs xl:text-sm'>
                    <p className='text-center'>Don’t Have an Account? Join Now as <NavLink to="/signup" className='text-black font-bold md:hover:text-[#0092DB] cursor-pointer active:text-[#0092DB]'>Mentor</NavLink></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login