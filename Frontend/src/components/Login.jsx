import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Logo from './images/logo.png';
import { FaBars, FaArrowLeftLong } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router-dom';
import LoginForm from './utils/LoginForm';
import sliderImage1 from './images/loginSignupPageImages/slider1.jpg';
import sliderImage2 from './images/loginSignupPageImages/slider2.jpg';
import sliderImage3 from './images/loginSignupPageImages/slider3.jpg';
import Authentication from './utils/Authentication';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorPopup from './utils/ErrorPopUp';


const images = [sliderImage1, sliderImage2, sliderImage3];

function Login() {
  const [activeContainer, setActiveContainer] = useState('student');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false)
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()


  const handleButtonClick = (container) => {
    setActiveContainer(container);
    setLoginDetails({ email: '', password: '' });
  };

  const handleBulletClick = (index) => setCurrentIndex(index);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  async function loginStudent() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/students/login", loginDetails)
      console.log(response.data.data);
      setLoading(false)
      // Redirect to student dashboard
      navigate('/') // remove this when dashboard is made
      setLoginDetails({
        email: '',
        password: ''
      })
    } catch (error) {
      console.error('Error logging in student:', error);
      setLoading(false)
      setErrorMsg(error.response.data.message)
      setErrorPopUp(true)
      setLoginDetails({
        email: '',
        password: ''
      })
    }
  }

  async function loginMentor() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/mentors/login", loginDetails)
      console.log(response.data.data);
      setLoading(false)
      // Redirect to mentor dashboard
      navigate('/') // remove this when dashboard is made
      setLoginDetails({
        email: '',
        password: ''
      })
    } catch (error) {
      console.error('Error logging in mentor:', error);
      setLoading(false)
      setErrorMsg(error.response.data.message)
      setErrorPopUp(true)
      setLoginDetails({
        email: '',
        password: ''
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sliderContent = useMemo(() => (
    images.map((image, index) => (
      <img src={image} key={index} alt={`Slide ${index + 1}`} className="w-full h-auto min-w-full object-contain" />
    ))
  ), [images]);

  return (
    <>
      {
        loading && (<Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>)
      }
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" />
        <div className='md:hidden'><FaBars size={30} /></div>
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times xl:hidden'>
          <h1 className='text-[#0092DB] text-3xl font-bold'>Welcome Back</h1>
          <p className='text-lg'>Some words will come here</p>
        </div>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Image slider */}
          <div className='hidden xl:flex xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden'>
            <div className="relative w-full mx-auto overflow-hidden flex items-center justify-center">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {sliderContent}
              </div>
              <div className='absolute left-5 bottom-24 flex flex-col gap-1 font-cg-times text-white'>
                <span className='text-6xl'>Welcome Back</span>
                <span className='text-3xl'>Something will come here</span>
              </div>
              <NavLink to="/" className='absolute top-5 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                <FaArrowLeftLong /> Back to Homepage
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
          {/* Main form */}
          <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex justify-center items-center text-2xl font-cg-times font-bold'>LOGIN</div>
            <div className='w-auto h-auto flex font-cg-times text-sm mt-5'>
              <p onClick={() => handleButtonClick('student')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Student</p>
              <p onClick={() => handleButtonClick('mentor')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Mentor</p>
            </div>
            <div className={`${activeContainer === 'student' ? 'translate-x-0' : 'translate-x-[50%]'} w-auto h-auto flex transition duration-300`}>
              <p className='w-[50%] h-[2px] bg-[#0092DB]'></p>
            </div>
            <div className='relative w-full h-[65vh] overflow-hidden'>
              {/* Student login */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out ${activeContainer === 'student' ? 'translate-x-0' : '-translate-x-full'}`}>
                <Authentication />
                <LoginForm
                  label="Student"
                  onChangeEvent={handleChange}
                  value1={loginDetails.email}
                  value2={loginDetails.password}
                  loginEvent={loginStudent}
                />
              </div>
              {/* Mentor login */}
              <div className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-300 ease-in-out mb-20 ${activeContainer === 'mentor' ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='w-full h-auto my-10 flex justify-center items-center font-cg-times text-[#0092DB] font-semibold'>
                  Only Verified mentors can login
                </div>
                <LoginForm
                  label="Mentor"
                  onChangeEvent={handleChange}
                  value1={loginDetails.email}
                  value2={loginDetails.password}
                  loginEvent={loginMentor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
