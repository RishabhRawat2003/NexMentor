import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { CiMail } from "react-icons/ci";

function Footer() {
  return (
    <div className='w-full h-auto pt-10 flex flex-col bg-[#0092DB] font-cg-times'>
      <div className='w-full h-auto flex flex-col gap-5 sm:flex-row'>
        <div className='w-full h-auto flex flex-col text-white'>
          <p className='font-semibold text-center sm:text-lg md:text-xl lg:text-2xl md:tracking-wider'>Join our newsletter and get offers</p>
          <p className='text-center sm:text-lg md:text-xl lg:text-2xl md:tracking-wider'>Sign up our newsletter</p>
        </div>
        <div className='w-full h-auto flex justify-center items-center sm:justify-start'>
          <input type="text" placeholder='Enter your Email' className='w-[50%] p-2 outline-none' />
          <button className='text-white bg-black p-2 px-4'>Subscribe</button>
        </div>
      </div>
      <div className='w-full h-auto flex flex-col mt-4 gap-6 sm:gap-8 md:flex-row sm:mt-10 md:px-6 lg:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center text-white md:justify-start md:items-start'>
          <h2 className='text-lg font-semibold sm:text-sm lg:text-lg xl:text-xl'>ABOUT US</h2>
          <p className='text-center text-sm mt-4 md:text-start xl:text-base'>At NexMentor, we believe success in NEET goes beyond quality study material—it requires the right mentorship to turn knowledge into results. While online coaching offers great content, it often misses the personalized guidance needed to enhance a student’s preparation and confidence.</p>
          <div className='w-full h-auto mt-7 flex items-center justify-center gap-5 md:justify-start'>
            <NavLink to='https://www.instagram.com/nexmentor.in/?utm_source=ig_web_button_share_sheet' target='_blank'><FaInstagram size={25} /></NavLink>
            <NavLink to='https://www.linkedin.com/company/nexmentor' target='_blank'><MdFacebook size={25} /></NavLink>
            <NavLink to='https://www.linkedin.com/company/nexmentor' target='_blank'><FaLinkedin size={25} /></NavLink>
            <NavLink to='https://www.linkedin.com/company/nexmentor' target='_blank'><FaYoutube size={25} /></NavLink>
          </div>
        </div>
        <div className='w-full h-auto flex justify-between px-3 sm:gap-20 sm:justify-center'>
          <div className='w-auto h-auto flex flex-col text-white'>
            <h2 className='font-semibold text-sm lg:text-lg xl:text-xl'>INFORMATION</h2>
            <NavLink to='/became-mentor' className='text-xs mt-3 my-1 md:mt-6 xl:mt-8 md:text-sm xl:text-base md:hover:text-gray-300'>Mentors</NavLink>
            <NavLink to='/refund-policy' className='text-xs my-1 md:text-sm xl:text-base md:hover:text-gray-300'>Refund Policy</NavLink>
            <NavLink to='/privacy-policy' className='text-xs my-1 md:text-sm xl:text-base md:hover:text-gray-300'>Privacy Policy</NavLink>
            <NavLink to='/about-us' className='text-xs my-1 md:text-sm xl:text-base md:hover:text-gray-300'>About Us</NavLink>
            <NavLink to='/terms-condition' className='text-xs my-1 md:text-sm xl:text-base md:hover:text-gray-300'>Terms & Conditions</NavLink>
            <NavLink to='/contact-us' className='text-xs my-1 md:text-sm xl:text-base md:hover:text-gray-300'>Contant Us</NavLink>
          </div>
          <div className='w-auto h-auto flex flex-col text-white'>
            <h2 className='font-semibold text-sm lg:text-lg xl:text-xl'>SERVICES</h2>
            <span className='text-xs mt-3 my-1 xl:mt-8 md:text-sm xl:text-base'>One-on-One Mentorship</span>
            <span className='text-xs my-1 md:text-sm xl:text-base'>Subject specific topic review</span>
            <span className='text-xs my-1 md:text-sm xl:text-base'>Focused Revision Sessions</span>
            <span className='text-xs my-1 md:text-sm xl:text-base'>Progress Tracking</span>
            <span className='text-xs my-1 md:text-sm xl:text-base'>Interactive Q/A</span>
          </div>
        </div>
        <div className='w-full h-auto flex flex-col justify-center items-center text-white md:justify-start md:items-start'>
          <h2 className='text-lg font-semibold lg:text-lg xl:text-xl'>CONTACT US</h2>
          <div className='w-f h-auto flex flex-col gap-4 mt-4'>
            <p className='text-center text-sm md:text-start md:text-base xl:text-lg'>If you have any query, please contact us info@nexmentor.com </p>
            <p className='text-sm flex items-center justify-center gap-2 md:justify-start xl:text-base'><FaLocationDot size={20} /> NEXMENTOR HQ Baramulla, Jammu & Kashmir, India</p>
            <p className='text-sm flex items-center justify-center gap-2 md:justify-start xl:text-base'><CiMail size={20} /> support@nexmentor.com</p>
            <p className='text-sm flex items-center justify-center gap-2 md:justify-start xl:text-base'><FaPhoneAlt size={20} /> +91 91039 02768</p>
          </div>
        </div>
      </div>
      <div className='w-full h-[1px] bg-gray-200 mt-10'></div>
      <div className='w-full h-20 text-white xl:text-lg flex justify-center items-center'>
        © Copyright 2025.All Right Reserved
      </div>
    </div>
  )
}

export default Footer