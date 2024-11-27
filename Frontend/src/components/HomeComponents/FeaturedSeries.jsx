import React from 'react'
import Series1 from '../images/home/series1.png'
import Series2 from '../images/home/series2.png'
import Series3 from '../images/home/series3.png'
import { FaArrowRight } from "react-icons/fa";


const allSeries = [
    {
        title: 'Personalized Guidance',
        image: Series1,
    },
    {
        title: 'Customized Roadmap to Success',
        image: Series2,
    },
    {
        title: 'Focused Topic Review',
        image: Series3,
    }
]

function FeaturedSeries() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <h1 className='w-full text-center h-auto font-semibold font-cg-times text-xl sm:text-2xl md:text-3xl lg:text-4xl'>Our Featured Series</h1>
            <div className='disable-scrollbar w-full h-auto flex mt-10 px-5 xl:justify-center gap-6 overflow-x-scroll'>
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