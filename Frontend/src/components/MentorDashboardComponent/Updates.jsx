import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import Loading from '../utils/Loading';

function Updates() {
    const [localSidebarState, setLocalSidebarState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [adminDetails, setAdminDetails] = useState({})

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = adminDetails?.updates?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(adminDetails?.updates?.length / itemsPerPage);

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

    async function getUpdates() {
        try {
            setLoading(true)
            const response = await axios.post("/api/v1/admin/get-updates")
            if (response.data.statusCode === 200) {
                setAdminDetails(response.data.data[0])
                setLoading(false)
            }
        } catch (error) {
            console.log("Error while fetching updates", error);
            setLoading(false)
        }
    }

    function handleStateChange() {
        setLocalSidebarState((prev) => !prev)
    }

    function convertToIST(isoDateString) {
        const date = new Date(isoDateString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    useEffect(() => {
        getUpdates()
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
                        <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>All Updates</span>
                    </div>
                    <div className='w-full h-auto flex flex-col mt-5 xl:mt-10 lg:mx-auto gap-4'>
                        {
                            currentItems?.map((item, index) => (
                                <div
                                    key={index}
                                    className="w-full h-auto flex bg-gray-100 py-3 px-2 rounded-lg xl:p-4 gap-x-3"
                                >
                                    {/* Profile Picture */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={adminDetails.profilePicture}
                                            alt="profile Picture"
                                            className="w-10 h-10 rounded-full border-[1px] border-blue-500 xl:w-14 xl:h-14"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col flex-1 px-3 overflow-hidden">
                                        <span
                                            className="xl:text-lg font-cg-times font-semibold break-words">
                                            {adminDetails.name}
                                        </span>
                                        <span
                                            className="text-sm text-gray-600 break-words">
                                            {item.content}
                                        </span>
                                        <p
                                            className="w-full flex justify-end text-xs text-gray-500">
                                            {convertToIST(item.date)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    {
                        adminDetails?.updates?.length > 5 && (
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

export default Updates