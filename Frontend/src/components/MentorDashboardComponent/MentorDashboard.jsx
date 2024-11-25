import React, { useEffect, useState } from 'react'
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiUsers } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import Header from './Header';
import axios from 'axios';
import Loading from '../utils/Loading'
import { StarRating } from '../utils/StarRating';

function MentorDashboard() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(false)
    const [searchStudent, setSearchStudent] = useState('')
    const [completedSessions, setCompletedSessions] = useState([])
    const [originalCompletedSessions, setOriginalCompletedSessions] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalMentors: 0,
    });


    function formatNumber(num) {
        if (num >= 1000) {
            const truncated = Math.floor(num / 100); // Truncate to the nearest 100
            return (truncated / 10).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num;
    }

    function getUserData(data) {
        setUserData(data)
    }

    async function fetchCompletedSession(page = 1) {
        try {
            setLoading(true)
            const response = await axios.post(`/api/v1/mentors/all-complete-sessions?page=${page}`)
            if (response.data.statusCode === 200) {
                setCompletedSessions(response.data.data.data)
                setOriginalCompletedSessions(response.data.data.data);
                setPagination(response.data.data.pagination)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error While fetching completed Sessions", error);
            setLoading(false)
        }
    }

    function searchStudentFromCompletedSession(studentId) {
        if (studentId.length > 3) {
            const filteredCompletedSessions = originalCompletedSessions.filter(
                // [CHANGED] Use originalCompletedSessions for filtering
                (session) => session.student.username === studentId
            );
            setCompletedSessions(filteredCompletedSessions);
        } else if (studentId === '') {
            // [ADDED] Reset to original sessions when search input is cleared
            setCompletedSessions(originalCompletedSessions);
        }
    }

    function handlekeyDown(event) {
        if (event.key === "Enter") {
            searchStudentFromCompletedSession(searchStudent);
        }
    }

    const goToNextPage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
            }));
        }
    };

    const goToPreviousPage = () => {
        if (pagination.currentPage > 1) {
            setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
            }));
        }
    };

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    useEffect(() => {
        if (searchStudent === '') {
            setCompletedSessions(originalCompletedSessions);
        }
    }, [searchStudent, originalCompletedSessions]);

    useEffect(() => {
        fetchCompletedSession(pagination.currentPage)
    }, [pagination.currentPage])

    return (
        <>
            {
                loading
                    ? <Loading />
                    : <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
                        <Header getData={getUserData} handleStateChange={handleStateChange} />
                        <div className='w-full h-auto flex flex-wrap justify-center gap-4 mt-5'>
                            <div className='w-[230px] h-auto rounded-3xl p-3 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Active Sessions</span>
                                    <MdOutlineShoppingCartCheckout size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{userData?.activeSessions?.length}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Earnings</span>
                                    <BsGraphUpArrow size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{formatNumber(userData?.totalEarnings)}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Total Sessions</span>
                                    <LuShoppingCart size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{userData?.completeSessions?.length}</span>
                            </div>
                            <div className='w-[230px] h-auto rounded-3xl p-3 px-5 flex flex-col font-nunito border-[1px] border-[#D3CBFB] xl:w-[280px]'>
                                <div className='w-full h-auto flex justify-between items-center gap-4'>
                                    <span className='text-xl text-[#797D8C] xl:text-2xl'>Referred People</span>
                                    <HiUsers size={20} className='xl:size-7' />
                                </div>
                                <span className='text-4xl font-semibold xl:mt-4 xl:text-5xl'>{userData?.totalReferrals}</span>
                            </div>
                        </div>
                        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
                            <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                                <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Completed Sessions</span>
                                <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
                                    <IoSearch onClick={() => searchStudentFromCompletedSession(searchStudent)} size={20} />
                                    <input type="text" value={searchStudent} onKeyDown={handlekeyDown} onChange={(e) => setSearchStudent(e.target.value)} placeholder='Search by username' className='outline-none h-auto w-full py-2' />
                                </div>
                            </div>
                            <div className='w-full h-auto flex flex-col mt-4'>
                                <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
                                    <span className='w-1/12 text-center'>S.No</span>
                                    <span className='w-4/12 text-center'>Package Name</span>
                                    <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
                                    <span className='w-4/6 text-center sm:w-4/12'>Student</span>
                                    <span className='w-4/12 text-center hidden xl:block'>Feedbacks</span>
                                </div>
                                {
                                    completedSessions.length > 0
                                        ? completedSessions.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`flex flex-col font-cg-times justify-between p-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                            >
                                                <div className='w-full h-auto flex justify-between text-xs lg:text-base items-center'>
                                                    <span className='w-1/12 text-center'>{index + 1}</span>
                                                    <span className='w-4/12 text-center'>{item.package.packageName}</span>
                                                    <span className='sm:w-4/12 sm:text-center hidden sm:block'>{item.status}</span>
                                                    <span className='w-4/6 text-center sm:w-4/12'>{item.student.username}</span>
                                                    <span className='w-4/12 text-center hidden xl:block'>
                                                        <StarRating
                                                            rating={
                                                                userData.feedBack.length > 0
                                                                    ? userData.feedBack.find(student => student.owner === item.student._id)?.rating || 0
                                                                    : 0
                                                            }
                                                        />
                                                    </span>
                                                </div>

                                            </div>
                                        ))
                                        : <p className='p-4 text-center text-gray-500 h-80'>No Completed Session yet</p>
                                }
                            </div>
                            {
                                completedSessions.length > 10 && (
                                    <div className="w-full h-auto flex justify-center items-center my-4">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={pagination.currentPage === 1}
                                            className={`px-4 py-2 mx-2 rounded-md text-white transition duration-300 
            ${pagination.currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        >
                                            Previous
                                        </button>
                                        <span className="mx-4 text-lg font-medium text-gray-700">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={goToNextPage}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className={`px-4 py-2 mx-2 rounded-md text-white transition duration-300 
            ${pagination.currentPage === pagination.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }

        </>
    )
}

export default MentorDashboard