import React, { useEffect, useState } from 'react'
import { FaBars } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setToggleSidebar } from '../store/SidebarSlice';
import { IoClose } from "react-icons/io5";


function Header({ handleStateChange }) {
    const [sideBar, setSideBar] = useState(false)
    const dispatch = useDispatch()

    function handleSidebar() {
        setSideBar((prevSideBar) => !prevSideBar);
        handleStateChange()
    }

    useEffect(() => {
        dispatch(setToggleSidebar(sideBar));
    }, [sideBar, dispatch]);
    return (
        <div className='w-full h-auto flex justify-between items-center p-5 bg-white'>
            <div className='flex w-auto h-auto gap-2 items-center sm:gap-4'>
                {
                    sideBar ? <IoClose onClick={handleSidebar} size={25} className='lg:hidden cursor-pointer' /> : <FaBars onClick={handleSidebar} size={25} className='lg:hidden cursor-pointer' />
                }
                <span className='font-[inter] font-semibold text-xl lg:text-3xl'>Dashboard</span>
            </div>
            <div className='flex w-auto h-auto gap-4 items-center lg:gap-8'>
                <IoNotificationsOutline size={25} />
                <IoMailOutline size={25} />
                <span className=''><img src="" alt="" className='h-9 w-9 bg-gray-200 rounded-full' /></span>
            </div>
        </div>
    )
}

export default Header