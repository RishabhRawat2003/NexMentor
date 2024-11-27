import React from 'react'
import { NavLink } from 'react-router-dom'
import LandingPage from './HomeComponents/LandingPage'
import Ads from './HomeComponents/Ads'
import FeaturedMentors from './HomeComponents/FeaturedMentors'
import WhyChoose from './HomeComponents/WhyChoose'
import FeaturedSeries from './HomeComponents/FeaturedSeries'
import Banner from './HomeComponents/Banner'
import Blogs from './HomeComponents/Blogs'
import Testimonials from './HomeComponents/Testimonials'
import Faq from './HomeComponents/Faq'

function Homepage() {
    return (
        <div className='w-full h-auto flex flex-col'>
            <LandingPage />
            <Ads />
            <FeaturedMentors />
            <WhyChoose />
            <FeaturedSeries />
            <Banner />
            <Blogs />
            <Testimonials />
            <Faq />
        </div>
    )
}

export default Homepage