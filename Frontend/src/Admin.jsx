import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Admin/Sidebar'

function Admin() {
    return (
        <>
            <div className='w-full h-auto flex'>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default Admin