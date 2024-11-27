import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaQuestion } from "react-icons/fa6";

function Faq() {
    const [index, setIndex] = useState(null)

    const FAQ = [
        {
            id: 1,
            title: 'What is the FitnessFit Schedule?',
            answer: 'Our schedule is designed to accommodate all fitness levels and busy lifestyles. We offer a wide range of classes from early morning to late evening. For the most up-to-date schedule, including class times and descriptions.'
        },
        {
            id: 2,
            title: 'Do I need previous experience for your classes?',
            answer: 'No previous experience is required to join our classes. Our certified instructors tailor each session to accommodate beginners and advanced members alike. We encourage everyone to participate, regardless of fitness level, and our team is here to support you every step of the way.'
        },
        {
            id: 3,
            title: 'Do you offer on-site classes, or just virtual classes?',
            answer: 'We offer both on-site and virtual classes to cater to your preferences and needs. You can join us at our state-of-the-art facility for in-person sessions or participate in our virtual classes from the comfort of your home'
        },
        {
            id: 4,
            title: 'Do you offer a trial class for any of your classes?',
            answer: 'Yes, we do! We believe in the quality of our classes and invite you to experience them firsthand. We offer a complimentary trial class for new members to help you find the perfect fit. Please contact our front desk or sign up online to schedule your trial class.'
        },
    ]

    function handleSelection(i) {
        if (i === index) {
            setIndex(0)
        } else {
            setIndex(i)
        }
    }
    return (
        <div className='w-full h-auto flex flex-col mb-10 xl:mb-20'>
            <h1 className='w-full h-auto text-center font-semibold font-cg-times text-[#153F78] text-xl sm:text-2xl md:text-3xl lg:text-4xl'>Frequently asked question</h1>
            <div className='w-[90%] mx-auto h-auto flex flex-col mt-5 lg:mt-10 sm:flex-row sm:justify-center sm:items-center sm:gap-5 xl:gap-10'>
                <div className='w-full h-auto sm:w-[48%] md:w-[80%] lg:w-[70%] xl:w-[60%]'>
                    {
                        FAQ.map((items, i) => (
                            <div key={items.id} className='w-full font-cg-times h-auto text-sm py-2 px-3 bg-white rounded-md flex flex-col font-textFont my-2 lg:my-5 lg:px-5 md:mx-auto shadow-custom'>
                                <p className='flex justify-between items-center sm:text-lg lg:text-xl xl:text-2xl xl:py-2 xl:px-1'>{items.title} <span className='mx-1' onClick={() => handleSelection(items.id)}>{index === items.id ? <IoIosArrowUp size={20} className='cursor-pointer' /> : <IoIosArrowDown size={20} className='cursor-pointer' />}</span></p>
                                {index === items.id ?
                                    <p className='mt-3 text-sm text-gray-600 sm:text-base lg:text-lg'>{items.answer}</p>
                                    : null
                                }
                            </div>
                        ))
                    }
                </div>
                <div className='w-full h-auto flex justify-center items-center mt-10 sm:w-[48%] lg:w-[30%] sm:items-start sm:justify-start '>
                    <div className='border border-[#0092DB] w-[80%] h-auto flex flex-col items-center px-3 py-6 rounded-lg md:py-10'>
                        <FaQuestion />
                        <h1 className='text-center font-semibold text-base sm:text-lg md:text-xl xl:text-2xl mt-3 md:mt-6'>Do you have any other questions?</h1>
                        <p className='text-center text-xs mt-3 lg:my-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus atque perferendis provident laborum nihil nesciunt voluptatem repellat eligendi illum quo.</p>
                        <button className='px-4 py-2 bg-blue-500 text-white font-semibold mx-auto rounded-md mt-4 md:mt-6'>Shoot email</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faq