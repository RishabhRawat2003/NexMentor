import React, { useEffect, useState } from 'react'
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiUsers } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import Header from './Header';



function MentorDashboard() {
    const [localSidebarState,setLocalSidebarState] = useState(false)

    function handleStateChange(){
        setLocalSidebarState((prev)=> !prev)
    }

    return (
        <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
            <Header handleStateChange={handleStateChange} />
            <div className='w-full h-auto flex flex-wrap justify-center gap-4 mt-5'>
                <div className='w-[230px] h-auto rounded-3xl p-3 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                    <div className='w-full h-auto flex justify-between items-center gap-4'>
                        <span className='text-xl text-[#797D8C] xl:text-2xl'>Active Sessions</span>
                        <MdOutlineShoppingCartCheckout size={20} className='xl:size-7' />
                    </div>
                    <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>10</span>
                    <div className='text-end underline underline-offset-2 text-[#0092DB] xl:text-lg cursor-pointer'>view</div>
                </div>
                <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                    <div className='w-full h-auto flex justify-between items-center gap-4'>
                        <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Earnings</span>
                        <BsGraphUpArrow size={20} className='xl:size-7' />
                    </div>
                    <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>10k</span>
                    <div className='text-end underline underline-offset-2 text-[#0092DB] xl:text-lg cursor-pointer'>view</div>
                </div>
                <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                    <div className='w-full h-auto flex justify-between items-center gap-4'>
                        <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Sessions</span>
                        <LuShoppingCart size={20} className='xl:size-7' />
                    </div>
                    <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>10</span>
                    <div className='text-end underline underline-offset-2 text-[#0092DB] xl:text-lg cursor-pointer'>view</div>
                </div>
                <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                    <div className='w-full h-auto flex justify-between items-center gap-4'>
                        <span className='text-xl text-[#797D8C] xl:text-2xl'>Referred People</span>
                        <HiUsers size={20} className='xl:size-7' />
                    </div>
                    <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>10</span>
                    <div className='text-end underline underline-offset-2 text-[#0092DB] xl:text-lg cursor-pointer'>view</div>
                </div>
            </div>
            <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
                <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                    <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Completed Sessions</span>
                    <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
                        <IoSearch size={20} />
                        <input type="text" placeholder='Search by username' className='outline-none h-auto w-full py-2' />
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col mt-4'>
                    <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
                        <span className='w-1/12 text-center'>S.No</span>
                        <span className='w-4/12 text-center'>Package Name</span>
                        <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
                        <span className='w-4/6 text-center sm:w-4/12'>Student</span>
                        <span className='w-1/12 text-center hidden xl:block'></span>
                        <span className='w-1/12 text-center hidden xl:block'></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MentorDashboard