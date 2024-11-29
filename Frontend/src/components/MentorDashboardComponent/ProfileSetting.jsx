import React, { useState } from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Loading from '../utils/Loading';
import { IoCloseCircle } from "react-icons/io5";

function ProfileSetting() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [updateDetails, setUpdateDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    gender: '',
    city: '',
    state: '',
    neetScore: '',
    neetExamYear: '',
    yearOfEducation: '',
    about: ''
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  function getData(e) {
    setUpdateDetails({
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      number: e.number,
      gender: e.gender,
      city: e.address.city,
      state: e.address.state,
      neetScore: e.neetScore,
      neetExamYear: e.neetExamYear,
      yearOfEducation: e.yearOfEducation,
      about: e?.about || ''
    })
    setPreviewImage(e.profilePicture)
    setSelectedLanguages(e.languages)
  }

  const indianStatesAndUTs = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands - UT",
    "Chandigarh - UT",
    "Dadra and Nagar Haveli and Daman and Diu - UT",
    "Delhi - UT",
    "Jammu and Kashmir - UT",
    "Ladakh - UT",
    "Lakshadweep - UT",
    "Puducherry - UT"
  ];

  const indianLanguages = [
    "English",
    "Assamese",
    "Bengali",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Kashmiri",
    "Maithili",
    "Malayalam",
    "Manipuri",
    "Marathi",
    "Nepali",
    "Odia",
    "Punjabi",
    "Sanskrit",
    "Sindhi",
    "Tamil",
    "Telugu"
  ];

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function updateMentorDetails() {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('firstName', updateDetails.firstName);
      formData.append('lastName', updateDetails.lastName);
      formData.append('email', updateDetails.email);
      formData.append('number', updateDetails.number);
      formData.append('city', updateDetails.city);
      formData.append('state', updateDetails.state);
      formData.append('yearOfEducation', updateDetails.yearOfEducation);
      formData.append('gender', updateDetails.gender);
      formData.append('about', updateDetails.about);

      if (selectedLanguages.length > 0) {
        selectedLanguages.forEach(language => {
          formData.append('languages[]', language);
        });
      }

      if (selectedImage) formData.append('profilePicture', selectedImage)

      const response = await axios.post("/api/v1/mentors/mentor-update-details", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.statusCode === 200) {
        setLoading(false)
      }

    } catch (error) {
      console.log("Error while updating details", error);
      setLoading(false)
    }
  }

  const handleSelect = (e) => {
    const { value } = e.target;

    if (selectedLanguages.includes(value)) {
      return; // Ignore duplicates
    }

    if (selectedLanguages.length < 3) {
      setSelectedLanguages((prev) => [...prev, value]); // Add new language
    } else {
      alert("You can select up to 3 languages only.");
    }
  };

  const removeLanguage = (language) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang !== language)); // Remove language
  };

  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header getData={getData} handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-full h-auto px-5 flex-col-reverse gap-3 py-10 lg:flex-row `}>
          <div className='w-full h-auto flex flex-col lg:w-[60%] xl:w-[70%]'>
            <div className='w-full h-auto flex justify-between items-center'>
              <TextField
                label="First Name"
                variant="outlined"
                margin="normal"
                className='w-[48%]'
                value={updateDetails.firstName}
                onChange={(e) => setUpdateDetails({ ...updateDetails, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                margin="normal"
                className='w-[48%]'
                value={updateDetails.lastName}
                onChange={(e) => setUpdateDetails({ ...updateDetails, lastName: e.target.value })}
              />
            </div>
            <div className='w-full h-auto flex flex-col justify-between items-center sm:flex-row'>
              <TextField
                label="Email"
                variant="outlined"
                margin="normal"
                className='w-full sm:w-[48%]'
                value={updateDetails.email}
                onChange={(e) => setUpdateDetails({ ...updateDetails, email: e.target.value })}
              />
              <TextField
                label="Number"
                variant="outlined"
                margin="normal"
                className='w-full sm:w-[48%]'
                value={updateDetails.number}
                onChange={(e) => setUpdateDetails({ ...updateDetails, number: e.target.value })}
              />
            </div>
            <div className="relative w-full border my-3 border-gray-300 rounded-lg shadow-md">
              {/* Display selected languages inside the input-like field */}
              <div className="flex flex-wrap items-center gap-2 p-3">
                {selectedLanguages.map((language, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {language}
                    <IoCloseCircle
                      size={18}
                      className="ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => removeLanguage(language)}
                    />
                  </span>
                ))}
                {selectedLanguages.length === 0 && (
                  <span className="text-gray-400">Select up to 3 languages...</span>
                )}
              </div>
              {/* Dropdown to select languages */}
              <select
                onChange={handleSelect}
                className="w-full px-3 py-2 border-t bg-[#F4F4F4] border-gray-300 rounded-b-lg focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose a Language --
                </option>
                {indianLanguages.map((language, index) => (
                  <option
                    key={index}
                    value={language}
                    disabled={selectedLanguages.includes(language)}
                  >
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full h-auto flex justify-between items-center'>
              <TextField
                label="City"
                variant="outlined"
                margin="normal"
                className='w-[48%]'
                value={updateDetails.city}
                onChange={(e) => setUpdateDetails({ ...updateDetails, city: e.target.value })}
              />
              <select className=' w-[48%] bg-[#F4F4F4] border-[1px] border-gray-400 mt-2 h-[56px] px-2 text-gray-600 outline-none rounded-md'
                placeholder='Select State'
                value={updateDetails.state}
                onChange={(e) => setUpdateDetails({ ...updateDetails, state: e.target.value })}
              >
                <option value="" disabled hidden>
                  Select State
                </option>
                {
                  indianStatesAndUTs.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))
                }
              </select>
            </div>
            <div className='w-full h-auto flex justify-between items-center mb-3'>
              <TextField
                variant="outlined"
                margin="normal"
                className='w-[48%]'
                placeholder='Neet Score'
                disabled
                value={updateDetails.neetScore}
                onChange={(e) => setUpdateDetails({ ...updateDetails, neetScore: e.target.value })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                className='w-[48%]'
                placeholder='Neet Exam Year'
                disabled
                value={updateDetails.neetExamYear}
                onChange={(e) => setUpdateDetails({ ...updateDetails, neetExamYear: e.target.value })}
              />
            </div>
            <div className='w-full h-auto flex justify-between items-center mb-3'>
              <FormControl className="w-[48%]">
                <Select
                  value={updateDetails.yearOfEducation}
                  onChange={(e) => setUpdateDetails({ ...updateDetails, yearOfEducation: e.target.value })}
                  displayEmpty
                  renderValue={(selected) => (!selected ? <em>Year of Education</em> : selected)}
                >
                  <MenuItem value="">
                    <em>Select a Year</em>
                  </MenuItem>
                  <MenuItem value="1st year">1st year</MenuItem>
                  <MenuItem value="2nd year">2nd year</MenuItem>
                  <MenuItem value="3rd year">3rd year</MenuItem>
                  <MenuItem value="4th year">4th year</MenuItem>
                  <MenuItem value="Final Year">Final Year</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="w-[48%]">
                <Select
                  value={updateDetails.gender}
                  onChange={(e) => setUpdateDetails({ ...updateDetails, gender: e.target.value })}
                  displayEmpty
                  renderValue={(selected) => (!selected ? <em>Gender</em> : selected)}
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
            <textarea name="about" value={updateDetails.about} onChange={(e) => setUpdateDetails({ ...updateDetails, about: e.target.value })} placeholder='Write about yourself here' className='min-h-40 p-2 bg-[#F4F4F4] border-[1px] border-gray-400 resize-none'></textarea>
          </div>
          <div className='w-full h-auto flex justify-center items-center lg:w-[40%] lg:items-start lg:pt-10 xl:w-[30%]'>
            <div className='w-[90%] h-auto flex flex-col gap-3 lg:border-[1px] rounded-lg lg:border-gray-300 lg:py-10 lg:shadow-custom lg:gap-6'>
              <div className='hidden lg:block text-center font-cg-times text-xl font-semibold'>Change Profile Image</div>
              <img src={previewImage} alt="profile picture" className='w-40 bg-gray-400 h-40 mx-auto rounded-full object-cover' />
              <div className="w-full h-auto flex justify-center items-center">
                <input
                  type="file"
                  id="upload-image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e)}
                />
                <label
                  htmlFor="upload-image"
                  className="px-5 py-1.5 bg-blue-500 text-white font-cg-times rounded-md text-sm cursor-pointer"
                >
                  Upload Image
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-full h-auto flex justify-center items-center pb-10 lg:justify-start px-5`}>
          <span onClick={updateMentorDetails} className='text-white bg-blue-500 active:bg-blue-600 md:hover:bg-blue-600 font-cg-times text-lg px-6 py-2 rounded-md cursor-pointer font-semibold'>Save Changes</span>
        </div>
      </div>
    </>
  )
}

export default ProfileSetting