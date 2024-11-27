import React from 'react'
import Ad1 from '../images/home/ad1.png'
import Ad3 from '../images/home/ad3.png'
import Ad4 from '../images/home/ad4.png'
import Ad5 from '../images/home/ad5.png'

const ads = [Ad1, Ad3, Ad4, Ad5]

function Ads() {
    return (
        <div className='disable-scrollbar w-full h-auto flex mt-5 overflow-x-scroll lg:justify-center items-center lg:gap-20'>
            {
                ads.map((ad, index) => (
                    <img key={index} src={ad} alt={`ad ${index + 1}`} className='min-w-90' />
                ))
            }
        </div>
    )
}

export default Ads