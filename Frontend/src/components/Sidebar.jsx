import React from 'react'
import Logo from './images/loginSignupPageImages/logoSideImage.png'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import { FaLaptop } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbCashBanknote } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { LuUnlock } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setToggleSidebar } from './store/SidebarSlice';


function Sidebar() {
    const sidebar = useSelector((state) => state.sidebarSlice.sidebar)
    const dispatch = useDispatch()

    function handleSidebar() {
        dispatch(setToggleSidebar(false));
    }


    return (
        <div className={`${sidebar ? '-translate-x-0' : '-translate-x-[1000px]'} transition-all duration-600 ease-in-out lg:translate-x-0 w-full h-auto top-[75px] bg-[#2E2E2E] absolute flex flex-col py-10 lg:w-[30%] lg:sticky lg:top-0 xl:w-[25%] 2xl:w-[20%] `} >
            <img src={Logo} alt="Logo" className='w-72 mx-auto mt-4 lg:w-60' />
            <div className='w-full h-auto flex flex-col text-white font-[Poppins] mt-6'>
                <div className='w-full h-auto flex flex-col justify-center items-center gap-6'>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard' end className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0`}>
                        <RiDashboardHorizontalFill size={25} />
                        Dashboard
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/approval-section' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <LuShoppingCart size={25} />
                        Approval
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/sessions' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <FaLaptop size={25} />
                        Sessions
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/chat' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <LuMessageCircle size={25} />
                        Messages
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/notifications' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <IoMdNotificationsOutline size={25} />
                        Notifications
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/withdrawal' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <TbCashBanknote size={25} />
                        Withdrawal
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/profile-setting' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <LuSettings size={25} />
                        Profile Settings
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/change-password' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <LuUnlock size={25} />
                        Change Password
                    </NavLink>
                    <NavLink onClick={handleSidebar} to='/mentor-dashboard/referals' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                        <FaUsers size={25} />
                        Referals
                    </NavLink>
                    <NavLink to='/mentor-dashboard' className='text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]'>
                        <MdLogout size={25} />
                        Logout
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar