import React, { useState } from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import { NavLink } from 'react-router-dom'
import ErrorPopup from '../utils/ErrorPopUp';
import Loading from '../utils/Loading';
import axios from 'axios';

function AdminChangePassword() {

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [errorPopup, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsgPopUp, setSuccessMsgPopUp] = useState(false)
  const [localSidebarState, setLocalSidebarState] = useState(false)

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function changePassword() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/change-password", passwords)
      if (response.data.statusCode === 200) {
        setLoading(false)
        setSuccessMsgPopUp(true)
        setPasswords({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setSuccessMsgPopUp(false)
        }, 4000);
      }
    } catch (error) {
      console.log("Error While changing password", error);
      setLoading(false)
      setErrorMsg(error?.response?.data?.message)
      setErrorPopUp(true)
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  return (
    <>
      {
        loading && <Loading />
      }
      <ErrorPopup open={errorPopup} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <div className='w-full h-screen lg:h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-full flex-col px-5 py-10 font-cg-times flex-grow mx-auto sm:w-[55%] md:w-[45%] xl:w-[35%] `}>
          <h1 className='text-center text-3xl font-semibold'>Change Password</h1>
          <p className='text-center mt-5'>Enter Your Old Password to create a New Password.</p>
          <div className='w-full h-auto flex flex-col md:mt-9'>
            <TextField
              label="Current Password"
              variant="outlined"
              margin="normal"
              fullWidth
              type='password'
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
            <TextField
              label="New Password"
              variant="outlined"
              margin="normal"
              fullWidth
              type='password'
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              fullWidth
              type='password'
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
          </div>
          <div onClick={changePassword} className='w-full h-auto flex flex-col bg-blue-500 text-white justify-center items-center py-2 mt-6 rounded-md cursor-pointer'>
            Change Password
          </div>
          {
            successMsgPopUp && <p className='text-green-500 font-semibold font-cg-times text-center mt-3'>Password Changed Successfully</p>
          }
        </div>
      </div>
    </>
  )
}

export default AdminChangePassword