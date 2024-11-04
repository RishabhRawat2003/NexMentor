import React, { useEffect, useState , useMemo} from 'react'
import { NavLink } from 'react-router-dom'
import sliderImage1 from '../images/loginSignupPageImages/slider1.jpg'
import sliderImage2 from '../images/loginSignupPageImages/slider2.jpg'
import sliderImage3 from '../images/loginSignupPageImages/slider3.jpg'
import { FaArrowLeftLong } from "react-icons/fa6";

const images = [sliderImage1, sliderImage2, sliderImage3];

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
                <div className='absolute left-5 bottom-24 flex flex-col gap-1 font-cg-times text-white'>
                    <span className='text-6xl'>Welcome Back</span>
                    <span className='text-3xl'>Something will come here</span>
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