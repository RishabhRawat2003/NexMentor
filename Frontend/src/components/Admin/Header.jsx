import React, { useEffect, useState } from 'react'
import { FaBars } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { setToggleSidebar } from '../store/SidebarSlice';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header({ handleStateChange, getData }) {
    const [sideBar, setSideBar] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleSidebar() {
        setSideBar((prevSideBar) => !prevSideBar);
        handleStateChange()
    }

    async function fetchUser() {
        try {
            const response = await axios.post("/api/v1/admin/admin-details")
            if (response.data.statusCode === 200) {
                setUserDetails(response.data.data)
                if (getData) {
                    getData(response.data.data);
                }
            }
        } catch (error) {
            console.log("Error while fetching user details", error);
            navigate('/')
            localStorage.removeItem("adminId")
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

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
                <span className=''><img src={userDetails?.profilePicture} alt="profile Picture" className='h-9 w-9 bg-gray-200 rounded-full border-[1px] object-cover border-blue-500 xl:w-12 xl:h-12' /></span>
            </div>
        </div>
    )
}

export default Header