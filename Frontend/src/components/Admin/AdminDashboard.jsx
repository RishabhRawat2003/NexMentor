import React, { useEffect, useState } from 'react'
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiUsers } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import Header from './Header';
import axios from 'axios';
import Loading from '../utils/Loading'
import { FaStar, FaRegStar } from 'react-icons/fa';
import { IoWalletOutline } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";


export const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center justify-center">
            {[...Array(5)].map((_, index) => (
                <span key={index}>
                    {index < rating ? (
                        <FaStar size={15} className="text-yellow-500" />
                    ) : (
                        <FaRegStar size={15} className="text-gray-300" />
                    )}
                </span>
            ))}
        </div>
    );
};


function AdminDashboard() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [dashboardData, setDashboardData] = useState({})
    const [loading, setLoading] = useState(false)
    const [completedSessions, setCompletedSessions] = useState([])

    function formatNumber(num) {
        if (num >= 1000) {
            const truncated = Math.floor(num / 100); // Truncate to the nearest 100
            return (truncated / 10).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num;
    }

    const handleViewImage = (imageUrl) => {
        window.open(imageUrl, '_blank');
    };


    async function fetchDashboardData() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/dashboard-data")
            if (response.data.statusCode === 200) {
                setDashboardData(response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching dashboard data", error);
            setLoading(false)
        }
    }

    async function fetchCompletedSessions() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/total-completed-sessions")
            if (response.data.statusCode === 200) {
                const mentors = response.data.data;
                const transformedSessions = [];

                mentors.forEach(mentor => {
                    mentor.completeSessions.forEach(session => {
                        const newSessionObject = {
                            mentorId: mentor.mentorId,
                            student: session.student,
                            package: session.package.packageName,
                            purchaseDate: session.purchaseDate,
                            purchasedSessionId: session.purchasedSessionId,
                            imageOfProof: session.imageOfProof,
                            _id: session._id,
                            feedBack: mentor.feedBack.find(feedBack => feedBack.owner === session.student._id ? feedBack.rating : 0)
                        };
                        transformedSessions.push(newSessionObject);
                    });
                });
                setCompletedSessions(transformedSessions);
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching completed sessions", error);
            setLoading(false)
        }
    }

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    useEffect(() => {
        fetchDashboardData()
        fetchCompletedSessions()
    }, [])

    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
                        <Header handleStateChange={handleStateChange} />
                        <div className='w-full h-auto flex flex-wrap justify-center gap-4 mt-5'>
                            <div className='w-[230px] h-auto rounded-3xl p-3 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Active Sessions</span>
                                    <MdOutlineShoppingCartCheckout size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalActiveSessions}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Revenue</span>
                                    <BsGraphUpArrow size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{formatNumber(dashboardData?.totalRevenue)}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Sessions</span>
                                    <LuShoppingCart size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalNoOfSessions}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Referred People</span>
                                    <HiUsers size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalReferred}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Mentors</span>
                                    <HiUsers size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalMentors}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Students</span>
                                    <HiUsers size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalStudents}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Wallet</span>
                                    <IoWalletOutline size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalWalletAmount}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Pending Sessions</span>
                                    <MdPendingActions size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{dashboardData?.totalPendingSessions}</span>
                            </div>
                        </div>
                        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
                            <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                                <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Completed Sessions</span>
                                <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
                                    <IoSearch size={20} />
                                    <input type="text" placeholder='Search by username' className='outline-none h-auto w-full py-2' />
                                </div>
                            </div>
                            <table className="min-w-full overflow-x-scroll mt-4">
                                <thead className="bg-[#9EDFFF63] border-b border-gray-300">
                                    <tr>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            S.No
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mentors
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Students
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Package Name
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image of proof
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Feedback
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {completedSessions.map((item, index) => (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                {index + 1}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                {item?.mentorId}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                {item?.student.username}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                {item?.package}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                <span onClick={() => handleViewImage(item?.imageOfProof)} className='text-blue-500 underline cursor-pointer'>View</span>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                                <StarRating
                                                    rating={item?.feedBack.rating}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }

        </>
    )
}

export default AdminDashboard