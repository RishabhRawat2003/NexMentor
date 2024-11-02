import React from 'react'
import Logo from './images/logo.png'
import { FaBars } from "react-icons/fa6";
import TextField from '@mui/material/TextField';
import ForgotImage from './images/loginSignupPageImages/forgetPassword.png'
import { NavLink } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";


function ForgotPassword() {
    return (
        <>
            <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
                <img src={Logo} alt="neXmentor Logo" />
                <div className='md:hidden'><FaBars size={30} /></div>
            </header >
            <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
                <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
                    {/* side Image */}
                    <div className='hidden xl:flex xl:flex-col xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden xl:bg-[#E0E0E0]'>
                        <div className='w-full h-auto flex justify-between items-center p-8'>
                            <img src={Logo} alt="neXmentor Logo" />
                            <NavLink to="/" className='px-5 py-2 bg-[#4A4A4A94] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                                <FaArrowLeftLong />Back to Homepage
                            </NavLink>
                        </div>
                        <div className='w-full h-auto flex flex-col items-center font-cg-times my-5 gap-4'>
                            <h1 className='text-5xl font-semibold'>Forgot Password ?</h1>
                            <p className='text-lg'>Don't you worry you can change your password here</p>
                        </div>
                        <img src={ForgotImage} alt="Forgot-Image Logo" className='object-contain w-[25vw] mx-auto' />
                    </div>
                    {/* main start here */}
                    <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%] font-cg-times'>
                        <h1 className='text-center text-2xl font-semibold md:text-3xl xl:text-5xl'>Forgot Password</h1>
                        <p className='w-full h-auto text-center text-sm text-gray-500 mt-6 mb-10 md:text-base'>Enter your email address below to receive a password reset link now.</p>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <div className='w-full h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer'>
                            Send Reset Link

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword