import React, { useEffect, useState, useRef } from 'react';
import Logo from './images/logo2.png';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdNotificationsOutline } from "react-icons/io";
import Loading from './utils/Loading';
import { FaBarsStaggered } from "react-icons/fa6";

function Header() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropDown, setDropDown] = useState(false);
  const [scroll, setScroll] = useState(0)
  const dropDownRef = useRef(null);
  const imageRef = useRef(null)
  const navigate = useNavigate()

  async function fetchUser() {
    try {
      const userType = JSON.parse(localStorage.getItem("userType"));
      let url = userType === 'Student' ? "/api/v1/students/student-details" : "/api/v1/mentors/mentor-details";
      const response = await axios.post(url);
      setLoading(false);
      setUser(response.data.data);
    } catch (error) {
      console.log("Error while fetching user", error);
      setLoading(false);
    }
  }

  function handleNavigate() {
    if (window.innerWidth <= 768) {
      setDropDown(!dropDown)
    } else {
      navigate("/student-profile")
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target) && !imageRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > scroll && dropDown) {
        setDropDown(false); // Hide dropdown when scrolling down
      }
      setScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scroll, dropDown]);

  return (
    <>
      {
        loading
          ? <Loading />
          : <header className='w-full h-14 flex justify-between items-center px-5 sm:h-20 lg:px-6 bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(0,_146,_219,_0.39)_0%,_rgba(255,_255,_255,_0)_100%)]'>
            <img src={Logo} alt="Logo" className='w-28 sm:w-40 md:w-48 xl:w-56' />
            <div className='hidden md:w-full md:px-10 lg:px-20 xl:px-40 2xl:px-60 md:h-auto md:flex md:font-cg-times md:text-sm lg:text-lg md:tracking-wide font-semibold md:items-center md:gap-2'>
              <NavLink to='/' className={({ isActive }) => `${isActive ? 'text-black' : 'text-[#5C5B5B]'} w-full h-auto cursor-pointer text-center`} >Home</NavLink>
              <NavLink to='/resources' className='w-full h-auto cursor-pointer text-center'>Resources</NavLink>
              <NavLink to='/mentors' className='w-full h-auto cursor-pointer text-center'>For Mentors</NavLink>
              <NavLink to='/students' className='w-full h-auto cursor-pointer text-center'>For Students</NavLink>
            </div>
            {
              user && user.username && user.username.length
                ? <div className='w-auto h-auto flex justify-between items-center gap-5 lg:gap-6 flex-shrink-0'>
                  <IoMdNotificationsOutline size={20} className='text-[#0092DB] sm:size-7 cursor-pointer' />
                  <div onClick={handleNavigate} className='w-auto h-auto rounded-full border-[1px] border-[#0092DB] cursor-pointer md:hover:shadow-sm md:hover:shadow-[#0092db89]'>
                    <img ref={imageRef} src={user.profilePicture} alt="profile image" className='w-8 h-8 rounded-full sm:w-9 sm:h-9 lg:w-11 lg:h-11 2xl:h-12 2xl:w-12' />
                  </div>
                </div>
                : <FaBarsStaggered onClick={() => setDropDown(!dropDown)} size={25} />
            }
          </header>
      }

      {/* Dropdown Menu */}
      {
        dropDown && (
          <div ref={dropDownRef} className='w-48 h-full absolute flex flex-col items-center gap-5 p-5 bg-gray-50 top-14 right-0 md:hidden shadow-xl rounded-md z-20 border-2 font-cg-times sm:top-16 text-lg sm:text-xl'>
            <NavLink onClick={() => setDropDown(false)} to='/' className={({ isActive }) => `${isActive ? 'text-[#0092DB]' : 'text-[#5C5B5B]'} w-full h-auto cursor-pointer text-center`} >Home</NavLink>
            {
              user.username && user.username.length && <NavLink onClick={() => setDropDown(false)} to='/student-profile' className={({ isActive }) => `${isActive ? 'text-[#0092DB]' : 'text-[#5C5B5B]'} w-full h-auto cursor-pointer text-center`}>Profile</NavLink>
            }
            <NavLink onClick={() => setDropDown(false)} to='/resources' className='w-full h-auto cursor-pointer text-center'>Resources</NavLink>
            <NavLink onClick={() => setDropDown(false)} to='/mentors' className='w-full h-auto cursor-pointer text-center'>For Mentors</NavLink>
            <NavLink onClick={() => setDropDown(false)} to='/students' className='w-full h-auto cursor-pointer text-center'>For Students</NavLink>
            {
              !user.username && <div className='w-auto h-auto flex flex-col gap-3 justify-center items-center font-cg-times'>
                <NavLink to='signup' className='px-6 py-2 bg-[#0092DB] text-white rounded-md md:hover:bg-[#0092dbd5] active:bg-[#0092dbd5] sm:px-6 lg:px-8'>Signup</NavLink>
                <NavLink to='login' className='px-2 py-1 md:hover:text-[#0092DB] active:text-[#0092DB] sm:px-3 lg:px-4'>Login</NavLink>
              </div>
            }

          </div>
        )
      }
    </>
  );
}

export default Header;
