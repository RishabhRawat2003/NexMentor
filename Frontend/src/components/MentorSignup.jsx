import React, { useState } from 'react'
import Logo from './images/logo.png'
import { FaBars } from "react-icons/fa6";
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import SideImage from './images/loginSignupPageImages/academics.png'
import Logo2 from './images/loginSignupPageImages/logoSideImage.png'
import { TbUserUp } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";

function MentorSignup() {
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('')
  const [neetAttempt, setNeetAttempt] = useState('')


  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  const handleChangeAttempt = (event) => {
    setNeetAttempt(event.target.value);
  };

  async function handlePayment() {
    try {
      console.log("Hello");
    } catch (error) {
      console.log("Error while making payment !!", error);

    }
  }

  return (
    <>
      <header className='w-full h-auto flex justify-between items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" />
        <div className='md:hidden'><FaBars size={30} /></div>
      </header>
      <div className='w-full h-auto mb-10 flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-10'>
        <div className='w-full h-auto xl:flex xl:items-center xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Side Image start here */}
          <div className='hidden xl:relative xl:z-30 xl:flex xl:flex-col xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[90vh] xl:rounded-xl xl:overflow-hidden'>
            <img src={SideImage} alt="Mentorship Logo" className="w-full h-full object-cover" />
            <NavLink to="/" className='absolute top-5 z-20 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
              <FaArrowLeftLong />Back to Homepage
            </NavLink>
            <img src={Logo2} alt="Logo" className='absolute z-20 w-80 top-28 left-12' />
            <div className='absolute w-full h-auto flex bottom-24 left-12 z-20'>
              <div className='w-20 h-auto flex flex-col items-center'>
                <span className='w-10 h-10 border-[1px] border-white rounded-full flex justify-center items-center'><TbUserUp size={25} color='white' /></span>
                <div className="border-l-2 border-dotted border-gray-400 h-28"></div>
                <span className='w-10 h-10 border-[1px] border-white rounded-full flex justify-center items-center'><MdLockOutline size={25} color='white' /></span>
                <div className="border-l-2 border-dotted border-gray-400 h-28"></div>
                <span className='w-10 h-10 border-[1px] border-white rounded-full flex justify-center items-center'><FaUserCheck size={25} color='white' /></span>
              </div>
              <div className='w-auto h-auto flex flex-col pl-5 pr-20 justify-between text-white'>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium odio nobis recusandae sit ipsam. Consequatur, molestias ut. Saepe iure ex voluptatum provident nisi nemo veniam, reprehenderit nostrum, ipsa quo eum.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium odio nobis recusandae sit ipsam. Consequatur, molestias ut. Saepe iure ex voluptatum provident nisi nemo veniam, reprehenderit nostrum, ipsa quo eum.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium odio nobis recusandae sit ipsam. Consequatur, molestias ut. Saepe iure ex voluptatum provident nisi nemo veniam, reprehenderit nostrum, ipsa quo eum.</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,146,219,0.8)] to-[rgba(0,23,35,0.8)]"></div>
          </div>

          {/* main form start here */}
          <div className='w-auto h-auto flex flex-col mt-10 mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times'>
              <h1 className='text-2xl font-bold md:text-3xl'>ACADEMICS DETAILS</h1>
              <p className='text-lg text-[#FF0000] font-semibold md:text-xl'>Only For MBBS Students</p>
            </div>
            <div className='w-full h-auto'>
              <div className='w-full h-auto flex justify-between mt-5 mb-3'>
                <TextField
                  label="Neet Score"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
                <TextField
                  label="Neet Exam Year"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
              </div>
              <FormControl fullWidth>
                <Select
                  value={city}
                  onChange={handleChangeCity}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === "") {
                      return <em>Year of Education</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="">
                    <em>Select a Year</em> {/* Placeholder text */}
                  </MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                </Select>
              </FormControl>
              <div className='w-full h-auto flex justify-between mt-3'>
                <TextField
                  label="Institue"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
                <TextField
                  label="Number"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
              </div>
              <div className='w-full h-auto flex justify-between'>
                <TextField
                  label="Neet Score Card"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
                <TextField
                  label="College ID"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                />
              </div>
              <div className='w-full h-auto flex justify-between my-3 mb-5'>
                <FormControl className='w-[48%]'>
                  <Select
                    value={gender}
                    onChange={handleChangeGender}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "") {
                        return <em>Gender</em>;
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a Gender</em> {/* Placeholder text */}
                    </MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className='w-[48%]'>
                  <Select
                    value={neetAttempt}
                    onChange={handleChangeAttempt}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === "") {
                        return <em>NEET Attempt</em>;
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Attempt</em> {/* Placeholder text */}
                    </MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <TextField
                label="Statement of Purpose"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
              <div onClick={handlePayment} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
                Continue and Pay ₹149
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentorSignup