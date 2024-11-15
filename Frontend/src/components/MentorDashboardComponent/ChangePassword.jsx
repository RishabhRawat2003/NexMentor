import React from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import { NavLink } from 'react-router-dom'

function ChangePassword() {
  return (
    <div className='w-full h-screen lg:h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header />
      <div className='w-full flex flex-col px-5 py-10 font-cg-times flex-grow mx-auto sm:w-[55%] md:w-[45%] xl:w-[35%]'>
        <h1 className='text-center text-3xl font-semibold'>Change Password</h1>
        <p className='text-center mt-5'>Enter Your Old Password to create a New Password.</p>
        <div className='w-full h-auto flex flex-col md:mt-9'>
          <TextField
            label="Current Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type='password'
          />
          <TextField
            label="New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type='password'
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type='password'
          />
        </div>
        <div className='w-full h-auto flex justify-end items-center'>
          <NavLink to='/login/forgot-password' className='text-sm text-blue-500'>Forget Password ?</NavLink>
        </div>
        <div className='w-full h-auto flex flex-col bg-blue-500 text-white justify-center items-center py-2 mt-6 rounded-md cursor-pointer'>
          Change Password
        </div>
      </div>
    </div>
  )
}

export default ChangePassword