import React from 'react'
import LandingPage from './BecameMentorComponents/LandingPage'
import ScrollView from './BecameMentorComponents/ScrollView'
import JoinSteps from './BecameMentorComponents/JoinSteps'
import Banner from './BecameMentorComponents/Banner'
import FeeInfo from './BecameMentorComponents/FeeInfo'
import Testimonials from './HomeComponents/Testimonials'
import Faq from './HomeComponents/Faq'

function BecameMentor() {
  return (
    <div className='w-full h-auto flex flex-col'>
        <LandingPage />
        <ScrollView />
        <JoinSteps />
        <Banner />
        <FeeInfo />
        <div className='mt-10'>
        <Testimonials />
        </div>
        <Faq />
    </div>
  )
}

export default BecameMentor