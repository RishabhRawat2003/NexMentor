import React, { useEffect, useState } from 'react'
import Logo from './images/logo2.webp';
import TextField from '@mui/material/TextField';
import { NavLink, useNavigate } from 'react-router-dom';
import Authentication from './utils/Authentication';
import axios from 'axios';
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
import { useDispatch, useSelector } from 'react-redux';
import { setLoginParam } from './store/ParamsSlice';
import Loading from './utils/Loading';
import Slider from './utils/Slider';


function Signup() {
  const [activeContainer, setActiveContainer] = useState('student')
  const [loading, setLoading] = useState(false)
  const [verifyEmailPopUp, setVerifyEmailPopUp] = useState(false)
  const [accountCreatedPopUp, setAccountCreatedPopUp] = useState(false)
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [accountData, setAccountData] = useState({
    student: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', referralCode: '', check: false },
    mentor: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', city: '', state: '' }
  });

  const dispatch = useDispatch();
  const loginParam = useSelector((state) => state.data.loginParam);
  const navigate = useNavigate()

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

  const handleClose = async (verified) => {
    if (verified) {
      setAccountCreatedPopUp(true);
    } else {
      const userEmail = activeContainer === 'student' ? accountData.student.email : accountData.mentor.email;
      try {
        await axios.post(`/api/v1/${activeContainer}s/delete-${activeContainer}`, { email: userEmail });
      } catch (error) {
        console.error("Error while removing unverified user!", error);
      }
    }
    localStorage.removeItem("userId")
    setVerifyEmailPopUp(false);
    resetForm();
  };

  const resetForm = () => setAccountData({
    student: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', referralCode: '', check: false },
    mentor: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', city: '', state: '' }
  });


  function handleButtonClick(type) {
    setActiveContainer(type);
    resetForm();
    dispatch(setLoginParam(type));
  }

  const verifyEmail = async () => {
    const accountData2 = activeContainer === 'student' ? accountData.student : accountData.mentor;
    const url = `/api/v1/${activeContainer}s/create-account`;

    try {
      setLoading(true);
      const response = await axios.post(url, accountData2);
      if (response.data.statusCode === 200) {
        localStorage.setItem("userId", JSON.stringify(response.data.data));
        setVerifyEmailPopUp(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error while verifying email!", error);
      setErrorMsg(error.response?.data?.message || "An error occurred");
      setErrorPopUp(true);
      setLoading(false);
    }
  };
  function handleLogin() {
    navigate('/login')
  }

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountData((prevData) => ({
      ...prevData,
      [activeContainer]: { ...prevData[activeContainer], [name]: value }
    }));
  };

  useEffect(() => {
    if (loginParam) setActiveContainer(loginParam)
  }, []);

  return (
    <>
      {loading && <Loading />}
      <VerifyEmailOTP open={verifyEmailPopUp} handleClose={handleClose} email={activeContainer === 'student' ? accountData.student.email : accountData.mentor.email} userType={activeContainer === 'student' ? 'student' : 'mentor'} />
      {accountCreatedPopUp && (
        <Dialog open={accountCreatedPopUp} onClose={() => setAccountCreatedPopUp(false)}>
          <DialogTitle>Account Created</DialogTitle>
          <DialogContent>
            <Typography>Your account has been successfully created!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogin} color="primary" variant="contained">Login</Button>
          </DialogActions>
        </Dialog>
      )}
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <header className='w-full h-auto flex items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" className='w-40 sm:w-52 md:w-60' />
      </header>
      <div className='w-full h-auto flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-20'>
        <div className='w-full h-auto flex flex-col justify-center items-center mt-2 gap-2 font-cg-times xl:hidden'>
          <h1 className='text-[#0092DB] text-3xl font-bold'>Welcome</h1>
          <p className='text-lg'>Somewords will come here </p>
        </div>
        <div className='w-full h-auto xl:flex xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Sider start here */}
          <Slider />
          {/* main form start here */}
          <div className='w-auto h-auto flex flex-col mx-5 xl:w-[35%] 2xl:w-[30%]'>
            <div className='w-full h-auto flex justify-center items-center text-2xl font-cg-times font-bold'>CREATE NEW ACCOUNT</div>
            <div className='w-auto h-auto flex font-cg-times text-sm mt-5'>
              <p onClick={() => handleButtonClick('student')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Student</p>
              <p onClick={() => handleButtonClick('mentor')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100 lg:text-xl'>Mentor</p>
            </div>
            <div className={`${activeContainer === 'student' ? 'translate-x-0' : 'translate-x-[50%]'} w-auto h-auto flex transition duration-300`}>
              <p className='w-[50%] h-[2px] bg-[#0092DB]'></p>
            </div>
            <div className='relative w-[99%] h-[650px] overflow-hidden xl:h-[580px]'>
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
                      value={accountData.student.firstName}
                      name='firstName'
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                      value={accountData.student.lastName}
                      name='lastName'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type='email'
                    value={accountData.student.email}
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
                      value={accountData.student.password}
                      name='password'
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                      value={accountData.student.confirmPassword}
                      name='confirmPassword'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <TextField
                    label="Referral Code (If you have)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={accountData.student.referralCode}
                    name='referralCode'
                    onChange={(e) => handleChange(e)}
                  />
                  <div className='flex gap-2 items-center'>
                    <input type="checkbox" id='agree' className='size-3' value={accountData.student.check} onChange={(event) =>
                      setAccountData((prevState) => ({
                        ...prevState,
                        student: { ...prevState.student, check: event.target.checked },
                      }))
                    } />
                    <label htmlFor="agree" className='text-gray-500 text-xs lg:text-sm'>I agree with <span className='text-black font-semibold'>Terms and Condition</span> and  <span className='text-black font-semibold'>Refund Policy</span></label>
                  </div>
                  <div onClick={accountData.student.check ? verifyEmail : undefined}
                    className={`w-auto h-10 flex justify-center items-center font-cg-times text-white my-5 rounded-md mx-5 md:text-lg ${accountData.student.check
                      ? 'bg-[#0092DB] cursor-pointer active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd]'
                      : 'bg-gray-400 cursor-not-allowed'
                      }`}
                  >
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
                      name='firstName'
                      value={accountData.mentor.firstName}
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                      name='lastName'
                      value={accountData.mentor.lastName}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={accountData.mentor.email}
                    onChange={(e) => handleChange(e)}
                  />
                  <div className='w-full h-auto flex justify-between items-center'>
                    <select className=' w-[48%] bg-white border-[1px] border-gray-400 mt-2 h-[56px] px-2 text-gray-600 outline-none rounded-[4px]'
                      placeholder='Select State'
                      name='state'
                      value={accountData.mentor.state}
                      onChange={(e) => handleChange(e)}
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
                    <TextField
                      label="City"
                      variant="outlined"
                      margin="normal"
                      className='w-[48%]'
                      name='city'
                      value={accountData.mentor.city}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className='w-full h-auto flex flex-col xl:flex-row xl:justify-between'>
                    <TextField
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                      name='password'
                      value={accountData.mentor.password}
                      onChange={(e) => handleChange(e)}
                    />
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      margin="normal"
                      type='password'
                      className='w-full xl:w-[48%]'
                      name='confirmPassword'
                      value={accountData.mentor.confirmPassword}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div onClick={verifyEmail} className='w-auto h-10 flex justify-center items-center font-cg-times text-white bg-[#0092DB] my-5 rounded-md mx-5 active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd] cursor-pointer md:text-lg'>
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