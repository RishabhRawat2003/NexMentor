import React, { useEffect, useState } from 'react'
import Logo from './images/logo.png'
import { FaBars } from "react-icons/fa6";
import TextField from '@mui/material/TextField';
import sliderImage1 from './images/loginSignupPageImages/slider1.jpg'
import sliderImage2 from './images/loginSignupPageImages/slider2.jpg'
import sliderImage3 from './images/loginSignupPageImages/slider3.jpg'
import { FaArrowLeftLong } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router-dom';
import Authentication from './utils/Authentication';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import VerifyEmailOTP from './utils/OtpPopUp';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import ErrorPopup from './utils/ErrorPopUp';

function Signup() {
  const [activeContainer, setActiveContainer] = useState('student')
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false)
  const [verifyEmailPopUp, setVerifyEmailPopUp] = useState(false)
  const [accountCreatedPopUp, setAccountCreatedPopUp] = useState(false)
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [createAccount, setCreateAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const images = [sliderImage1, sliderImage2, sliderImage3];
  const navigate = useNavigate()

  const handleClose = async (params) => {
    if (params === true) {
      setAccountCreatedPopUp(true)
    } else {
      try {
        const response = await axios.post("/api/v1/students/delete-student", { email: createAccount.email })
        console.log(response.data.data);
      } catch (error) {
        console.log("error while removing unverified user !!", error);

      }
    }
    setVerifyEmailPopUp(false)
    setCreateAccount({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }


  function handleButtonClick(params) {
    setActiveContainer(params)
  }

  const handleBulletClick = (index) => {
    setCurrentIndex(index);
  };

  async function handleEmailVerify() {
    try {
      navigate('/signup/mentor-signup')
    } catch (error) {
      console.log("Error while verifying email !", error);

    }
  }

  async function verifyEmailStudent() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/students/create-account", createAccount)
      const id = response.data.data
      localStorage.setItem("userId", JSON.stringify(id))
      if (response.data.statusCode === 200) {
        console.log(response.data);
        setLoading(false)
        setVerifyEmailPopUp(true)
      }
    } catch (error) {
      console.log("Error while verifying email !", error);
      setLoading(false)
      setErrorMsg(error.response.data.message)
      setErrorPopUp(true)
    }
  }

  function handleLogin() {
    navigate('/login')
  }

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCreateAccount(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length])


  return (
    <>
      {
        loading && (<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>)
      }
      <VerifyEmailOTP open={verifyEmailPopUp} handleClose={handleClose} email={createAccount.email} />
      {
        accountCreatedPopUp && (<Dialog open={open} onClose={handleClose}>
          <DialogTitle>Account Created</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Your account has been successfully created!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogin} color="primary" variant="contained">
              Login
            </Button>
          </DialogActions>
        </Dialog>)
      }
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" />
        <div className='md:hidden'><FaBars size={30} /></div>
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times xl:hidden'>
          <h1 className='text-[#0092DB] text-3xl font-bold'>Welcome</h1>
          <p className='text-lg'>Somewords will come here </p>
        </div>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Side Image start here */}
          <div className='hidden xl:flex xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden'>
            <div className="relative w-full mx-auto overflow-hidden flex items-center justify-center">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                  <img src={image} key={index} alt={`Slide ${index + 1}`} className="w-full h-auto min-w-full object-contain" />
                ))}
              </div>
              <div className='absolute left-5 bottom-24 flex flex-col gap-1 font-cg-times text-white'>
                <span className='text-6xl'>Welcome</span>
                <span className='text-3xl'>Something will come here</span>
              </div>
              <NavLink to="/" className='absolute top-5 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                <FaArrowLeftLong />Back to Homepage
              </NavLink>
              <div className="absolute flex justify-center mt-2 bottom-5">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`w-14 h-1.5 rounded-full mx-1 cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-gray-300' : 'bg-gray-800'}`}
                    onClick={() => handleBulletClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* main form start here */}
          <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex justify-center items-center text-2xl font-cg-times font-bold'>CREATE NEW ACCOUNT</div>
            <div className='w-auto h-auto flex font-cg-times text-sm mt-5'>
              <p onClick={() => handleButtonClick('student')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Student</p>
              <p onClick={() => handleButtonClick('mentor')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Mentor</p>
            </div>
            <div className={`${activeContainer === 'student' ? 'translate-x-0' : 'translate-x-[50%]'} w-auto h-auto flex transition duration-300`}>
              <p className='w-[50%] h-[2px] bg-[#0092DB]'></p>
            </div>
            <div className='relative w-full h-[90vh] overflow-hidden xl:h-[70vh]'>
              {/* student Signup */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out ${activeContainer === 'student' ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
                <Authentication />
                <div className='w-full h-auto flex flex-col'>
                  <div className='w-full h-auto flex justify-between mt-5'>
                    <TextField
                      label="First Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                      value={createAccount.firstName}
                      name='firstName'
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                      value={createAccount.lastName}
                      name='lastName'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={createAccount.email}
                    name='email'
                    onChange={(e) => handleChange(e)}
                  />
                  <div className='w-full h-auto flex flex-col xl:flex-row xl:justify-between'>
                    <TextField
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                      value={createAccount.password}
                      name='password'
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                      value={createAccount.confirmPassword}
                      name='confirmPassword'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div onClick={verifyEmailStudent} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                    Sign Up
                  </div>
                  <div className='w-full h-auto font-cg-times text-gray-500 text-xs xl:text-sm'>
                    <p className='text-center'>Already Have an Account? Login as <NavLink to="/login" className='text-black font-bold md:hover:text-[#0092DB] cursor-pointer active:text-[#0092DB]'> Student</NavLink> now</p>
                  </div>
                </div>
              </div>
              {/* mentor Signup */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out ${activeContainer === 'mentor' ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
                <div className='w-full h-auto flex flex-col'>
                  <div className='w-full h-auto flex justify-between mt-5'>
                    <TextField
                      label="First Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                    />
                  </div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  <div className='w-full h-auto flex justify-between'>
                    <TextField
                      label="State"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                    />
                    <TextField
                      label="City"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                    />
                  </div>
                  <div className='w-full h-auto flex flex-col xl:flex-row xl:justify-between'>
                    <TextField
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                    />
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                    />
                  </div>
                  <div onClick={handleEmailVerify} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                    Sign Up
                  </div>
                  <div className='w-full h-auto font-cg-times text-gray-500 text-xs xl:text-sm'>
                    <p className='text-center'>Already Have an Account? Login as <NavLink to="/login" className='text-black font-bold md:hover:text-[#0092DB] cursor-pointer active:text-[#0092DB]'> Mentor</NavLink> now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup