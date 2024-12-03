import React, { useState } from 'react'
import Logo from '../images/loginSignupPageImages/logoSideImage.webp'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdPostAdd } from "react-icons/md";
import { TbCashBanknote } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { LuUnlock } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setToggleSidebar } from '../store/SidebarSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Loading from '../utils/Loading';
import axios from 'axios';
import { MdSystemSecurityUpdateWarning } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";
import { RiUserStarFill } from "react-icons/ri";
import { FaRegNoteSticky } from "react-icons/fa6";
import { MdOutlineFeaturedVideo } from "react-icons/md";

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
            const response = await axios.post("/api/v1/admin/admin-logout")
            if (response.data.statusCode === 200) {
                setLogoutPopUp(false);
                setLoading(false)
                localStorage.removeItem("adminId")
                navigate('/admin/login')
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
                <div className='w-full h-auto flex flex-col text-white font-[Poppins] mt-10'>
                    <div className='w-full h-auto flex flex-col justify-center items-center gap-6'>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard' end className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0`}>
                            <RiDashboardHorizontalFill size={25} />
                            Dashboard
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/mentors' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <FaUsers size={25} />
                            Mentors
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/students' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <FaUsers size={25} />
                            Students
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/mentor-approval' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <LuShoppingCart size={25} />
                            Mentors Approvals
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/pending-sessions' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <MdPendingActions size={25} />
                            Pending Sessions
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/active-sessions' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <LuShoppingCart size={25} />
                            Active Sessions
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/payment' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <TbCashBanknote size={25} />
                            Payment
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/cleared-payment' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <TbCashBanknote size={25} />
                            Cleared Payment
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/admin-profile-setting' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <LuSettings size={25} />
                            Profile Settings
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/admin-change-password' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <LuUnlock size={25} />
                            Change Password
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/featured-mentors' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <RiUserStarFill size={25} />
                            Faetured Mentors
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/blog-post' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <MdPostAdd size={25} />
                            Blog Post
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/featured-ad' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <MdOutlineFeaturedVideo size={25} />
                            Featured Ad
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/admin-updates' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <MdSystemSecurityUpdateWarning size={25} />
                            Updates
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/webinars' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <GoDeviceCameraVideo size={25} />
                            Webinars
                        </NavLink>
                        <NavLink onClick={handleSidebar} to='/admin-dashboard/testimonial' className={({ isActive }) => `${isActive ? 'shadow-custom-blue bg-[#0092DB]' : 'bg-inherit shadow-none'} text-xl w-[280px] px-8 py-3 rounded-2xl flex justify-start items-center gap-3 lg:px-4 lg:text-base lg:mx-0 active:bg-[#0092DB] active:shadow-custom-blue lg:hover:shadow-custom-blue cursor-pointer lg:hover:bg-[#0092DB]`}>
                            <FaRegNoteSticky size={25} />
                            Testimonial
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