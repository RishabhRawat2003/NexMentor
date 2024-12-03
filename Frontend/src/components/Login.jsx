import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Logo from './images/logo2.webp';
import { useNavigate } from 'react-router-dom';
import LoginForm from './utils/LoginForm';
import Authentication from './utils/Authentication';
import ErrorPopup from './utils/ErrorPopUp';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginParam } from './store/ParamsSlice';
import Loading from './utils/Loading';
import Slider from './utils/Slider';


function Login() {
  const [activeContainer, setActiveContainer] = useState('student');
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false)
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const loginParam = useSelector((state) => state.data.loginParam);

  const handleButtonClick = (container) => {
    setActiveContainer(container);
    setLoginDetails({ email: '', password: '' });
    dispatch(setLoginParam(container));
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  async function loginUser(url) {
    setLoading(true);
    try {
      const response = await axios.post(url, loginDetails);
      setLoading(false);
      if (activeContainer === "student") {
        localStorage.setItem("userType", JSON.stringify("Student"))
        localStorage.setItem("userId", JSON.stringify(response.data.data))
        navigate('/search-mentor');
      } else {
        localStorage.setItem("userType", JSON.stringify("Mentor"))
        localStorage.setItem("userId", JSON.stringify(response.data.data))
        navigate('/mentor-dashboard')
      }
      setLoginDetails({ email: '', password: '' });
    } catch (error) {
      console.error(`Error logging in ${activeContainer}:`, error);
      setLoading(false);
      setErrorMsg(error.response?.data?.message || 'An error occurred');
      setErrorPopUp(true);
      setLoginDetails({ email: '', password: '' });
    }
  }

  const loginStudent = () => loginUser("/api/v1/students/login");
  const loginMentor = () => loginUser("/api/v1/mentors/login");

  useEffect(() => {
    if (loginParam.length > 1) {
      setActiveContainer(loginParam)
    }
  }, []);


  return (
    <>
      {
        loading && (<Loading />)
      }
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <header className='w-full h-auto flex items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" className='w-40 sm:w-52 md:w-60' />
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times xl:hidden'>
          <h1 className='text-[#0092DB] text-3xl font-bold'>Welcome Back</h1>
          <p className='text-lg'>Some words will come here</p>
        </div>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Image slider */}
          <Slider />
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
