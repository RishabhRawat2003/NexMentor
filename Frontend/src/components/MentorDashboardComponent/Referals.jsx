import React, { useState } from 'react'
import Header from './Header'


function Referals() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [userData, setUserData] = useState({})

  function getUserData(data) {
    setUserData(data)
  }

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header getData={getUserData} handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex flex-col'} w-[95%] h-auto mx-auto px-2 rounded-2xl my-8 py-6 bg-white xl:px-8 md:w-[80%] `}>
        <h1 className='w-full h-auto font-cg-times text-xl font-semibold lg:text-3xl'>Referals</h1>
        <div className='w-full h-auto flex flex-col mt-5 font-cg-times'>
          <h1 className='text-base sm:text-xl font-semibold lg:text-2xl'>NexMentor Refer and Earn Program</h1>
          <p className='text-sm lg:text-base my-3'>Dear Mentor,</p>
          <p className='text-sm lg:text-base'>We're excited to introduce the <span className='font-semibold'>NexMentor Refer and Earn Program</span>, where you can earn <span className='font-semibold'>₹50</span> for every successful student referral.</p>
          <h2 className='font-semibold lg:text-lg mt-6 mb-8'>How It Works:</h2>
          <h3 className='font-semibold lg:text-lg mb-3 pl-8'>1. Share Your Unique Referral Code:</h3>
          <p className='pl-8 text-sm lg:text-base'>You will receive a unique referral code <span className='font-semibold'>below</span> . share this code with students who could benefit from mentorship.</p>
          <h3 className='font-semibold lg:text-lg my-3 pl-8'>2. Student Sign Up:</h3>
          <p className='pl-8 text-sm lg:text-base'>Students must use your referral code during sign-up</p>
          <h3 className='font-semibold lg:text-lg my-3 pl-8'>3. Earn Rewards:</h3>
          <p className='pl-8 text-sm lg:text-base'>You will earn <span className='font-semibold'>₹50</span> when a referral student:</p>
          <ul className='my-3 list-disc list-inside pl-8 mb-8 text-sm lg:text-base'>
            <li>Signs up using your referral code.</li>
            <li>Books and completes their first session.</li>
          </ul>
          <h2 className='font-semibold lg:text-lg my-3'>Track Your Referrals:</h2>
          <p className='text-sm lg:text-base'>Monitor your referrals, successful sessions, and earned rewards through your <span className='font-semibold'>Mentor Dashboard</span>.</p>
          <h2 className='font-semibold lg:text-lg my-3'>Important Notes:</h2>
          <ul className='mb-3 list-disc list-inside text-sm lg:text-base'>
            <li>Referrals codes are only valid for <span>students sign-ups</span>.</li>
            <li>You'll be notified once your reward is credited after the student completes their first session.</li>
          </ul>
          <p className='text-sm lg:text-base my-3'>Start Referring students today and earn rewards !</p>
          <p className='text-sm lg:text-base'>If you have any questions, feel free to reach out</p>
        </div>
        <div className='w-full h-auto flex items-center mt-7 justify-center'>
          <span className='p-5 bg-gray-100 flex flex-col rounded-xl gap-3 font-cg-times items-center xl:px-10'>
            <span className='text-3xl font-bold '>Referral Code</span>
            <span className='text-lg font-semibold text-blue-500'>{userData?.referralsCode}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Referals