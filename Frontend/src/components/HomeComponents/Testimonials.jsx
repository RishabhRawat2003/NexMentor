import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Testimonials() {
    const [testimonials, setTestimonials] = useState([])

    async function getTestimonials() {
        try {
            const response = await axios.post("/api/v1/admin/get-testimonial")
            if (response.data.statusCode === 200) {
                setTestimonials(response.data.data)
            }
        } catch (error) {
            console.log("Error while fetching testimonials", error);
        }
    }

    useEffect(() => {
        getTestimonials()
    }, [])

    return (
        <div className='w-full h-auto flex flex-col mb-10 xl:mb-20'>
            <h1 className='text-[#153F78] font-semibold font-cg-times text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl'>Our Users Testimonials</h1>
            <div className='disable-scrollbar w-full h-auto flex gap-6 py-10 lg:py-20 lg:gap-8 px-10 lg:px-20 overflow-x-scroll'>
                {testimonials?.map((testimonial, index) => (
                    <div
                        key={index}
                        className="min-w-[90%] sm:min-w-[45%] lg:min-w-[30%] xl:min-w-[25%] bg-[#DAE8FB] shadow-custom h-auto p-4 border justify-between rounded-lg flex flex-col"
                    >
                        <div className='w-full h-auto flex flex-col'>
                            <img src={testimonial.image} alt="testimonial image" className='w-40 h-40 rounded-full object-cover mx-auto border border-gray-400' />
                            <span className='mx-auto lg:text-lg font-semibold mt-5 text-[#153F78]'>{testimonial.name}</span>
                            <p className='w-full h-auto text-center text-sm mt-6 text-gray-400'>
                                {testimonial.testimonial}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonials