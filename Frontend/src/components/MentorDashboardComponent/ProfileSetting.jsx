import React, { useState } from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem } from '@mui/material';

function ProfileSetting() {
  const [localSidebarState, setLocalSidebarState] = useState(false)

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }
  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex'} w-full h-auto px-5 flex-col-reverse gap-3 py-10 lg:flex-row `}>
        <div className='w-full h-auto flex flex-col lg:w-[60%] xl:w-[70%]'>
          <div className='w-full h-auto flex justify-between items-center'>
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
          <div className='w-full h-auto flex flex-col justify-between items-center sm:flex-row'>
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              className='w-full sm:w-[48%]'
            />
            <TextField
              label="Number"
              variant="outlined"
              margin="normal"
              className='w-full sm:w-[48%]'
            />
          </div>
          <div className='w-full h-auto flex justify-between items-center'>
            <TextField
              label="City"
              variant="outlined"
              margin="normal"
              className='w-[48%]'
            />
            <TextField
              label="State"
              variant="outlined"
              margin="normal"
              className='w-[48%]'
            />
          </div>
          <div className='w-full h-auto flex justify-between items-center mb-3'>
            <TextField
              variant="outlined"
              margin="normal"
              className='w-[48%]'
              value='99'
              disabled
            />
            <TextField
              variant="outlined"
              margin="normal"
              className='w-[48%]'
              value='99'
              disabled
            />
          </div>
          <div className='w-full h-auto flex justify-between items-center mb-3'>
            <FormControl className='w-[48%]'>
              <Select
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
                <MenuItem value="1st year">1st year</MenuItem>
                <MenuItem value="2nd year">2nd year</MenuItem>
                <MenuItem value="3rd year">3rd year</MenuItem>
                <MenuItem value="4th year">4th year</MenuItem>
                <MenuItem value="Final Year">Final Year</MenuItem>
              </Select>
            </FormControl>
            <FormControl className='w-[48%]'>
              <Select
                displayEmpty
                renderValue={(selected) => {
                  if (selected === "") {
                    return <em>Gender</em>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="">
                  <em>Select a Gender</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
          </div>
          <textarea name="about" placeholder='Write about yourself here' className='min-h-40 p-2 bg-[#F4F4F4] border-[1px] border-gray-400 resize-none'></textarea>
        </div>
        <div className='w-full h-auto flex justify-center items-center lg:w-[40%] lg:items-start lg:pt-10 xl:w-[30%]'>
          <div className='w-[90%] h-auto flex flex-col gap-3 lg:border-[1px] rounded-lg lg:border-gray-300 lg:py-10 lg:shadow-custom lg:gap-6'>
            <div className='hidden lg:block text-center font-cg-times text-xl font-semibold'>Change Profile Image</div>
            <img src="" alt="" className='w-40 bg-gray-400 h-40 mx-auto rounded-full' />
            <div className='w-full h-auto flex justify-center items-center'>
              <span className='px-5 py-1.5 bg-blue-500 text-white font-cg-times rounded-md text-sm cursor-pointer'>Upload Image</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${localSidebarState ? 'hidden' : 'flex'} w-full h-auto flex justify-center items-center pb-10 lg:justify-start px-5`}>
        <span className='text-white bg-blue-500 font-cg-times text-lg px-6 py-2 rounded-md cursor-pointer font-semibold'>Save Changes</span>
      </div>
    </div>
  )
}

export default ProfileSetting