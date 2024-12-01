import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Faq() {
    const [index, setIndex] = useState(null)

    const FAQ = [
        {
            id: 1,
            title: 'How do I sign up and create my account on NexMentor?',
            answer: 'To sign up, visit the NexMentor website and click on the Sign Up button. Fill in the required details and create your account. Once registered, log in and complete your profile to personalize your experience'
        },
        {
            id: 2,
            title: 'How do I find the right mentor for my needs?',
            answer: 'Use the mentor pool and apply filters such as state-wise location, NEET score, gender preference, and budget to narrow down your search. Review mentor profiles to read their biographies, check languages spoken, and other relevant details before making your selection.'
        },
        {
            id: 3,
            title: 'How do I book a session with a mentor?',
            answer: 'Once you have selected a mentor, click on the Book Session button and proceed to confirm your booking. Complete the payment through our secure gateway. The session will appear as pending until the mentor approves it'
        },
        {
            id: 4,
            title: 'What happens after I book a session?',
            answer: 'After booking, the mentor will review and approve your session within 24 hours. Once approved, the session status changes to active, and you’ll be notified via email and on the platform. You can then use the built-in chat system to finalize the session date and time'
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
            </div>
        </div>
    )
}

export default Faq