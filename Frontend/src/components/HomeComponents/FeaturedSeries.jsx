import React from 'react'
import Series1 from '../images/home/F1.webp'
import Series2 from '../images/home/F2.webp'
import Series3 from '../images/home/F3.webp'
import Series4 from '../images/home/F4.webp'
import Series5 from '../images/home/F5.webp'
import Series6 from '../images/home/F6.webp'
import Series7 from '../images/home/F7.webp'
import Series8 from '../images/home/F8.webp'
import Series9 from '../images/home/F9.webp'
import { FaArrowRight } from "react-icons/fa";


const allSeries = [
    {
        title: 'One-on-One Mentorship with NEET Toppers',
        image: Series1,
    },
    {
        title: 'Proven NEET Preperation Strategies',
        image: Series2,
    },
    {
        title: 'Customized Roadmap for NEET Success',
        image: Series3,
    },
    {
        title: 'Subject Specific Topic Reviews',
        image: Series4,
    },
    {
        title: 'Real-Life NEET Success Stories',
        image: Series5,
    },
    {
        title: 'Up-to-Date NEET Exam Insights',
        image: Series6,
    },
    {
        title: 'Focused Revision Sessions',
        image: Series7,
    },
    {
        title: 'Interactive Q&A with NEET Experts',
        image: Series8,
    },
    {
        title: 'Progress Tracking and Feedback',
        image: Series9,
    }
]

function FeaturedSeries() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <h1 className='w-full text-center h-auto font-semibold font-cg-times text-xl sm:text-2xl md:text-3xl lg:text-4xl'>Our Featured Series</h1>
            <div className='disable-scrollbar w-full h-auto flex mt-10 px-5 xl:px-10 gap-6 overflow-x-scroll'>
                {
                    allSeries.map((series, index) => (
                        <div key={index} className='min-w-[90%] sm:min-w-[30%] md:min-w-[25%] h-auto flex flex-col relative'>
                            <img src={series.image} alt="series image" className='w-full h-auto object-cover' />
                            <div className='w-full flex justify-between absolute bottom-0 bg-[#0092DBE5] p-2 lg:p-6'>
                                <p className='flex-1 text-white lg:text-lg font-semibold font-cg-times'>{series.title}</p>
                                <FaArrowRight size={20} className='text-white' />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FeaturedSeries