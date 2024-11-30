import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import Loading from '../utils/Loading';

function PendingSessions() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pendingSessions, setPendingSessions] = useState([])
    const [originalPendingSessions, setOriginalPendingSessions] = useState([]);
    const [searchedMentor, setSearchedMentor] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pendingSessions.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(pendingSessions.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    async function fetchPendingSessions() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/total-pending-sessions")
            if (response.data.statusCode === 200) {
                const mentors = response.data.data;
                const transformedSessions = [];

                mentors.forEach(mentor => {
                    mentor.sessionRequests.forEach(session => {
                        const newSessionObject = {
                            mentorId: mentor.mentorId,
                            student: session.student,
                            package: session.package.packageName,
                            _id: session._id,
                            purchasedDate: session.purchaseDate,
                        };
                        transformedSessions.push(newSessionObject);
                    });
                });
                setPendingSessions(transformedSessions);
                setOriginalPendingSessions(transformedSessions)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching Pending sessions", error);
            setLoading(false)
        }
    }

    function searchMentorFromPendingSession(mentorId) {
        if (mentorId.length > 3) {
            const filteredActiveSessions = originalPendingSessions.filter(
                (session) => session.mentorId === mentorId
            );
            setPendingSessions(filteredActiveSessions);
        } else if (mentorId === '') {
            setPendingSessions(originalPendingSessions);
        }
    }

    async function removePendingSession(id) {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/remove-pending-session", { id })
            if (response.data.statusCode === 200) {
                fetchPendingSessions()
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching Pending sessions", error);
            setLoading(false)
        }
    }

    function handlekeyDown(event) {
        if (event.key === "Enter") {
            searchMentorFromPendingSession(searchedMentor);
        }
    }

    useEffect(() => {
        if (searchedMentor === '') {
            setPendingSessions(originalPendingSessions);
        }
    }, [searchedMentor, originalPendingSessions]);


    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    useEffect(() => {
        fetchPendingSessions()
    }, [])

    return (
        <>
            {
                loading && <Loading />
            }
            <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
                <Header handleStateChange={handleStateChange} />
                <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
                    <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                        <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Pending Sessions</span>
                        <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
                            <IoSearch onClick={() => searchMentorFromPendingSession(searchedMentor)} size={20} />
                            <input type="text" value={searchedMentor} onKeyDown={handlekeyDown} onChange={(e) => setSearchedMentor(e.target.value)} placeholder='Search by MentorId' className='outline-none h-auto w-full py-2' />
                        </div>
                    </div>
                    <table className="min-w-full overflow-x-scroll mt-4">
                        <thead className="bg-[#9EDFFF63] border-b border-gray-300">
                            <tr>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    MentorId
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Package Name
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Purchased Date
                                </th>
                                <th className="py-3 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
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
                                        {item?.purchasedDate.slice(0, 25)}
                                    </td>
                                    <td onClick={()=> removePendingSession(item._id)} className="py-3 px-3 whitespace-nowrap text-sm text-center text-red-500 cursor-pointer md:hover:text-red-600 md:hover:underline md:underline-offset-2">
                                        Delete
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        pendingSessions.length > 15 && (
                            <div className="flex items-center justify-center space-x-4 mt-6">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium 
            ${currentPage === 1
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-gray-700">
                                    Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium 
            ${currentPage === totalPages
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                >
                                    Next
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default PendingSessions