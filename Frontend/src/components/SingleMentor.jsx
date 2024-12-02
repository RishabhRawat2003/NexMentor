import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Loading from './utils/Loading'
import ErrorPopup from './utils/ErrorPopUp'
import { StarRating } from './utils/StarRating'
import Testimonial from './HomeComponents/Testimonials'
import { useDispatch } from "react-redux";
import { triggerHeaderUpdate } from "./store/HeaderSlice";

function SingleMentor() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const { id } = useParams()
  const [errorPopUp, setErrorPopUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const dispatch = useDispatch();

  const navigate = useNavigate()

  async function fetchMentorDetails() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/mentors/single-mentor", { mentorId: id })
      if (response.data.statusCode === 200) {
        setUser(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while getting mentor details");
      setErrorMsg(error.response?.data?.message || "An error occurred");
      setErrorPopUp(true);
      setLoading(false);
    }
  }

  async function bookSession(id) {
    try {
      const response = await axios.post("/api/v1/students/create-order", { packageId: id })
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
            packageId: id
          }
          axios.post("/api/v1/students/verify-payment", option2)
            .then((response) => {
              if (response.data.success === true) {
                setLoading(true)
                dispatch(triggerHeaderUpdate());
                navigate("/student-profile")
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
      console.log("error while booking session", error);
      setErrorMsg(error.response?.data?.message || "An error occurred");
      setErrorPopUp(true);
      if (error.response.statusText === 'Unauthorized') {
        navigate('/login')
      }
    }
  }

  function handleCloseErrorPopUp() {
    setErrorPopUp(false)
  }

  useEffect(() => {
    fetchMentorDetails()
  }, [id])

  return (
    <>
      <ErrorPopup open={errorPopUp} handleClose={handleCloseErrorPopUp} errorMessage={errorMsg} />
      {loading
        ? <Loading />
        : (
          <div className='w-full h-auto flex flex-col py-3 gap-8 scroll-smooth'>
            <div className='w-full h-auto flex flex-col md:flex-row md:justify-between md:px-3 lg:px-20 2xl:px-32 gap-7'>
              <div className='w-full h-auto flex shadow-custom mx-auto md:flex-col md:w-[30vw] md:mx-0 md:h-[370px] lg:w-[25vw] lg:h-[400px] xl:w-[20vw] 2xl:w-[20vw] md:rounded-lg'>
                <div className='w-auto md:w-full flex justify-center items-center md:h-40 md:object-cover lg:h-52 md:rounded-t-lg md:py-1'>
                  <img src={user.profilePicture} alt="profile picture" className='w-48 h-32 rounded-full md:w-40 md:h-40 mx-auto object-cover border-[1px] border-bg-gray-500' />
                </div>
                <div className='w-full h-auto flex flex-col p-2 font-cg-times justify-between md:h-full 2xl:mt-5'>
                  <div className='w-full h-auto flex flex-col'>
                    <div className='w-full h-auto flex flex-col font-semibold sm:flex-row text-lg sm:text-xl lg:text-2xl'>{user.firstName} {user.lastName}</div>
                    <div className='flex items-center'>
                      <StarRating
                        rating={
                          user.feedBack?.length > 0
                            ? Math.round(user.feedBack.reduce((acc, item) => acc + item.rating, 0) / user.feedBack.length)
                            : user.neetScore >= 681 ? 5 : user.neetScore >= 641 && user.neetScore >= 680 ? 4 : 3
                        }
                      />
                    </div>
                    <div className='flex items-center gap-2 my-2 lg:hidden'>
                      {
                        user.languages?.map((language, index) => (
                          <span key={index} className='text-xs bg-[#0092DB4D] px-3 py-0.5 rounded-full'>{language}</span>
                        ))
                      }
                    </div>
                    <div className='text-xs text-gray-500 flex justify-between sm:text-sm lg:mt-3'><span>Neet Score : {user.neetScore}</span> <span>{user.gender}</span></div>
                    <div className='text-xs text-gray-500 flex sm:text-sm mt-1'>{user.institute}, {user.address?.state}</div>
                    <div className='hidden lg:flex lg:items-center lg:gap-2 lg:mt-4'>
                      {
                        user.languages?.map((language, index) => (
                          <span key={index} className='text-xs bg-[#0092DB4D] px-3 py-0.5 rounded-full xl:px-4 xl:text-sm'>{language}</span>
                        ))
                      }
                    </div>
                  </div>
                  <a href='#package' className='w-full h-auto bg-[#0092DB] flex justify-center items-center text-white py-1 mt-2 cursor-pointer md:py-1.5 md:hover:bg-[#0092dbb6] active:bg-[#0092dbb6] rounded-sm'>Book Session</a>
                </div>
              </div>
              <div className='w-full h-auto flex justify-center items-center md:w-[60vw] lg:w-[70vw]'>
                <img src={user.featuredAd} alt="featured ad" className='w-[90%] h-[200px] bg-gray-400 rounded-xl sm:h-[300px] lg:h-[400px] shadow-custom' />
              </div>
            </div>
            <div className='w-[90%] h-auto mx-auto flex flex-col rounded-md shadow-custom p-2 gap-2 md:p-6'>
              <div className='font-cg-times text-sm sm:text-base md:text-lg xl:text-2xl'><span className='text-[#0092DB]'>About</span> <span>{user.firstName} {user.lastName}</span></div>
              <div className='text-xs text-[#2E2E2E] font-cg-times sm:text-sm md:text-base xl:text-lg'>{user.about ? user.about : ''} </div>
            </div>
            <div className='w-[90%] mx-auto rounded-md h-auto flex flex-col shadow-custom p-4 mb-10 gap-5'>
              <h1 className='text-center font-cg-times md:text-lg xl:text-2xl'>Packages</h1>
              <div id='package' className='w-full h-auto flex flex-col justify-center items-center py-5 xl:py-10'>
                {
                  user.package?.map((item, index) => (
                    <div key={index} className='w-[95%] h-auto flex flex-col bg-[#DAE8FB] p-3 gap-3 rounded-md sm:w-[75%] xl:gap-6 md:w-[70%] lg:w-[50%] xl:w-[35%] md:p-8'>
                      <div className='w-full h-auto font-cg-times flex justify-between items-center'>
                        <span className='text-sm w-[80%] md:text-lg font-semibold'>{item.packageName}</span>
                      </div>
                      <div style={{ whiteSpace: "pre-wrap" }} className='w-full h-auto font-cg-times text-[#2E2E2E] text-xs md:text-base'>
                        {item.packageDescription}
                      </div>
                      <div className='w-full h-auto flex justify-end items-center gap-1 text-sm md:text-lg font-semibold'>₹ {item.packagePrice} <span className='text-xs line-through font-extralight'>₹ {item.packagePrice + 100}</span> <span className='hidden md:block text-xs font-extralight'>(Save ₹100)</span> </div>
                      <div onClick={() => bookSession(item._id)} className='w-full h-auto bg-[#0092DB] flex justify-center items-center text-white py-1 mt-2 cursor-pointer md:py-1.5 md:hover:bg-[#0092dbb6] active:bg-[#0092dbb6] rounded-sm'>Book Session</div>
                    </div>
                  ))
                }
              </div>
            </div>
            <Testimonial />
          </div>
        )
      }

    </>
  )
}

export default SingleMentor