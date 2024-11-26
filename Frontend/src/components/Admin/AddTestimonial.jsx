import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import Loading from '../utils/Loading';
import { MdDelete } from "react-icons/md";

function AddTestimonial() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [testimonials, setTestimonials] = useState([])
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [testimonialDetails, setTestimonialDetails] = useState({
        name: "",
        message: ''
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    async function getTestimonials() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/get-testimonial")
            if (response.data.statusCode === 200) {
                setTestimonials(response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching testimonials", error);
            setLoading(false)
        }
    }

    async function removeTestimonials(id) {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/delete-testimonial", { id })
            if (response.data.statusCode === 200) {
                getTestimonials()
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching testimonials", error);
            setLoading(false)
        }
    }

    async function addTestimonials() {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('name', testimonialDetails.name);
            formData.append('message', testimonialDetails.message);

            if (selectedImage) formData.append('image', selectedImage)

            const response = await axios.post('/api/v1/admin/add-testimonial', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.statusCode === 200) {
                getTestimonials()
                setLoading(false)
                setTestimonialDetails({
                    name: '',
                    message: '',
                })
                setSelectedImage(null)
                setPreviewImage(null)
            }

        } catch (error) {
            console.error("Error while adding testimonials", error);
            setLoading(false)
        }
    }

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    useEffect(() => {
        getTestimonials()
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
                        <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>All Testimonials</span>
                    </div>
                    <div className='w-full h-auto flex flex-col mt-10 lg:border-[1px] rounded-lg lg:border-gray-300 lg:shadow-custom gap-5'>
                        <div className='w-full h-auto flex flex-col lg:flex-row lg:px-10 gap-10 xl:px-20 xl:gap-20'>
                            <div className='w-full h-auto flex flex-col gap-3 lg:w-auto lg:py-10 lg:gap-6'>
                                <img src={previewImage} alt="profile picture" className='w-40 bg-gray-400 h-40 border-[1px] border-blue-500 mx-auto rounded-full object-cover' />
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
                            <div className='w-full flex-1 flex flex-col font-cg-times gap-4 my-auto'>
                                <div className='w-full h-auto flex flex-col gap-2'>
                                    <label htmlFor="testimonialName" className='font-semibold xl:text-lg'>Name</label>
                                    <input type="text" value={testimonialDetails.name} onChange={(e) => setTestimonialDetails({ ...testimonialDetails, name: e.target.value })} id='testimonialName' placeholder='Enter Name' className='outline-none border-[1px] border-gray-400 px-3 py-2 rounded-md xl:w-80' />
                                </div>
                                <div className='w-full h-auto flex flex-col gap-2'>
                                    <label htmlFor="testimonialMessage" className='font-semibold xl:text-lg'>Feedback</label>
                                    <textarea id="testimonialMessage" value={testimonialDetails.message} onChange={(e) => setTestimonialDetails({ ...testimonialDetails, message: e.target.value })} placeholder='Enter Feedback' className='outline-none border-[1px] h-32 border-gray-400 px-3 py-2 rounded-md resize-none' ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-auto flex justify-center items-center pb-5'>
                            <span onClick={addTestimonials} className='px-6 py-2 bg-blue-500 text-white font-cg-times font-semibold md:hover:bg-blue-600 active:bg-blue-600 lg:text-lg lg:px-8 rounded-md cursor-pointer'>
                                Add
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                        {testimonials?.map((testimonial, index) => (
                            <div
                                key={index}
                                className="w-full h-auto p-4 border justify-between rounded-lg shadow-md bg-white flex flex-col"
                            >
                                <div className='w-full h-auto flex flex-col'>
                                    <img src={testimonial.image} alt="testimonial image" className='w-40 h-40 object-cover mx-auto rounded-full border border-gray-400' />
                                    <span className='mx-auto lg:text-lg font-semibold mt-3'>{testimonial.name}</span>
                                    <p className='w-full h-auto text-center text-sm mt-2 text-gray-400'>
                                        {testimonial.testimonial}
                                    </p>
                                </div>
                                <p className='flex justify-end items-center mt-3'>
                                    <MdDelete onClick={() => removeTestimonials(testimonial._id)} size={25} className='text-red-500 cursor-pointer md:hover:text-red-600 active:text-red-600' />
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTestimonial