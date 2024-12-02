import React, { useEffect, useState } from 'react'
import Loading from './utils/Loading'
import axios from 'axios'
import { FaCalendarAlt } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import { FaAngleRight } from "react-icons/fa6";
import Faq from './HomeComponents/Faq'

function WebinarPage() {
  const [webinarDetails, setWebinarDetails] = useState({})
  const [loading, setLoading] = useState(false)
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
  })

  async function getAdminDetails() {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/admin/get-webinar')
      if (response.data.statusCode === 200) {
        setWebinarDetails(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error fetching admin details", error);
      setLoading(false)
    }
  }

  async function registerWebinar() {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/admin/register-for-webinar', registerInfo)
      if (response.data.statusCode === 200) {
        alert("You are successfully resgistered for the webinar")
        setLoading(false)
        setRegisterInfo({
          name: '',
          email: '',
        })
      }
    } catch (error) {
      console.log("Error registering webinar", error);
      setLoading(false)
    }
  }

  useEffect(() => {
    getAdminDetails()
  }, [])

  return (
    <>
      {
        loading && <Loading />
      }
      {
        webinarDetails.image
          ? <div className='w-full h-auto flex flex-col my-10 px-5 gap-5 lg:gap-10'>
            <div className='w-full h-auto flex justify-center items-center'>
              <img src={webinarDetails?.image} alt="webinar image" className='w-full object-cover rounded-lg sm:w-[70%] lg:h-[400px]' />
            </div>
            <div className='w-full h-auto flex flex-col gap-5 md:flex-row md:justify-between lg:px-20 xl:px-40 2xl:px-60'>
              <div className='w-full h-auto flex flex-col gap-5 md:w-[50%] lg:gap-10'>
                <div className='w-full h-auto flex items-center gap-1 text-lg font-semibold'>
                  <FaCalendarAlt size={30} className='mr-2 text-blue-500' />
                  <span>{webinarDetails?.time},</span>
                  <span>{webinarDetails?.date}</span>
                  <span>{webinarDetails?.day},</span>
                  <span>{webinarDetails?.year}</span>
                </div>
                <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: webinarDetails.content }} className='w-full h-auto font-cg-times text-sm md:text-base xl:text-lg'>
                </div>
              </div>
              <div className='w-full h-auto flex flex-col md:w-[40%] lg:w-[30%]'>
                <h1 className='text-center font-semibold text-2xl bg-black text-white py-2 rounded-lg mb-4'>Register Now !!</h1>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='text'
                  value={registerInfo.name}
                  onChange={(e) => setRegisterInfo({ ...registerInfo, name: e.target.value })}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type='email'
                  value={registerInfo.email}
                  onChange={(e) => setRegisterInfo({ ...registerInfo, email: e.target.value })}
                />
                <div className='w-full h-auto flex justify-center items-center mt-3 lg:mt-6'>
                  <p onClick={registerWebinar} className='px-4 py-2 bg-[#0092DB] active:text-[#0092dbca] md:hover:bg-[#0092dbca] text-white flex gap-5 items-center rounded-md cursor-pointer lg:px-4 lg:gap-10'>
                    Register
                    <span className='p-1 bg-white rounded-full'>
                      <FaAngleRight size={20} className='text-[#0092DB]' />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          : <div className='w-full h-80 flex justify-center items-center font-bold text-xl lg:text-3xl'>NO Webinar Available</div>
      }
      <Faq />
    </>
  )
}

export default WebinarPage