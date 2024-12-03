import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { MdManageSearch } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs";
import { GrCompliance } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import AccountInformation from './AccountInformation';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './utils/Loading';
import SessionManagement from './SessionManagement';
import CompletedSessions from './CompletedSessions';
import Chats from './Chats';
import ChatSingle from './ChatSingleStudent';


function AllTabs({ options, data, handleToChat }) {
  const { id } = useParams()
  const navigate = useNavigate()
  if (options === 'accountInformation') {
    if (id) {
      navigate('/student-profile', { replace: true });
    }
    return <AccountInformation data={data} />

  }
  else if (options === 'sessionManagement') {
    if (id) {
      navigate('/student-profile', { replace: true });
    }
    return <SessionManagement handleToChat={handleToChat} />
  }
  else if (options === 'chats') {
    return <Chats />
  }
  else {
    if (id) {
      navigate('/student-profile', { replace: true });
    }
    return <CompletedSessions />
  }

}

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


function StudentProfile() {
  const [options, setOptions] = useState('accountInformation')
  const [logoutPopUp, setLogoutPopUp] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  const navigate = useNavigate()

  const handleClose = () => {
    setLogoutPopUp(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/students/logout")
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

  async function fetchUserDetails() {
    try {
      try {
        setLoading(true)
        const userType = JSON.parse(localStorage.getItem("userType"));
        let url = userType === 'Student' ? "/api/v1/students/student-details" : userType === 'Mentor' ? "/api/v1/mentors/mentor-details" : "/api/v1/students/student-details";
        const response = await axios.post(url);
        setUserDetails(response.data.data);
        setLoading(false)
      } catch (error) {
        console.log("Error while fetching user", error);
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching User details", error);
      setLoading(false)
    }
  }

  function handleToChat(id) {
    setOptions('chats')
    navigate(`/student-profile/${id}`)
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userType"))
    if (!user || user !== 'Student') {
      navigate('/')
    }
    fetchUserDetails()
  }, [])

  return (
    <>
      {
        logoutPopUp && <LogoutDialog handleClose={handleClose} handleLogout={handleLogout} />

      }
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col py-5 px-3'>
        <div className='w-full h-auto flex flex-col gap-3 md:flex-row lg:gap-10'>
          <div className='w-full h-auto flex justify-end md:w-[40vw]'>
            <div className='w-full h-auto flex flex-col font-cg-times md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]'>
              <div className='w-full h-auto flex flex-col justify-center items-center md:flex-row md:justify-start md:px-2 md:gap-3'>
                <div className='w-full h-auto flex justify-center items-center md:w-auto'><img src={userDetails.profilePicture} referrerPolicy="no-referrer" alt="profile picture" className='w-14 h-14 rounded-full md:w-16 md:h-16 border-[1px]' /></div>
                <div className='w-full h-auto flex flex-col justify-center items-center md:w-auto md:items-start'>
                  <span className='mt-1 md:text-lg'>{userDetails.firstName} {userDetails.lastName}</span>
                  <span className='text-xs text-gray-600 md:text-sm'>{userDetails.username}</span>
                </div>
              </div>
              <div className='w-full h-auto hidden md:flex md:flex-col font-cg-times'>
                <div className='w-full h-[1px] bg-gray-600 mt-8'></div>
                <div onClick={() => setOptions('accountInformation')} className={`${options === 'accountInformation' ? 'bg-blue-100 text-blue-500' : 'text-black bg-gray-100'} w-full h-auto mt-5 flex gap-5 py-2 items-center px-2 rounded-md cursor-pointer hover:md:bg-blue-100 hover:md:text-blue-500`} ><FaUser size={20} /> Account Information</div>
                <div onClick={() => setOptions('sessionManagement')} className={`${options === 'sessionManagement' ? 'bg-blue-100 text-blue-500' : 'text-black bg-gray-100'} w-full h-auto my-3 flex gap-5 py-2 items-center px-2 rounded-md cursor-pointer hover:md:bg-blue-100 hover:md:text-blue-500`}><MdManageSearch size={20} /> Session Management</div>
                <div onClick={() => setOptions('chats')} className={`${options === 'chats' ? 'bg-blue-100 text-blue-500' : 'text-black bg-gray-100'} w-full h-auto mb-3 flex gap-5 py-2 items-center px-2 rounded-md cursor-pointer hover:md:bg-blue-100 hover:md:text-blue-500`}><BsChatSquareTextFill size={20} /> Chats</div>
                <div onClick={() => setOptions('completedSessions')} className={`${options === 'completedSessions' ? 'bg-blue-100 text-blue-500' : 'text-black bg-gray-100'} w-full h-auto flex gap-5 py-2 items-center px-2 rounded-md cursor-pointer hover:md:bg-blue-100 hover:md:text-blue-500`}><GrCompliance size={20} /> Compeleted Sessions</div>
                <div onClick={() => setLogoutPopUp(true)} className='w-full h-auto my-3 text-black bg-gray-100 flex gap-5 py-2 items-center px-2 rounded-md cursor-pointer md:hover:bg-red-100 md:hover:text-red-500'><IoIosLogOut size={20} /> Logout</div>
              </div>
            </div>
          </div>
          <AllTabs data={userDetails} options={options} handleToChat={handleToChat} />
          {
            options === 'chats' && id && <div className='hidden xl:flex xl:w-[40vw] xl:h-[80vh] xl:pt-10'>
              <ChatSingle />
            </div>
          }

          <div className='w-full h-auto flex flex-col gap-3 md:hidden'>
            <SessionManagement />
            <Chats />
            <CompletedSessions />
          </div>
          <div className='w-full h-auto flex justify-center items-center md:hidden'>
            <div onClick={() => setLogoutPopUp(true)} className='w-auto h-auto my-3 text-black bg-gray-100 flex gap-3 py-2 items-center px-7 rounded-md cursor-pointer active:bg-red-100 active:text-red-500 md:hover:bg-red-100 md:hover:text-red-500'><IoIosLogOut size={20} /> Logout</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentProfile