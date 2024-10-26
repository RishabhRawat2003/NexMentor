import React from 'react'
import { NavLink } from 'react-router-dom'

function Homepage() {
    return (
        <div className='w-full h-screen flex justify-between'>
            Homepage
            <NavLink to='/login'>Login</NavLink>
        </div>
    )
}

export default Homepage