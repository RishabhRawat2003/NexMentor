import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import Loading from '../utils/Loading';

function MentorApproval() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [approvalRequests, setApprovalRequests] = useState([])
  const [originalApprovalRequests, setOriginalApprovalRequests] = useState([]);
  const [searchedMentor, setSearchedMentor] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = approvalRequests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(approvalRequests.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function fetchApprovalRequests() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/approval-requests")
      if (response.data.statusCode === 200) {
        setApprovalRequests(response.data.data);
        setOriginalApprovalRequests(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching Approval requests", error);
      setLoading(false)
    }
  }

  async function acceptApprovalRequest(mentorId) {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/accept-approval", { mentorId })
      if (response.data.statusCode === 200) {
        setLoading(false)
        fetchApprovalRequests()
      }
    } catch (error) {
      console.log("Error while acception mentor approval request", error);
      setLoading(false)
    }
  }

  async function removeApprovalRequest(mentorId) {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/remove-approval", { mentorId })
      if (response.data.statusCode === 200) {
        setLoading(false)
        fetchApprovalRequests()
      }
    } catch (error) {
      console.log("Error while rejecting mentor approval request", error);
      setLoading(false)
    }
  }

  function searchMentorFromApprovalRequests(mentorId) {
    if (mentorId.length > 3) {
      const filteredApprovalRequests = originalApprovalRequests.filter(
        (mentor) => mentor.firstName.toLowerCase() === mentorId.toLowerCase()
      );
      setApprovalRequests(filteredApprovalRequests);
    } else if (mentorId === '') {
      setApprovalRequests(originalApprovalRequests);
    }
  }

  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchMentorFromApprovalRequests(searchedMentor);
    }
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
      second: "2-digit",
      hour12: true,
    });
  }

  useEffect(() => {
    if (searchedMentor === '') {
      setApprovalRequests(originalApprovalRequests);
    }
  }, [searchedMentor, originalApprovalRequests]);

  useEffect(() => {
    fetchApprovalRequests()
  }, [])

  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[98%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-0`}>
          <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center xl:px-5'>
            <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Mentors Verification request</span>
            <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
              <IoSearch onClick={() => searchMentorFromApprovalRequests(searchedMentor)} size={20} />
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
                  First Name
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Neet Score
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institute
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Card
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Id
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Date
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    {item?.firstName}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.lastName}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.address.state}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.address.city}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.neetScore}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.institute}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    <span onClick={() => handleViewImage(item?.scoreCard)} className='text-blue-500 underline cursor-pointer'>View</span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    <span onClick={() => handleViewImage(item?.studentId)} className='text-blue-500 underline cursor-pointer'>View</span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.gender}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.number}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {convertToIST(item?.createdAt)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    <span onClick={() => acceptApprovalRequest(item._id)} className='text-blue-500 mr-4 active:text-blue-600 md:hover:text-blue-600 cursor-pointer active:underline md:hover:underline'>Approve</span>
                    <span onClick={() => removeApprovalRequest(item._id)} className='text-red-500 active:text-red-600 md:hover:text-red-600 cursor-pointer active:underline md:hover:underline'>Reject</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            approvalRequests.length > 15 && (
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

export default MentorApproval