import React, { useEffect, useState } from 'react';
import Logo from './images/logo2.webp';
import { Select, MenuItem, FormControl, TextField } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Box } from '@mui/material';
import axios from 'axios'
import Loading from './utils/Loading';
import ErrorPopup from './utils/ErrorPopUp';
import { useNavigate } from 'react-router-dom';
import SideImage from './images/Mentorapplication.webp'


function FileUpload({ label, onFileChange }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <Box className="w-[48%]" display="flex" flexDirection="column" gap={1}>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        startIcon={<UploadFileIcon />}
        sx={{
          justifyContent: 'flex-start', // Align text to the start
          padding: '10px 12px', // Add padding to fit file name text
          overflow: 'hidden', // Prevent overflow of long filenames
          textOverflow: 'ellipsis', // Show ellipsis for long text
          whiteSpace: 'nowrap' // Prevent text wrap
        }}
      >
        {fileName || label}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
    </Box>
  );
}

function MentorSignup() {
  const [year, setYear] = useState('');
  const [amount,setAmount] = useState('')
  const [gender, setGender] = useState('');
  const [neetAttempt, setNeetAttempt] = useState('');
  const [neetScoreCard, setNeetScoreCard] = useState(null);
  const [collegeId, setCollegeId] = useState(null);
  const [check, setCheck] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [mentorDetails, setMentorDetails] = useState({
    neetScore: '',
    neetExamYear: '',
    institute: '',
    number: '',
  })
  const id = JSON.parse(localStorage.getItem("userId"));

  const navigate = useNavigate()

  const handleChangeYear = (event) => setYear(event.target.value);
  const handleChangeGender = (event) => setGender(event.target.value);
  const handleChangeAttempt = (event) => setNeetAttempt(event.target.value);

  const handleChange = (e) => {
    setMentorDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setMentorDetails({
      neetScore: '',
      neetExamYear: '',
      institute: '',
      number: '',
    })
    setYear('')
    setGender('')
    setNeetAttempt('')
    setCheck(false)
    setNeetScoreCard(null)
    setCollegeId(null)
  }

  async function onPayment() {
    try {
      const response = await axios.post("/api/v1/mentors/create-order")
      const data = response.data.data

      const paymentObject = new window.Razorpay({
        key: "rzp_test_ZkEAtdmouhqkw4",
        order_id: data.id,
        ...data,
        handler: function (response) {
          const option2 = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            userId: id
          }
          axios.post("/api/v1/mentors/verify-payment", option2)
            .then((response) => {
              if (response.data.success === true) {
                navigate("/signup/mentor-signup/mentor-signup-success")
                localStorage.removeItem("userId")
              } else {
                setErrorMsg(error.response.data.message)
                setErrorPopUp(true)
              }
            }).catch((error) => {
              console.log(error);
              setErrorMsg(error.response.data.message)
              setErrorPopUp(true)
            })
        }
      })
      paymentObject.open()
    } catch (error) {
      console.log(error);
      setLoading(false)
      setErrorMsg(error.response.data.message)
      setErrorPopUp(true)
      resetForm()
    }
  }

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  async function handlePayment() {
    try {
      setLoading(true)
      const formData = new FormData();

      formData.append('id', id);
      formData.append('neetScore', mentorDetails.neetScore);
      formData.append('neetExamYear', mentorDetails.neetExamYear);
      formData.append('yearOfEducation', year);
      formData.append('institute', mentorDetails.institute);
      formData.append('number', mentorDetails.number);
      formData.append('gender', gender);
      formData.append('neetAttempt', neetAttempt);
      formData.append('agreeVerificationStep', check);

      if (neetScoreCard) formData.append('scoreCard', neetScoreCard);
      if (collegeId) formData.append('studentId', collegeId);

      const response = await axios.post('/api/v1/mentors/fill-academic-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.statusCode === 200) {
        setLoading(false)
        resetForm()
        onPayment()
      }
    } catch (error) {
      console.log("Error while making payment:", error);
      setLoading(false)
      setErrorMsg(error.response.data.message)
      setErrorPopUp(true)
      resetForm()
    }
  }

  async function getVerificationAmount() {
    try {
      const response = await axios.post("/api/v1/admin/get-amount")
      if (response.data.statusCode === 200) {
        setAmount(response.data.data)
      }
    } catch (error) {
      console.log("Error while getting verification amount:", error);
    }
  }


  // useEffect(() => {
  //   const loadScript = (src) => {
  //     return new Promise((resolve) => {
  //       const script = document.createElement('script');
  //       script.src = src;
  //       script.onload = () => {
  //         resolve(true);
  //       }
  //       script.onerror = () => {
  //         resolve(false);
  //       }
  //       document.body.appendChild(script);
  //     })
  //   }
  //   loadScript('https://checkout.razorpay.com/v1/checkout.js')
  // }, [])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''
    };
    getVerificationAmount()

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      <header className='w-full h-auto flex items-center p-5 xl:hidden'>
        <img src={Logo} alt="neXmentor Logo" className='w-40 sm:w-52 md:w-60' />
      </header>
      <div className='w-full h-auto mb-10 flex flex-col overflow-x-hidden sm:w-[60%] sm:mx-auto md:w-[55%] lg:w-[45%] xl:w-full xl:mt-10'>
        <div className='w-full h-auto xl:flex xl:items-center xl:justify-center xl:gap-5 2xl:gap-10'>
          {/* Side Image start here */}
          <div className='hidden xl:relative xl:z-30 xl:flex xl:flex-col xl:w-[50%] shadow-lg 2xl:w-[43%] xl:h-[79vh] xl:rounded-xl xl:overflow-hidden'>
            <img src={SideImage} alt="Mentorship Logo" className="w-full h-full object-contain rounded-md" />
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
                  name='neetScore'
                  value={mentorDetails.neetScore}
                  onChange={(e) => handleChange(e)}
                />
                <TextField
                  label="Neet Exam Year"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                  name='neetExamYear'
                  value={mentorDetails.neetExamYear}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <FormControl fullWidth>
                <Select
                  value={year}
                  onChange={handleChangeYear}
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
              <div className='w-full h-auto flex justify-between mt-3'>
                <TextField
                  label="Institute"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                  name='institute'
                  value={mentorDetails.institute}
                  onChange={(e) => handleChange(e)}
                />
                <TextField
                  label="Contact Number"
                  variant="outlined"
                  margin="normal"
                  className='w-[48%]'
                  name='number'
                  value={mentorDetails.number}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className='w-full h-auto flex justify-between my-3'>
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
                    <MenuItem value="Others">Others</MenuItem>
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
              <div className='w-full h-auto flex justify-between my-5'>
                <FileUpload label="Neet Score Card" onFileChange={(file) => setNeetScoreCard(file)} />
                <FileUpload label="College ID" onFileChange={(file) => setCollegeId(file)} />
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" id='agree' className='size-3 mt-1' value={check} onChange={(event) => setCheck(event.target.checked)} />
                <label htmlFor="agree" className='text-gray-500 text-xs lg:text-sm'>I agree with verification steps in <span className='text-black font-semibold'>For Mentor</span>, <span className='text-black font-semibold'>Terms and Condition</span> and <span className='text-black font-semibold'>Refund Policy</span></label>
              </div>
              <div
                onClick={check ? handlePayment : undefined}
                className={`w-auto h-10 flex justify-center items-center font-cg-times text-white my-5 rounded-md mx-5 md:text-lg ${check
                  ? 'bg-[#0092DB] cursor-pointer active:bg-[#0092dbbd] md:hover:bg-[#0092dbbd]'
                  : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Continue and Pay ₹{amount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentorSignup

