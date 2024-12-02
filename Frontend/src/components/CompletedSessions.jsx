import React, { useEffect, useState } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Loading from './utils/Loading';
import axios from 'axios';
import { MdOutlineFeedback } from "react-icons/md";


const StarRating = ({ onRating }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (star) => {
    setRating(star);
    onRating(star);
  };

  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          ★
        </span>
      ))
      }
    </div >
  );
};

function CompletedSessions() {
  const [loading, setLoading] = useState(false)
  const [completedSessions, setCompletedSessions] = useState([])
  const [dropdown, setDropDown] = useState('')
  const [feedBackStatus, setFeedBackStatus] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedBackPopUp, setFeedBackPopUp] = useState(false)
  const [selectedMentorId, setSelectedMentorId] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
  });

  async function fetchCompletedSessions(page = 1) {
    try {
      setLoading(true)
      const response = await axios.post(`/api/v1/students/complete-sessions?page=${page}`)
      if (response.data.statusCode === 200) {
        setPagination(response.data.data.pagination)
        setCompletedSessions(response.data.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.log("error while fetching Purchases sessions", error);
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

  async function handleFeedback(id) {
    try {
      const response = await axios.post("/api/v1/students/is-feedback-given", { mentorId: id })
      console.log(response.data.data);

      setFeedBackStatus(response.data.data)
      setFeedBackPopUp(true)
      setSelectedMentorId(id)
    } catch (error) {
      console.log("error while fetching data about student Feedback", error);
    }
  }

  useEffect(() => {
    fetchCompletedSessions(pagination.currentPage)
  }, [pagination.currentPage])

  const submitFeedback = async () => {
    try {
      if (!feedBackStatus) {
        const response = await axios.post("/api/v1/students/give-feedback", { mentorId: selectedMentorId, rating: selectedRating })
        console.log(response.data);
      }
      setSelectedMentorId('')
      setFeedBackPopUp(false)
      setSelectedRating(0)

    } catch (error) {
      console.log("Error while submitting feedback", error);
      setFeedBackPopUp(false);
    }
  };

  return (
    <>
      {
        loading && <Loading />
      }
      {feedBackPopUp
        ? feedBackStatus
          ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-md w-80">
              <h2 className="text-center text-lg font-semibold">Thanks For Your Feedback</h2>
              <h2 className="text-center mt-2">For Details FeedBack click below</h2>
              <a href='https://forms.gle/5KwRw7cPaCj3dTAUA' target='_blank' className='text-center text-blue-500 font-cg-times'>Click here</a>
              <div className="flex justify-center mt-4">
                <button onClick={submitFeedback} className="px-4 py-2 bg-blue-500 text-white rounded-md">Ok</button>
              </div>
            </div>
          </div>
          : <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-md w-80">
              <h2 className="text-center text-lg font-semibold">Rate Your Session</h2>
              <StarRating onRating={(star) => setSelectedRating(star)} />
              <div className="flex justify-center mt-4">
                <button onClick={submitFeedback} className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
                <button onClick={() => { setFeedBackPopUp(false), setSelectedMentorId('') }} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md">Close</button>
              </div>
            </div>
          </div>
        : null
      }
      <div className='w-full h-auto flex flex-col gap-3 md:w-[60vw] lg:w-[80vw]'>
        <h1 className='font-cg-times text-2xl font-semibold'>Completed Sessions</h1>
        <div className='w-full h-auto min-h-80 max-h-[100vh] flex flex-col justify-between bg-gray-100 pb-3 gap-3 font-cg-times rounded-md sm:text-base md:text-lg lg:text-xl 2xl:h-[93vh]'>
          <div className='disable-scrollbar w-full h-auto overflow-y-scroll'>
            <div className='flex bg-[#9EDFFF63] font-cg-times justify-between p-2 text-xs border-b border-gray-300 rounded-t-md lg:text-base'>
              <span className='w-1/12 text-center'>S.No</span>
              <span className='w-4/12 text-center'>Package Name</span>
              <span className='sm:w-4/12 sm:text-center hidden sm:block'>Service Status</span>
              <span className='w-3/5 text-center sm:w-4/12'>Mentor</span>
              <span className='w-1/12 text-center block'></span>
              <span className='w-1/12 text-center hidden xl:block'></span>
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
                      <span className='w-4/12 text-center'>{item.package?.packageName}</span>
                      <span className='sm:w-4/12 sm:text-center hidden sm:block'>{item.status}</span>
                      <span className='w-3/5 text-center sm:w-4/12'>{item.mentor?.mentorId}</span>
                      <span onClick={() => handleFeedback(item.mentor._id)} className='w-1/12 text-center'><MdOutlineFeedback size={20} className={`${item.status === 'complete' ? 'cursor-pointer text-blue-500' : 'cursor-not-allowed'} `} /></span>
                      <span className='w-1/12 text-center hidden xl:block'>
                        {
                          dropdown === index
                            ? <FaAngleUp onClick={() => setDropDown('')} size={15} className='hidden xl:size-5 cursor-pointer xl:block' />
                            : <FaAngleDown onClick={() => setDropDown(index)} size={15} className='hidden xl:size-5 cursor-pointer xl:block' />
                        }
                      </span>
                    </div>
                    <div className='w-full h-auto flex flex-col justify-center items-center mt-2'>
                      <FaAngleDown onClick={() => setDropDown(index)} size={15} className={`${dropdown === index ? 'hidden' : 'block'} xl:size-5 cursor-pointer xl:hidden`} />
                      {
                        dropdown === index
                          ? <div className='w-full h-auto flex flex-col items-center mt-1 gap-2'>
                            <div className='w-full h-auto flex items-center justify-center'>
                              <span className='w-5 h-5 bg-[#0092DB] rounded-full'></span>
                              <span className=' bg-[#0092DB] w-[37%] h-[1px] sm:w-[44%] md:w-[42%] lg:w-[43%] xl:w-[45%]' ></span>
                              <span className='bg-[#0092DB] w-5 h-5 rounded-full'></span>
                              <span className='bg-[#0092DB] w-[37%] h-[1px] sm:w-[44%] md:w-[42%] lg:w-[43%] xl:w-[45%]' ></span>
                              <span className='w-5 h-5 bg-[#0092DB] rounded-full'></span>
                            </div>
                            <div className='w-full h-auto flex justify-between items-center text-xs lg:text-base'>
                              <span>Pending</span>
                              <span className='ml-3'>Active</span>
                              <span>Completed</span>
                            </div>
                          </div>
                          : null
                      }
                      <FaAngleUp onClick={() => setDropDown('')} size={15} className={`${dropdown === index ? 'block' : 'hidden'} xl:size-5 cursor-pointer xl:hidden`} />
                    </div>
                  </div>
                ))
                : <p className='p-4 text-center text-gray-500'>No Completed Session yet</p>
            }
          </div>
          {
            pagination.totalPages > 1
              ? <div className="w-full h-auto flex justify-center items-center my-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={pagination.currentPage === 1}
                  className={`px-2 py-1 mx-1 rounded-md text-white transition duration-300 
              ${pagination.currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  Previous
                </button>
                <span className="mx-4 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-2 py-1 mx-1 rounded-md text-white transition duration-300 
              ${pagination.currentPage === pagination.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  Next
                </button>
              </div>
              : null
          }
        </div>
      </div>
    </>
  )
}

export default CompletedSessions