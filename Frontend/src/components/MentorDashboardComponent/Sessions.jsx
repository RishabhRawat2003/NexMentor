import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import { MdOutlineDone } from "react-icons/md";
import Loading from '../utils/Loading';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom'

function Sessions() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [originalActiveSessions, setOriginalActiveSessions] = useState([]);
  const [searchStudent, setSearchStudent] = useState('')
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [completePopUp, setCompletePopUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('')
  const [singleRequestData, setSingleRequestData] = useState({
    requestId: '',
    studentId: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMentors: 0,
  });

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function fetchActiveSessions(page = 1) {
    try {
      setLoading(true)
      const response = await axios.post(`/api/v1/mentors/all-active-sessions?page=${page}`)
      if (response.data.statusCode === 200) {
        setActiveSessions(response.data.data.data)
        setOriginalActiveSessions(response.data.data.data);
        setPagination(response.data.data.pagination)
        setLoading(false)
      }

    } catch (error) {
      console.log("Error while fetching Active Sessions", error);
      setLoading(false)
    }
  }

  function searchStudentFromActiveSessions(studentId) {
    if (studentId.length > 3) {
      const filteredActiveSessions = originalActiveSessions.filter(
        // [CHANGED] Use originalCompletedSessions for filtering
        (session) => session.student.username === studentId
      );
      setActiveSessions(filteredActiveSessions);
    } else if (studentId === '') {
      // [ADDED] Reset to original sessions when search input is cleared
      setActiveSessions(originalActiveSessions);
    }
  }
  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchStudentFromActiveSessions(searchStudent);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file)
    }
  };

  function handleCompleted(requestId, studentId) {
    setCompletePopUp(true)
    setSingleRequestData({
      requestId,
      studentId
    })
  }

  function onClose() {
    setCompletePopUp(false)
    setSingleRequestData({
      requestId: '',
      studentId: ''
    })
    setSelectedImage(null)
  }

  async function markAsCompleted() {
    try {
      setLoading(true)
      if (!selectedImage) setErrorMsg("Image is required")
      const formData = new FormData();
      formData.append("imageOfProof", selectedImage);
      formData.append("requestId", singleRequestData.requestId);
      formData.append("studentId", singleRequestData.studentId);
      const response = await axios.post("/api/v1/mentors/change-status-completed", formData)
      // console.log(response.data);

      if (response.data.statusCode === 200) {
        fetchActiveSessions()
        setCompletePopUp(false)
        setSelectedImage(null)
        setLoading(false)
        setSingleRequestData({
          requestId: '',
          studentId: ''
        })
      }
    } catch (error) {
      console.log("error while marking as completed", error);
      setLoading(false)
      setTimeout(() => {
        setErrorMsg('')
      }, 3000);
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
      setActiveSessions(originalActiveSessions);
    }
  }, [searchStudent, originalActiveSessions]);

  useEffect(() => {
    fetchActiveSessions(pagination.currentPage)
  }, [pagination.currentPage])

  return (
    <>
      {
        loading
          ? <Loading />
          : <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
            <Header handleStateChange={handleStateChange} />
            <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] min-h-[90vh] mx-auto px-2 rounded-2xl my-8 max-h-[90vh] h-80 flex flex-col py-6 bg-white xl:px-5`}>
              <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
                <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Active Sessions</span>
                <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
                  <IoSearch onClick={() => searchStudentFromActiveSessions(searchStudent)} size={20} />
                  <input type="text" value={searchStudent} onKeyDown={handlekeyDown} onChange={(e) => setSearchStudent(e.target.value)} placeholder='Search by username' className='outline-none h-auto w-full py-2' />
                </div>
              </div>
              <div className='w-full h-auto flex gap-2 mt-4 items-center text-xs lg:text-base'>
                <p><span className='font-semibold'>Note : </span>Use the in-built chat system to finalize the meeting time and share the meeting link. Take screenshots during the session as proof and upload them before marking the session as completed.</p>
              </div>
              <div className='w-full h-auto flex flex-col mt-4'>
                <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
                  <span className='w-1/12 text-center'>S.No</span>
                  <span className='w-4/12 text-center'>Package Name</span>
                  <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
                  <span className='w-4/12 text-center sm:w-4/12'>Student</span>
                  <span className='w-1/12 text-center'></span>
                  <span className='w-1/12 text-center'></span>
                </div>
                {
                  activeSessions.length > 0
                    ? activeSessions.map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col font-cg-times justify-between p-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                      >
                        <div className='w-full h-auto flex justify-between text-xs lg:text-base items-center'>
                          <span className='w-1/12 text-center'>{index + 1}</span>
                          <span className='w-4/12 text-center'>{item.package.packageName}</span>
                          <span className='sm:w-4/12 sm:text-center hidden sm:block'>{item.status}</span>
                          <span className='w-4/12 text-center sm:w-4/12'>{item.student.username}</span>
                          <div className='w-1/12 text-center'><MdOutlineDone onClick={() => handleCompleted(item._id, item.student._id)} size={20} className='text-blue-500 cursor-pointer md:hover:text-blue-700 active:text-blue-700' /></div>
                          <NavLink to={`/mentor-dashboard/chat/${item.student._id}`} className='w-1/12 text-center'><IoChatboxEllipsesOutline className='text-blue-500 md:size-5 cursor-pointer md:hover:text-blue-700 active:text-blue-700' size={15} /></NavLink>
                        </div>

                      </div>
                    ))
                    : <p className='p-4 text-center text-gray-500 h-80'>No Active Sessions yet</p>
                }
              </div>
              {
                activeSessions.length > 10 && (
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

      {completePopUp && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[330px] h-auto bg-white rounded-lg shadow-lg relative sm:w-[400px] md:w-[450px] lg:w-[600px]">
            <div className="p-4 pt-8">
              <h2 className="text-sm font-semibold text-center sm:text-base md:text-lg xl:text-2xl">Provide Proof to Complete the Session</h2>
              <p className="text-gray-600 text-xs text-center mt-2 sm:text-sm md:text-base">
                Dear Mentor, to mark this active session as completed, you must upload an image as proof of conducting the session. If the session has not taken place and a student reports it, we may initiate legal action against you as per our policies. Please ensure the session is genuinely conducted before marking it as complete.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 mb-3">
              <label
                htmlFor="image"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <p className="text-sm text-gray-700 mt-2">
                  {selectedImage.name}
                </p>
              )}

              <p className="text-sm text-red-400 mt-2">
                {errorMsg}
              </p>

            </div>
            <div className="w-full h-auto flex flex-col justify-end items-center gap-4 p-4 border-t">
              <button
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={markAsCompleted}
              >
                Mark as Completed
              </button>
              <button
                className="py-2 w-full bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sessions