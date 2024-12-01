import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { MdOutlineDone } from "react-icons/md";
import Loading from '../utils/Loading'

function ApprovalSection() {
  const [sessionRequests, setSessionsRequests] = useState([])
  const [originalSessionRequests, setOriginalSessionRequests] = useState([]);
  const [searchStudent, setSearchStudent] = useState('')
  const [loading, setLoading] = useState(false)
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMentors: 0,
  });

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function fetchSessionRequests(page = 1) {
    try {
      setLoading(true)
      const response = await axios.post(`/api/v1/mentors/all-sessions-requests?page=${page}`)
      if (response.data.statusCode === 200) {
        setSessionsRequests(response.data.data.data)
        setOriginalSessionRequests(response.data.data.data);
        setPagination(response.data.data.pagination)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching session requests", error);
      setLoading(false)
    }
  }

  function searchStudentFromSessionRequests(studentId) {
    if (studentId.length > 3) {
      const filteredSessionsRequests = originalSessionRequests.filter(
        // [CHANGED] Use originalCompletedSessions for filtering
        (session) => session.student.username === studentId
      );
      setSessionsRequests(filteredSessionsRequests);
    } else if (studentId === '') {
      // [ADDED] Reset to original sessions when search input is cleared
      setSessionsRequests(originalSessionRequests);
    }
  }
  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchStudentFromSessionRequests(searchStudent);
    }
  }

  async function acceptSessionRequests(requestId, studentId) {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/mentors/accept-sessions-request", { requestId, studentId })
      if (response.data.statusCode === 200) {
        setLoading(false)
        fetchSessionRequests();
      }

    } catch (error) {
      console.log("Error while accepting Session requets", error);
      setLoading(false)
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

  useEffect(() => {
    if (searchStudent === '') {
      setSessionsRequests(originalSessionRequests);
    }
  }, [searchStudent, originalSessionRequests]);


  useEffect(() => {
    fetchSessionRequests(pagination.currentPage)
  }, [pagination.currentPage])


  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
        <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
          <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Sessions Requests</span>
          <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
            <IoSearch onClick={() => searchStudentFromSessionRequests(searchStudent)} size={20} />
            <input type="text" value={searchStudent} onKeyDown={handlekeyDown} onChange={(e) => setSearchStudent(e.target.value)} placeholder='Search by username' className='outline-none h-auto w-full py-2' />
          </div>
        </div>
        <div className='w-full h-auto flex gap-2 mt-4 items-center text-xs lg:text-base'>
          <p className='w-full'><span className='font-semibold'>Note : </span>Click <span className=''>  <MdOutlineDone className='text-blue-500 inline ' /> </span>to accept the request. After accepting the request, chat with student to schedule the session. Mentors have 24 hours to approve session requests. If not approved within this time, the admin will automatically cancel the request. Only accept requests you intend to complete, as acceptance obligates you to deliver the session.</p>
        </div>
        <div className='w-full h-auto flex flex-col mt-4'>
          <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
            <span className='w-1/12 text-center'>S.No</span>
            <span className='w-4/12 text-center'>Package Name</span>
            <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
            <span className='w-4/12 text-center sm:w-4/12'>Student</span>
            <span className='w-1/12 text-center'></span>
          </div>
          {
            loading
              ? <Loading />
              : sessionRequests.length > 0
                ? sessionRequests.map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col font-cg-times justify-between p-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <div className='w-full h-auto flex justify-between text-xs lg:text-base items-center'>
                      <span className='w-1/12 text-center'>{index + 1}</span>
                      <span className='w-4/12 text-center'>{item.package.packageName}</span>
                      <span className='sm:w-4/12 sm:text-center hidden sm:block'>{item.status}</span>
                      <span className='w-4/12 text-center sm:w-4/12'>{item.student.username}</span>
                      <div className='w-1/12 text-center'><MdOutlineDone size={20} onClick={() => acceptSessionRequests(item._id, item.student._id)} className='text-blue-500 cursor-pointer' /></div>
                    </div>

                  </div>
                ))
                : <p className='p-4 text-center text-gray-500 h-80'>No Session Requests yet</p>
          }
        </div>
        {
          sessionRequests.length > 10 && (
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
  )
}

export default ApprovalSection