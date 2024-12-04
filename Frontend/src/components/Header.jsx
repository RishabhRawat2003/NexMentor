import React, { useEffect, useState, useRef } from 'react';
import Logo from './images/logo2.webp';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdNotificationsOutline } from "react-icons/io";
import Loading from './utils/Loading';
import { FaBarsStaggered } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';


// Debounce utility function to prevent excessive scrolling events
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

function Header() {
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [mentorDropdown, setMentorDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropDown, setDropDown] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [notifcationsDropDown, setNotificationsDropDown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const dropDownRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const updateKey = useSelector((state) => state.header.updateKey);


  // Fetch user details asynchronously
  const fetchUser = async () => {
    try {
      const userType = JSON.parse(localStorage.getItem("userType"));
      let url = userType === 'Student' ? "/api/v1/students/student-details" : userType === 'Mentor' ? "/api/v1/mentors/mentor-details" : "/api/v1/students/student-details";
      const response = await axios.post(url);
      setNotifications(response.data.data.notifications.reverse())
      setLoading(false);
      setUser(response.data.data);
    } catch (error) {
      console.log("Error while fetching user", error);
      setLoading(false);
      localStorage.removeItem("userId")
      localStorage.removeItem("userType")
    }
  };

  function handleNotifications() {
    setNotificationsDropDown(!notifcationsDropDown)
    readNotifications()
  }

  async function readNotifications() {
    try {
      const response = await axios.post("/api/v1/students/read-notifications");
    } catch (error) {
      console.log("Error while reading notifications", error);
    }
  }

  // Navigation handler for user profile
  const handleNavigate = () => {
    if (window.innerWidth <= 768) {
      setDropDown(!dropDown);
    } else {
      navigate("/student-profile");
    }
  };

  // Initialize user data fetching on mount
  useEffect(() => {
    fetchUser();
  }, [updateKey]);

  // Click outside event listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((dropDownRef.current && !dropDownRef.current.contains(event.target)) &&
        (imageRef.current && !imageRef.current.contains(event.target))) {
        setDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll event handler with debounce
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > scroll || dropDown || notifcationsDropDown) {
        setDropDown(false); // Hide dropdown when scrolling down
        setNotificationsDropDown(false)
      }
      setScroll(currentScroll);
    };

    const debouncedHandleScroll = debounce(handleScroll, 150);
    window.addEventListener('scroll', debouncedHandleScroll);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [scroll, dropDown]);

  return (
    <>
      {loading ? <Loading /> : (
        <header className="w-full h-14 flex justify-between items-center px-5 sm:h-20 md:px-2 lg:px-6 bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(0,_146,_219,_0.39)_0%,_rgba(255,_255,_255,_0)_100%)]">
          <NavLink to='/' className="w-40 sm:w-48 md:w-52 xl:w-96"><img src={Logo} alt="Logo" className='w-full' /></NavLink>
          <div className="hidden md:w-full lg:px-10 xl:px-20 2xl:px-60 md:h-auto md:flex md:font-cg-times md:text-sm lg:gap-2 lg:text-base md:tracking-wide font-semibold md:items-center">
            <NavLink to="/" className='text-black w-full h-auto cursor-pointer text-center'>Home</NavLink>
            <div onClick={() => { setStudentDropdown(!studentDropdown); setMentorDropdown(false); setResourcesDropdown(false) }} className="relative w-full h-auto cursor-pointer text-center flex items-center lg:gap-2 xl:gap-4">
              <span>For Students</span>
              <FaChevronDown
                size={15}
                className={`${studentDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
              />
              {studentDropdown && (
                <div className="absolute top-full left-[-50px] mt-2 bg-white shadow-lg rounded-md w-[200px] py-4 z-50">
                  <NavLink to='/search-mentor' className="block px-2 py-2 text-black hover:bg-gray-200">Find a Mentor</NavLink>
                  <NavLink to='/webinar-page' className="block px-2 py-2 text-black hover:bg-gray-200">Webinars</NavLink>
                  <NavLink to='/how-it-works' className="block px-2 py-2 text-black hover:bg-gray-200">How it Works</NavLink>
                  <NavLink to='/faq-students' className="block px-2 py-2 text-black hover:bg-gray-200">FAQ's</NavLink>
                </div>
              )}
            </div>
            <div onClick={() => { setMentorDropdown(!mentorDropdown); setResourcesDropdown(false); setStudentDropdown(false) }} className="relative w-full h-auto cursor-pointer text-center flex items-center lg:gap-2 xl:gap-4">
              <span>For Mentors</span>
              <FaChevronDown
                size={15}
                className={`${mentorDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
              />
              {mentorDropdown && (
                <div className="absolute top-full left-[-50px] mt-2 bg-white shadow-lg rounded-md w-[200px] py-4 z-50">
                  <NavLink to='/became-mentor' className="block px-2 py-2 text-black hover:bg-gray-200">Became a Mentor</NavLink>
                  <NavLink to='/why-choose-us' className="block px-2 py-2 text-black hover:bg-gray-200">Why Choose Us?</NavLink>
                  <NavLink to='/faq-mentors' className="block px-2 py-2 text-black hover:bg-gray-200">FAQ's</NavLink>
                </div>
              )}
            </div>
            <div onClick={() => { setResourcesDropdown(!resourcesDropdown); setStudentDropdown(false); setMentorDropdown(false) }} className="relative w-full h-auto cursor-pointer text-center flex items-center lg:gap-2 xl:gap-4">
              <span>Resources</span>
              <FaChevronDown
                size={15}
                className={`${resourcesDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
              />
              {resourcesDropdown && (
                <div className="absolute top-full left-[-50px] mt-2 bg-white shadow-lg rounded-md w-[200px] py-4 z-50">
                  <NavLink to='/about-us' className="block px-2 py-2 text-black hover:bg-gray-200">About Us</NavLink>
                  <NavLink to='/blogs-page' className="block px-2 py-2 text-black hover:bg-gray-200">Blogs</NavLink>
                  <NavLink to='/privacy-policy' className="block px-2 py-2 text-black hover:bg-gray-200">Privacy Policy</NavLink>
                  <NavLink to='/terms-condition' className="block px-2 py-2 text-black hover:bg-gray-200">Terms and Conditions</NavLink>
                  <NavLink to='/refund-policy' className="block px-2 py-2 text-black hover:bg-gray-200">Refund Policy</NavLink>
                  <NavLink to='/contact-us' className="block px-2 py-2 text-black hover:bg-gray-200">Contact Us</NavLink>
                </div>
              )}
            </div>
          </div>
          {
            user && user.username && user.username.length
              ? <div className="w-auto h-auto flex justify-between items-center gap-5 lg:gap-6 flex-shrink-0">
                <IoMdNotificationsOutline onClick={handleNotifications} size={20} className='text-[#0092DB] sm:size-7 cursor-pointer' />
                {
                  notifcationsDropDown && (
                    <div className='disable-scrollbar w-80 h-auto min-h-[70vh] max-h-96 overflow-y-scroll p-5 border shadow-custom absolute top-14 rounded-lg right-3 bg-gray-100 sm:top-16 lg:top-20 z-50'>
                      {
                        notifications?.map((item, index) => (
                          <p key={index} className='text-sm md:text-base font-cg-times border-b-2 py-4 '>
                            {item.message}
                          </p>
                        ))
                      }
                    </div>
                  )
                }
                <div onClick={handleNavigate} className="w-auto h-auto rounded-full border-[1px] border-[#0092DB] cursor-pointer md:hover:shadow-sm md:hover:shadow-[#0092db89]">
                  <img ref={imageRef} src={user.profilePicture} referrerPolicy="no-referrer" alt="profile image" className="w-8 h-8 rounded-full object-cover sm:w-9 sm:h-9 lg:w-11 lg:h-11 2xl:h-12 2xl:w-12" />
                </div>
              </div>
              : <div>
                {dropDown ? <IoClose onClick={() => setDropDown(!dropDown)} size={25} className="md:hidden" /> : <FaBarsStaggered onClick={() => setDropDown(!dropDown)} size={25} className="md:hidden" />}
                <div className="hidden md:w-automd: h-auto md:flex md:gap-3 md:justify-between md:items-center md:font-cg-times">
                  <NavLink to="signup" className="px-6 py-1.5 bg-[#0092DB] text-white rounded-md md:hover:bg-[#0092dbd5] active:bg-[#0092dbd5] lg:px-8">Signup</NavLink>
                  <NavLink to="login" className="px-2 py-1 md:hover:text-[#0092DB] active:text-[#0092DB] sm:px-3 lg:px-4">Login</NavLink>
                </div>
              </div>
          }
        </header>
      )}

      {/* Sidebar Menu */}
      {dropDown && (
        <div ref={dropDownRef} className="w-48 h-full absolute flex flex-col items-center gap-5 p-5 bg-gray-50 top-14 right-0 md:hidden shadow-xl rounded-md z-20 border-2 font-cg-times sm:top-16 text-lg sm:text-xl">
          <NavLink onClick={() => setDropDown(false)} to="/" className='w-full h-auto'>Home</NavLink>
          {user.username && user.username.length && <NavLink onClick={() => setDropDown(false)} to="/student-profile" className='w-full h-auto'>Profile</NavLink>}
          <span onClick={() => { setStudentDropdown(!studentDropdown); setMentorDropdown(false); setResourcesDropdown(false) }} className="w-full h-auto flex items-center gap-2">For Students <FaChevronDown
            size={15}
            className={`${studentDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
          /></span>
          {
            studentDropdown && (
              <div className='w-full h-auto flex flex-col text-sm'>
                <NavLink onClick={() => setDropDown(false)} to='/search-mentor' className="block px-2 py-2 text-black active:bg-gray-200">Find a Mentor</NavLink>
                <NavLink onClick={() => setDropDown(false)} to='/webinar-page' className="block px-2 py-2 text-black active:bg-gray-200">Webinars</NavLink>
                <NavLink onClick={() => setDropDown(false)} to='/how-it-works' className="block px-2 py-2 text-black active:bg-gray-200">How it Works</NavLink>
                <NavLink onClick={() => setDropDown(false)} to='/faq-students' className="block px-2 py-2 text-black active:bg-gray-200">FAQ's</NavLink>
              </div>
            )
          }
          <span onClick={() => { setMentorDropdown(!mentorDropdown); setResourcesDropdown(false); setStudentDropdown(false) }} className="w-full h-auto flex items-center gap-2">For Mentors <FaChevronDown
            size={15}
            className={`${mentorDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
          /></span>
          {mentorDropdown && (
            <div className="w-full h-auto flex flex-col text-sm">
              <NavLink onClick={() => setDropDown(false)} to='/became-mentor' className="block px-2 py-2 text-black active:bg-gray-200">Became a Mentor</NavLink>
              <NavLink onClick={() => setDropDown(false)} to='/why-choose-us' className="block px-2 py-2 text-black active:bg-gray-200">Why Choose Us?</NavLink>
              <NavLink to='/faq-mentors' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">FAQ's</NavLink>
            </div>
          )}
          <span onClick={() => { setResourcesDropdown(!resourcesDropdown); setStudentDropdown(false); setMentorDropdown(false) }} className="w-full h-auto flex items-center gap-2">Resources <FaChevronDown
            size={15}
            className={`${resourcesDropdown ? 'rotate-180' : ''} duration-200 transition-all ease-in-out`}
          /></span>
          {resourcesDropdown && (
            <div className="w-full h-auto flex flex-col text-sm">
              <NavLink to='/about-us' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">About Us</NavLink>
              <NavLink to='/blogs-page' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">Blogs</NavLink>
              <NavLink to='/privacy-policy' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">Privacy Policy</NavLink>
              <NavLink to='/terms-condition' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">Terms and Conditions</NavLink>
              <NavLink to='/refund-policy' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">Refund Policy</NavLink>
              <NavLink to='/contact-us' onClick={() => setDropDown(false)} className="block px-2 py-2 text-black active:bg-gray-200">Contact Us</NavLink>
            </div>
          )}
          {!user.username && <div className="w-auto h-auto flex gap-3 justify-center items-center font-cg-times">
            <NavLink to="signup" className="px-3 py-1 bg-[#0092DB] text-white rounded-md active:bg-[#0092dbd5] sm:px-5">Signup</NavLink>
            <NavLink to="login" className="px-2 py-1 active:text-[#0092DB] sm:px-3 lg:px-4">Login</NavLink>
          </div>}
        </div>
      )}
    </>
  );
}

export default Header;
