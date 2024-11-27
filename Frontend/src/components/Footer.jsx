import React from 'react'

function Footer() {
  return (
    <div className='w-full h-auto py-10 flex flex-col bg-[#0092DB] font-cg-times'>
      <div className='w-full h-auto flex flex-col gap-5 sm:flex-row'>
        <div className='w-full h-auto flex flex-col text-white'>
          <p className='font-semibold text-center sm:text-lg md:text-xl lg:text-2xl md:tracking-wider'>Join our newsletter and get offers</p>
          <p className='text-center sm:text-lg md:text-xl lg:text-2xl md:tracking-wider'>Sign up our newsletter</p>
        </div>
        <div className='w-full h-auto flex justify-center items-center sm:justify-start'>
          <input type="text" placeholder='Enter your Email' className='w-[50%] p-2 outline-none' />
          <button className='text-white bg-black p-2 px-4'>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default Footer