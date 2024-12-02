import React, { useState } from 'react'
import Header from './Header'

function Notifications() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [notifications, setNotifications] = useState([])

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  function getUserData(data) {
    setNotifications(data.notifications.reverse())
  }


  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header getData={getUserData} handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] h-[80vh] mx-auto px-2 rounded-2xl my-8 max-h-[90vh] flex-col py-6 bg-white xl:px-5 md:w-[40%] `}>
        <h1 className='w-full h-auto font-cg-times text-xl font-semibold lg:text-2xl'>Notifications</h1>
        <div className='disable-scrollbar w-full h-auto flex flex-col max-h-full overflow-y-scroll mt-3'>
          {
            notifications?.map((item, index) => (
              <p key={index} className='text-sm md:text-base font-cg-times border-b-2 py-4 '>
                {item.message}
              </p>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Notifications