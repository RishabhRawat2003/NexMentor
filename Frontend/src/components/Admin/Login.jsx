import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loading from '../utils/Loading'

function AdminLogin() {
    const [adminDetails, setAdminDetails] = useState({
        email: '',
        password: ''
    })
    const [loadin, setLoading] = useState(false)
    const navigate = useNavigate()

    async function loginAdmin() {
        try {
            setLoading(true)
            const response = await axios.post('/api/v1/admin/login', adminDetails)
            if (response.data.statusCode === 200) {
                localStorage.setItem("adminId", JSON.stringify(response.data.data))
                setLoading(false)
                navigate("/admin-dashboard")
            }
        } catch (error) {
            console.log("Error while login Admin", error);
            alert("Invalid email or password")
            setLoading(false)
        }
    }

    return (
        <>
            {
                loadin && <Loading />
            }
            <div className='w-full h-auto flex justify-center'>
                <div className='w-[90%] h-auto border-[1px] border-[#1A3A37] shadow-custom mt-20 sm:mt-32 py-14 rounded-md px-5 sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[25%]'>
                    <h1 className='text-center text-3xl font-semibold font-cg-times xl:text-4xl text-blue-500'>Admin Login</h1>
                    <div className='w-full h-auto flex flex-col my-8 gap-4'>
                        <div className='w-full h-auto flex flex-col gap-2'>
                            <label htmlFor="email">Email :</label>
                            <input type="text" placeholder='Enter Email' id='email' value={adminDetails.email} onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })} className='w-full py-1.5 px-2 rounded-md border-[1px] border-gray-200' />
                        </div>
                        <div className='w-full h-auto flex flex-col gap-2'>
                            <label htmlFor="password">Password :</label>
                            <input type="password" placeholder='Enter Password' id='password' value={adminDetails.password} onChange={(e) => setAdminDetails({ ...adminDetails, password: e.target.value })} className='w-full py-1.5 px-2 rounded-md border-[1px] border-gray-200' />
                        </div>
                    </div>
                    <div className='w-full h-auto flex justify-center items-center '>
                        <span onClick={loginAdmin} className='font-cg-times px-8 py-1.5 text-white bg-blue-500 active:bg-blue-600 md:hover:bg-blue-600 rounded-md cursor-pointer font-semibold'>Login</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLogin