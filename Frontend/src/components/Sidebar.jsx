import React, { useState } from 'react'
import Logo from './images/loginSignupPageImages/logoSideImage.webp'
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
import { NavLink, useNavigate } from 'react-router-dom';
import { setToggleSidebar } from './store/SidebarSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Loading from './utils/Loading';
import axios from 'axios';
import { MdSystemSecurityUpdateWarning } from "react-icons/md";
import { IoMdHelpCircleOutline } from "react-icons/io";


function LogoutDialog({ handleClose, handleLogout }) {

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to log out?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="error">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function Sidebar() {
    const [logoutPopUp, setLogoutPopUp] = useState(false)
    const [loading, setLoading] = useState(false)

    const sidebar = useSelector((state) => state.sidebarSlice.sidebar)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function handleSidebar() {
        dispatch(setToggleSidebar(false));
    }

    const handleClose = () => {
        setLogoutPopUp(false);
    };

    const handleLogout = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/mentors/mentor-logout")
            if (response.data.statusCode === 200) {
                setLogoutPopUp(false);
                setLoading(false)
                localStorage.removeItem("userId")
                localStorage.removeItem("userType")
                navigate('/login')
            }
        } catch (error) {
            console.log("Error while logging out !!", error);
            setLoading(false)
        }
    };


    return (
        <>
            {
                logoutPopUp && <LogoutDialog handleClose={handleClose} handleLogout={handleLogout} />

            }
            {
                loading && <Loading />
            }
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
                        <NavLink onClick={handleSidebar} to='/mentor-dashboard/wallet' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <TbCashBanknote size={25} />
                            Wallet
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
                        <NavLink onClick={handleSidebar} to='/mentor-dashboard/updates' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <MdSystemSecurityUpdateWarning size={25} />
                            Updates
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/mentor-dashboard/help' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <IoMdHelpCircleOutline size={25} />
                            Help
                        </NavLink>
                        <button onClick={() => setLogoutPopUp(true)} className='text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]'>
                            <MdLogout size={25} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar