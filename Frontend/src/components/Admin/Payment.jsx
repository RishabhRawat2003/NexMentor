import React, { useEffect, useState } from 'react'
import Header from './Header'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import Loading from '../utils/Loading';
import { MdOutlineDone } from "react-icons/md";

function Payment() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payoutMentors, setPayoutMentors] = useState([])
  const [originalPayoutMentors, setOriginalPayoutMentors] = useState([])
  const [searchedMentor, setSearchedMentor] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [completePopUp, setCompletePopUp] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('')
  const [mentorID, setMentorID] = useState('')
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payoutMentors.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(payoutMentors.length / itemsPerPage);

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

  async function fetchPayoutStudents() {
    try {
      setLoading(true)
      const response = await axios.post("/api/v1/admin/total-mentors")
      if (response.data.statusCode === 200) {
        const allMentors = response.data.data;
        const onlyMentorsWithWalletAmount = allMentors.filter((mentor) => mentor.wallet > 0);
        setPayoutMentors(onlyMentorsWithWalletAmount)
        setOriginalPayoutMentors(onlyMentorsWithWalletAmount)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error while fetching Total Payout Mentors", error);
      setLoading(false)
    }
  }

  function handleCompleted(mentorId) {
    setCompletePopUp(true)
    setMentorID(mentorId)
  }

  function onClose() {
    setCompletePopUp(false)
    setMentorID('')
    setSelectedImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file)
    }
  };

  async function clearedPaymentAmount() {
    try {
      setLoading(true)
      if (!selectedImage) setErrorMsg("Image is required")
      const formData = new FormData();
      formData.append("imageOfProof", selectedImage);
      formData.append("mentorID", mentorID);

      const response = await axios.post("/api/v1/admin/clear-payment", formData)

      if (response.data.statusCode === 200) {
        fetchPayoutStudents()
        setCompletePopUp(false)
        setSelectedImage(null)
        setLoading(false)
        setMentorID('')
      }
    } catch (error) {
      console.log("error while Clearing payment", error);
      setLoading(false)
      setTimeout(() => {
        setErrorMsg('')
      }, 3000);
    }
  }

  function searchMentors(mentorId) {
    if (mentorId.length > 3) {
      const filteredTotalMentors = originalPayoutMentors.filter(
        (mentor) => mentor.mentorId === mentorId
      );
      setPayoutMentors(filteredTotalMentors);
    } else if (mentorId === '') {
      setPayoutMentors(originalPayoutMentors);
    }
  }

  function handlekeyDown(event) {
    if (event.key === "Enter") {
      searchMentors(searchedMentor);
    }
  }

  useEffect(() => {
    if (searchedMentor === '') {
      setPayoutMentors(originalPayoutMentors);
    }
  }, [searchedMentor, originalPayoutMentors]);


  useEffect(() => {
    fetchPayoutStudents()
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
            <span className='text-2xl font-[poppins] font-semibold xl:text-3xl'>Total Payout Mentors</span>
            <div className='border-[1px] border-[#979797] w-auto h-auto px-3 flex items-center gap-3 rounded-xl'>
              <IoSearch onClick={() => searchMentors(searchedMentor)} size={20} />
              <input type="text" value={searchedMentor} onKeyDown={handlekeyDown} onChange={(e) => setSearchedMentor(e.target.value)} placeholder='Search by MentorID' className='outline-none h-auto w-full py-2' />
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
                  Payment Method
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Holder Name
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IFSC Code
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Info
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clear
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
                    {item?.paymentDetails.paymentMethod}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.paymentDetails.paymentMethod === 'Bank' ? item?.paymentDetails.accountHolderName : '--'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.paymentDetails.paymentMethod === 'Bank' ? item?.paymentDetails.ifscCode : '--'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    {item?.paymentDetails.paymentInfo}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    ₹{item?.wallet}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                    <MdOutlineDone onClick={() => handleCompleted(item._id)} size={20} className='text-blue-500 cursor-pointer md:hover:text-blue-700 active:text-blue-700' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            payoutMentors.length > 15 && (
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
      {completePopUp && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[330px] h-auto bg-white rounded-lg shadow-lg relative sm:w-[400px] md:w-[450px] lg:w-[600px]">
            <div className="p-4 pt-8">
              <h2 className="text-sm font-semibold text-center sm:text-base md:text-lg xl:text-2xl">Provide Proof of Cleared Amount</h2>
              <p className="text-gray-600 text-xs text-center mt-2 sm:text-sm md:text-base">
                Dear Admin,We are writing to confirm that the wallet amount has been cleared and transferred to their provided payment method. To maintain proper records and ensure compliance with our processes, please upload proof of the payment clearance.
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
                onClick={clearedPaymentAmount}
              >
                Mark as Cleared
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

export default Payment