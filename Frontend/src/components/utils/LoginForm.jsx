import React from 'react'
import TextField from '@mui/material/TextField';
import { NavLink } from 'react-router-dom';


function LoginForm({ value1, value2, onChangeEvent, label , loginEvent }) {
    return (
        <div className='w-full h-auto flex flex-col'>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={value1}
                name='email'
                onChange={onChangeEvent}
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type='password'
                name='password'
                value={value2}
                onChange={onChangeEvent}
            />
            <div className='w-full h-auto flex justify-between items-center font-cg-times my-3 text-xs px-2'>
                <div className='flex items-center gap-2 select-none'><input type="checkbox" className='w-3' id='check' /> <label htmlFor="check">Remember Me</label></div>
                <NavLink to='forgot-password' className='text-gray-500 md:hover:text-[#0092DB] active:text-[#0092DB]'>Forgot Password ?</NavLink>
            </div>
            <div onClick={loginEvent} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                Login
            </div>
            <div className='w-full h-auto font-cg-times text-gray-500 text-xs xl:text-sm'>
                <p className='text-center'>Don’t Have an Account? Join Now as <NavLink to="/signup" className='text-black font-bold md:hover:text-[#0092DB] cursor-pointer active:text-[#0092DB]'> {label} </NavLink></p>
            </div>
        </div>
    )
}

export default LoginForm