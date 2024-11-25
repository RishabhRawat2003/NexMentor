import React, { useState } from 'react'
import Loading from '../utils/Loading'
import Header from './Header'
import axios from 'axios'


function AdminProfileSetting() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateDetails, setUpdateDetails] = useState({
    name: '',
    email: '',
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function updateAdminDetails() {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('email', updateDetails.email);
      if (selectedImage) formData.append('profilePicture', selectedImage)
      const response = await axios.post("/api/v1/admin/update-details", formData, {
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

  function getData(e) {
    setUpdateDetails({
      email: e.email,
      name: e.name
    })
    setPreviewImage(e.profilePicture)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header getData={getData} handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 h-auto max-h-auto flex flex-col lg:w-[60%] py-10 bg-white xl:w-[50%] xl:px-5`}>
          <div className='w-full h-auto flex flex-col gap-3 lg:gap-6'>
            <div className='hidden lg:block text-center font-cg-times text-xl font-semibold'>Change Profile Image</div>
            <img src={previewImage} alt="profile picture" className='w-40 bg-gray-400 h-40 mx-auto rounded-full object-cover border-[1px] border-blue-500' />
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
          <div className='w-full h-auto flex justify-between items-center mt-10'>
            <div className='w-[48%] h-auto flex flex-col font-cg-times gap-1 lg:gap-2'>
              <label className='text-lg lg:text-xl'>Name</label>
              <input type="text" value={updateDetails.name} disabled className='outline-none cursor-not-allowed border-[1px] border-gray-400 rounded-md p-2' />
            </div>
            <div className='w-[48%] h-auto flex flex-col font-cg-times gap-1 lg:gap-2'>
              <label className='text-lg lg:text-xl' htmlFor='emailadmin'>Email</label>
              <input type="text" id='emailadmin' value={updateDetails.email} onChange={(e) => setUpdateDetails({ ...updateDetails, email: e.target.value })} className='outline-none border-[1px] border-gray-400 rounded-md p-2' />
            </div>
          </div>
          <div className='w-full h-auto flex justify-center items-center mt-10'>
            <span onClick={updateAdminDetails} className='text-white bg-blue-500 active:bg-blue-600 md:hover:bg-blue-600 font-cg-times text-lg px-6 py-2 rounded-md cursor-pointer font-semibold'>Save Changes</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminProfileSetting