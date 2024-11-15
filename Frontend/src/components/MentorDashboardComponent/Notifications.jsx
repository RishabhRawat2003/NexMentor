import React from 'react'
import Header from './Header'

function Notifications() {
  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header />
      <div className='w-[95%] h-[80vh] mx-auto px-2 rounded-2xl my-8 max-h-[90vh] flex flex-col py-6 bg-white xl:px-5 md:w-[40%]'>
        <h1 className='w-full h-auto font-cg-times text-xl font-semibold lg:text-2xl'>Notifications</h1>
      </div>
    </div>
  )
}

export default Notifications