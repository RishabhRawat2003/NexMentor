import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import Loading from '../utils/Loading';

function Students() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [totalStudents, setTotalStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [originalTotalStudents, setOriginalTotalStudents] = useState([])
  const [searchedStudent, setSearchedStudent] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalStudents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalStudents.length / itemsPerPage);

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

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function fetchTotalStudents() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/total-students")
      if (response.data.statusCode === 200) {
        setTotalStudents(response.data.data)
        setOriginalTotalStudents(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching Total Students", error);
      setLoading(false)
    }
  }

  function searchStudentFromTotalStudents(username2) {
    if (username2.length > 3) {
      const filteredTotalStudents = originalTotalStudents.filter(
        (username) => username.username === username2
      );
      setTotalStudents(filteredTotalStudents);
    } else if (username2 === '') {
      setTotalStudents(originalTotalStudents);
    }
  }

  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchStudentFromTotalStudents(searchedStudent);
    }
  }

  useEffect(() => {
    if (searchedStudent === '') {
      setTotalStudents(originalTotalStudents);
    }
  }, [searchedStudent, originalTotalStudents]);


  useEffect(() => {
    fetchTotalStudents()
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
            <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Students</span>
            <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
              <IoSearch onClick={() => searchStudentFromTotalStudents(searchedStudent)} size={20} />
              <input type="text" value={searchedStudent} onKeyDown={handlekeyDown} onChange={(e) => setSearchedStudent(e.target.value)} placeholder='Search by username' className='outline-none h-auto w-full py-2' />
            </div>
          </div>
          <table className="min-w-full overflow-x-scroll mt-4">
            <thead className="bg-[#9EDFFF63] border-b border-gray-300">
              <tr>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
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
                    {item?.username}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.currentClass ? item.currentClass : '--'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.gender ? item.gender : '--'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.number ? item.number : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            totalStudents.length > 15 && (
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

export default Students