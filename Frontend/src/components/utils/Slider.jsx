import React, { useEffect, useState , useMemo} from 'react'
import { NavLink } from 'react-router-dom'
import Image1 from '../images/loginSignupPageImages/image1.webp'
import Image2 from '../images/loginSignupPageImages/image2.webp'
import Image3 from '../images/loginSignupPageImages/image3.webp'

import { FaArrowLeftLong } from "react-icons/fa6";

const images = [Image1, Image2, Image3];

function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleBulletClick = (index) => setCurrentIndex(index);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const sliderContent = useMemo(() => (
        images.map((image, index) => (
            <img src={image} key={index} alt={`Slide ${index + 1}`} className="w-full h-auto min-w-full object-contain" />
        ))
    ), [images]);
    return (
        <div className='hidden xl:flex xl:border-[1px] xl:w-[50%] 2xl:w-[45%] xl:h-[85vh] xl:rounded-xl xl:overflow-hidden'>
            <div className="relative w-full mx-auto overflow-hidden flex items-center justify-center">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {sliderContent}
                </div>
                <NavLink to="/" className='absolute top-5 right-5 px-5 py-2 bg-[#00000094] flex items-center gap-3 text-white font-cg-times rounded-full cursor-pointer'>
                    <FaArrowLeftLong /> Back to Homepage
                </NavLink>
                <div className="absolute flex justify-center mt-2 bottom-5">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`w-14 h-1.5 rounded-full mx-1 cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-gray-300' : 'bg-gray-800'}`}
                            onClick={() => handleBulletClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Slider