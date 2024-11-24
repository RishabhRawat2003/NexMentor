import React, { useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";

function MentorApproval() {
  const [localSidebarState, setLocalSidebarState] = useState(false)

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
        <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
          <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Mentors Verification request</span>
          <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
            <IoSearch size={20} />
            <input type="text" placeholder='Search by MentorId' className='outline-none h-auto w-full py-2' />
          </div>
        </div>
        <div className='w-full h-auto flex flex-col mt-4'>
          <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
            <span className='w-1/12 text-center'>S.No</span>
            <span className='w-4/12 text-center'>Package Name</span>
            <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
            <span className='w-4/12 text-center sm:w-4/12'>Student</span>
            <span className='w-1/12 text-center'></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorApproval