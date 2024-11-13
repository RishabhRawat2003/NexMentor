import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function Mentor() {
    return (
        <>
            <div className='w-full h-auto flex'>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default Mentor