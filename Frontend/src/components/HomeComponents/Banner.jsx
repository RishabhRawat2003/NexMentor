import React from 'react'
import BannerImage from '../images/home/banner.webp'

function Banner() {
  return (
    <div className='w-full h-auto flex justify-center items-center my-10 lg:my-20'>
        <img src={BannerImage} alt="Banner" className='h-40 sm:h-auto md:w-[80%]' />
    </div>
  )
}

export default Banner