import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Testimonials from './HomeComponents/Testimonials'
import Faq from './HomeComponents/Faq'
import axios from 'axios';
import Loading from './utils/Loading';

function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        message: ""
    })

    async function contactUs() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/contacted-us", userDetails)
            if (response.data.statusCode === 200) {
                alert("Your message has been sent successfully")
                setUserDetails({
                    name: "",
                    email: "",
                    message: ""
                })
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    return (
        <>
        {
            loading && <Loading />
        }
            <div className='w-full h-auto flex flex-col'>
                <div className='w-full h-auto flex flex-col font-cg-times px-5 my-5'>
                    <h1 className='text-center text-xs md:text-sm xl:text-base'>Get in Touch with Us</h1>
                    <h1 className='text-center text-2xl my-3 md:text-4xl xl:text-5xl xl:my-6'>We're Here to Help You</h1>
                    <p className='text-gray-500 text-center text-xs md:text-sm md:px-10 lg:px-20 xl:px-40 xl:text-base'>Whether you have questions about your condition, need to schedule an appointment, or want to learn more about our services, our team is here to assist you. Reach out to us today, and we’ll ensure you get the support and information you need.</p>
                </div>
                <div className='w-full h-auto flex flex-col px-5 gap-3 my-5 mb-14 sm:flex-row-reverse sm:border-2 sm:p-3 rounded-xl border-blue-900 md:w-[70%] md:mx-auto md:p-5 md:gap-4 lg:justify-center lg:gap-8 xl:w-[60%]'>
                    <div className='w-full h-auto flex flex-col gap-4 lg:w-[50%] xl:gap-6'>
                        <div className='w-full h-auto flex flex-col gap-2 font-cg-times'>
                            <label htmlFor="contactName" className='text-lg font-semibold xl:text-xl'>Name</label>
                            <input type="text" id='contactName' value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} placeholder='Enter your Name' className='outline-none px-3 py-2 border rounded-md' />
                        </div>
                        <div className='w-full h-auto flex flex-col gap-2 font-cg-times'>
                            <label htmlFor="contactEmail" className='text-lg font-semibold xl:text-xl'>Email</label>
                            <input type="text" id='contactEmail' placeholder='Enter your Email' value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className='outline-none px-3 py-2 border rounded-md' />
                        </div>
                        <div className='w-full h-auto flex flex-col gap-2 font-cg-times'>
                            <label htmlFor="contactMessage" className='text-lg font-semibold xl:text-xl'>Message</label>
                            <textarea id="contactMessage" placeholder='Enter your message' value={userDetails.message} onChange={(e) => setUserDetails({ ...userDetails, message: e.target.value })} className='w-full border h-40 rounded-md resize-none px-3 py-2 xl:h-44 outline-none'></textarea>
                        </div>
                        <div className='w-full h-auto flex justify-center items-center'>
                            <span onClick={contactUs} className='px-4 py-1.5 bg-blue-500 rounded-md cursor-pointer md:hover:bg-blue-600 active:bg-blue-600 text-white font-semibold'>
                                Submit
                            </span>
                        </div>
                    </div>
                    <div className='w-full h-auto flex flex-col bg-gradient-to-b from-[#132239] to-[#0092DB] px-4 py-5 rounded-xl lg:w-[40%] xl:py-6 xl:px-6'>
                        <h1 className='text-xl font-semibold text-white xl:text-2xl'>Get in Touch</h1>
                        <p className='text-[#9C9C9C] my-2 xl:text-lg xl:my-4'>General Inquiries</p>
                        <div className='w-full h-auto flex flex-col gap-3 xl:gap-6'>
                            <div className='w-full h-auto flex gap-2 text-white'>
                                <MdEmail size={20} />
                                <p className='text-sm xl:text-base'>info@nexmentor.com</p>
                            </div>
                            <div className='w-full h-auto flex gap-2 text-white'>
                                <FaPhoneAlt size={20} />
                                <p className='text-sm xl:text-base'>+91 1234567890</p>
                            </div>
                        </div>
                        <p className='text-[#9C9C9C] my-3 xl:text-lg xl:my-4'>Open hours</p>
                        <p className='text-sm text-white xl:text-base'>24/7</p>
                        <p className='text-[#9C9C9C] my-3 xl:text-lg xl:my-4'>Location</p>
                        <p className='text-sm text-white xl:text-base'>Lorem Ipsum Dolor SIt Amet123 Main Street, Suite 111, Cityville, ST 12341</p>
                        <p className='text-[#9C9C9C] my-3 xl:text-lg xl:my-4'>Follow us</p>
                        <div className='w-full h-auto flex items-center gap-4 text-white'>
                            <FaInstagram size={25} />
                            <MdFacebook size={25} />
                            <FaLinkedin size={25} />
                            <FaXTwitter size={25} />
                        </div>
                    </div>
                </div>
                <Testimonials />
                <Faq />
            </div>
        </>
    )
}

export default ContactPage