import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { StarRating } from '../utils/StarRating';
import Loading from '../utils/Loading';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Mentors() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalMentors, setTotalMentors] = useState([])
  const [originalTotalMentors, setOriginalTotalMentors] = useState([]);
  const [searchedMentor, setSearchedMentor] = useState('')
  const [featuredMentors, setFeaturedMentors] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalMentors.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(totalMentors.length / itemsPerPage);

  const navigate = useNavigate()

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

  async function fetchTotalMentors() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/total-mentors")
      if (response.data.statusCode === 200) {
        setTotalMentors(response.data.data)
        setOriginalTotalMentors(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching Total Mentors", error);
      setLoading(false)
    }
  }

  async function featureSingleMentor(id) {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/feature-mentor", { mentorId: id })
      if (response.data.statusCode === 200) {
        navigate(0)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while Featuring Mentor", error);
      setLoading(false)
    }
  }

  function getData(e) {
    setFeaturedMentors(e.featuredMentors)
  }

  async function toggleStatus(mentorId) {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/toggle-status", { mentorId })
      if (response.data.statusCode === 200) {
        fetchTotalMentors()
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching Total Mentors", error);
      setLoading(false)
    }
  }

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  function searchMentorFromTotalMentors(mentorId) {
    if (mentorId.length > 3) {
      const filteredTotalMentors = originalTotalMentors.filter(
        (mentor) => mentor.mentorId === mentorId
      );
      setTotalMentors(filteredTotalMentors);
    } else if (mentorId === '') {
      setTotalMentors(originalTotalMentors);
    }
  }

  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchMentorFromTotalMentors(searchedMentor);
    }
  }

  useEffect(() => {
    if (searchedMentor === '') {
      setTotalMentors(originalTotalMentors);
    }
  }, [searchedMentor, originalTotalMentors]);

  useEffect(() => {
    fetchTotalMentors()
  }, [])

  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header getData={getData} handleStateChange={handleStateChange} />
        <div className={`${localSidebarState ? 'hidden' : 'flex'} w-[95%] mx-auto px-2 rounded-2xl my-8 min-h-[90vh] max-h-auto flex flex-col py-6 bg-white xl:px-5`}>
          <div className='w-full h-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center'>
            <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Mentors</span>
            <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
              <IoSearch onClick={() => searchMentorFromTotalMentors(searchedMentor)} size={20} />
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
                  Email
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ratings
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
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
                    {item?.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.address.state}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.address.city}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    <StarRating
                      rating={
                        item?.feedBack.length > 0
                          ? Math.round(item.feedBack.reduce((acc, item) => acc + item.rating, 0) / item.feedBack.length)
                          : 0
                      }
                    />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {
                      item?.activate === true
                        ? <span onClick={() => toggleStatus(item?._id)} className='cursor-pointer text-red-500 active:text-red-600 md:hover:text-red-600'>Deactivate</span>
                        : <span onClick={() => toggleStatus(item?._id)} className='cursor-pointer text-blue-500 active:text-blue-600 md:hover:text-blue-600'>Activate</span>
                    }
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center flex justify-center">
                    {
                      featuredMentors?.some(mentor => mentor.id === item._id)
                        ? <FaStar size={20} className='text-yellow-500 cursor-pointer' />
                        : <FaStar size={20} onClick={() => featureSingleMentor(item?._id)} className='text-gray-400 cursor-pointer active:text-yellow-500 md:hover:text-yellow-500' />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            totalMentors.length > 15 && (
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

export default Mentors