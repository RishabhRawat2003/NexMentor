import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import Loading from '../utils/Loading';
import { MdDelete } from "react-icons/md";

function Webinars() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [webinarDetails, setWebinarDetails] = useState({})
  const [createWebinar, setCreateWebinar] = useState({
    time: '',
    date: '',
    day: '',
    year: '',
    content: ''
  })

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function getAdminDetails() {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/admin/admin-details')
      if (response.data.statusCode === 200) {
        setWebinarDetails(response.data.data.webinar)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error fetching admin details", error);
      setLoading(false)
    }
  }

  async function createWebinars() {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('time', createWebinar.time);
      formData.append('date', createWebinar.date);
      formData.append('day', createWebinar.day);
      formData.append('year', createWebinar.year);
      formData.append('content', createWebinar.content);
      if (selectedImage) formData.append('image', selectedImage)
      const response = await axios.post("/api/v1/admin/create-webinar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data.statusCode === 200) {
        getAdminDetails()
        setPreviewImage(null)
        setCreateWebinar({
          date: '',
          day: '',
          year: '',
          content: '',
          time: '',
        })
        setLoading(false)
      }
    } catch (error) {
      console.log("Error updating ad and amount", error);
      setLoading(false)
    }
  }

  async function deleteBlog() {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/admin/remove-webinar')
      if (response.data.statusCode === 200) {
        setLoading(false)
        getAdminDetails()
      }
    } catch (error) {
      console.log("Error while getting a blog", error);
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
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
          <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
            <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Create Webinar</span>
          </div>
          <div className='w-full h-auto mt-10'>
            <img src={previewImage} alt="featured ad" className='w-[90%] h-[25vh] mx-auto bg-gray-400 rounded-xl sm:h-[40vh] lg:h-[55vh] object-cover shadow-custom' />
            <div className="w-full h-auto flex justify-center items-center mt-5">
              <input
                type="file"
                id="upload-image"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e)}
              />
              <label
                htmlFor="upload-image"
                className="px-6 py-2 bg-blue-500 md:hover:bg-blue-600 active:bg-blue-600 text-white font-cg-times rounded-md font-semibold cursor-pointer"
              >
                Upload Image
              </label>
            </div>
          </div>
          <div className='w-full h-auto flex flex-col gap-3 items-center sm:justify-between mt-10 md:gap-6'>
            <div className='w-full h-auto flex flex-col gap-3 sm:justify-center sm:items-center md:flex-row xl:w-full xl:mx-auto'>
              <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-[50%]'>
                <label htmlFor="webinarDate">Set Date</label>
                <input type="text" id='webinarDate' value={createWebinar.date} onChange={(e) => setCreateWebinar({ ...createWebinar, date: e.target.value })} placeholder='Enter Webinar Date' className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md' />
              </div>
              <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-[50%]'>
                <label htmlFor="webinarTime">Set Time</label>
                <input type="text" id='webinarTime' value={createWebinar.time} onChange={(e) => setCreateWebinar({ ...createWebinar, time: e.target.value })} placeholder='Enter Webinar Time' className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md' />
              </div>
              <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-[50%]'>
                <label htmlFor="webinarDate">Set Day</label>
                <input type="text" id='webinarDate' value={createWebinar.day} onChange={(e) => setCreateWebinar({ ...createWebinar, day: e.target.value })} placeholder='Enter Webinar Day' className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md' />
              </div>
              <div className='w-full h-auto flex flex-col gap-2 font-cg-times sm:w-[50%]'>
                <label htmlFor="webinarDate">Set Year</label>
                <input type="text" id='webinarDate' value={createWebinar.year} onChange={(e) => setCreateWebinar({ ...createWebinar, year: e.target.value })} placeholder='Enter year' className='w-full h-auto outline-none border border-gray-400 p-2 rounded-md' />
              </div>
            </div>
            <textarea placeholder='Enter your Message here' value={createWebinar.content} onChange={(e) => setCreateWebinar({ ...createWebinar, content: e.target.value })} className='w-full h-40 border-[1px] border-gray-400 p-2 outline-none resize-none rounded-md'></textarea>
          </div>
          <div className='w-full h-auto flex flex-col justify-center items-center mt-10'>
            <button onClick={createWebinars} className="px-6 py-2 bg-blue-500 md:hover:bg-blue-600 active:bg-blue-600 text-white font-cg-times rounded-md font-semibold cursor-pointer">Create</button>
          </div>
          {
            webinarDetails?.image
              ? <div className='w-full h-auto flex mt-7'>
                <div
                  className="w-full h-auto p-4 border justify-between rounded-lg shadow-md bg-white flex flex-col sm:w-[50%] md:w-[35%] lg:w-[30%] xl:w-[25%]"
                >
                  <div className='w-full h-auto flex flex-col'>
                    <img src={webinarDetails.image} alt="testimonial image" className='w-full h-40 object-cover border border-gray-400' />
                    <span className='mx-auto lg:text-lg font-semibold mt-3'>{webinarDetails.time} {webinarDetails.date} {webinarDetails.day}, {webinarDetails.year}</span>
                    <p className='w-full h-auto text-center text-sm mt-2 text-gray-400'>
                      {webinarDetails.content.length > 30 ? webinarDetails.content.slice(0, 150) + '...' : webinarDetails.content}
                    </p>
                  </div>
                  <p className='flex justify-end items-center mt-3'>
                    <MdDelete size={25} onClick={deleteBlog} className='text-red-500 cursor-pointer md:hover:text-red-600 active:text-red-600' />
                  </p>
                </div>
              </div>
              : null
          }
        </div>
      </div>
    </>
  )
}

export default Webinars