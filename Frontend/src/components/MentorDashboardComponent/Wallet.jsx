import React, { useState } from 'react'
import Header from './Header'
import { LuIndianRupee } from "react-icons/lu";
import axios from 'axios'

function Wallet() {
  const [localSidebarState, setLocalSidebarState] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bank')
  const [info, setInfo] = useState('')
  const [accountDetails, setAccountDetails] = useState({
    accountHolderName: '',
    ifscCode: ''
  })
  const [userData, setUserData] = useState({})

  const paymentMethods = ["Bank", "Google Pay", "Paytm", "PhonePe"]

  function getUserData(data) {
    setUserData(data)
  }

  function handlePayment(item) {
    setSelectedPaymentMethod(item)
    setInfo('')
  }

  function handleStateChange() {
    setLocalSidebarState((prev) => !prev)
  }

  async function updateDetails() {
    try {
      const response = await axios.post("/api/v1/mentors/update-payment-details", { paymentMethod: selectedPaymentMethod, paymentInfo: info, accountHolderName: accountDetails.accountHolderName, ifscCode: accountDetails.ifscCode })
      if (response.data.statusCode === 200) {
        alert("Payment details updated successfully")
        setInfo('')
        setAccountDetails({ accountHolderName: '', ifscCode: '' })
      }
    } catch (error) {
      console.log("Error while updating details", error);
    }
  }


  return (
    <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
      <Header getData={getUserData} handleStateChange={handleStateChange} />
      <div className={`${localSidebarState ? 'hidden' : 'flex flex-col'} w-[95%] h-auto mx-auto px-4 rounded-2xl my-8 py-6 bg-white xl:px-5 md:w-[60%]`}>
        <h1 className='w-full h-auto font-cg-times text-xl font-semibold lg:text-2xl'>Wallet</h1>
        <div className='w-full h-auto flex justify-end items-center font-cg-times'>
          <div className='flex gap-2 items-center px-6 py-2 bg-yellow-200 rounded-2xl lg:py-3 lg:gap-4'>
            <span className='p-1 bg-yellow-500 rounded-full'><LuIndianRupee size={20} /></span>
            <span className=''>Wallet : ₹ {userData?.wallet}</span>
          </div>
        </div>
        <div className='w-full h-auto flex flex-col font-cg-times'>
          <p className='font-semibold'>Note :</p>
          <p className='w-full h-auto mt-4 text-sm md:text-base'>1. You have earned a total of ₹ {userData?.wallet} in your wallet.</p>
          <p className='w-full h-auto mt-3 text-sm md:text-base'>2. To transfer your earnings, please provide your payment details. We support the following methods: Bank Account Number, Paytm, Google Pay, PhonePe</p>
          <p className='w-full h-auto mt-3 text-sm md:text-base'>3. Your wallet funds will be transferred to your chosen payment method on every month 5th.</p>
          <p className='w-full h-auto mt-3 text-sm md:text-base'>4. Once the transfer is complete, you will receive a notification confirming the transaction.</p>
          <p className='w-full h-auto mt-3 text-sm md:text-base'>5. If you have any questions or issues, feel free to contact our support team.</p>
          <p className='w-full h-auto mt-3 text-sm md:text-base'>6. If you have already updated your payment details, you can skip this step and if you still do that then your previous payment details will be overridden.</p>
        </div>
        <div className='w-full h-auto flex flex-col mt-10'>
          <div className='w-full h-auto flex flex-wrap justify-center items-center gap-2 xl:gap-4'>
            {
              paymentMethods.map((item, index) => (
                <span key={index} onClick={() => handlePayment(item)} className={`${selectedPaymentMethod === item ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-5 py-2  rounded-xl text-sm xl:text-base cursor-pointer font-cg-times `}>{item}</span>
              ))
            }
          </div>
          <div className='w-full h-auto flex flex-col mt-10 gap-3 mb-7'>
            {
              selectedPaymentMethod === 'Bank' && (<div className='w-full h-auto flex flex-col items-center gap-3 md:flex-row'>
                <div className='w-full h-auto flex flex-col gap-3 md:w-[48%]'>
                  <label htmlFor="holderName" className='font-cg-times xl:text-lg'>Account Name</label>
                  <input type="text" value={accountDetails.accountHolderName} onChange={(e) => setAccountDetails({ ...accountDetails, accountHolderName: e.target.value })} placeholder='Account Holder Name' id='holderName' className='outline-none px-2 py-2 border-[1px] border-gray-200' />
                </div>
                <div className='w-full h-auto flex flex-col gap-3 md:w-[48%]'>
                  <label htmlFor="ifsc" className='font-cg-times xl:text-lg'>IFSC Code</label>
                  <input type="text" value={accountDetails.ifscCode} onChange={(e) => setAccountDetails({ ...accountDetails, ifscCode: e.target.value })} placeholder='Enter IFSC Code' id='ifsc' className='outline-none px-2 py-2 border-[1px] border-gray-200' />
                </div>
              </div>)
            }
            <div className='w-full h-auto flex flex-col gap-3'>
              <label htmlFor="bank" className='font-cg-times xl:text-lg'>
                {
                  selectedPaymentMethod === 'Bank'
                    ? 'Account Number'
                    : selectedPaymentMethod === 'Google Pay'
                      ? 'Google Pay'
                      : selectedPaymentMethod === 'Paytm'
                        ? 'Paytm'
                        : selectedPaymentMethod === 'PhonePe'
                          ? 'PhonePe'
                          : null
                }
              </label>
              <input type="text"
                placeholder={
                  selectedPaymentMethod === 'Bank'
                    ? 'XXXX XXXX XXXX XXXX'
                    : selectedPaymentMethod === 'Google Pay'
                      ? 'mobile_number@upi'
                      : selectedPaymentMethod === 'Paytm'
                        ? 'mobile_number@paytm'
                        : selectedPaymentMethod === 'PhonePe'
                          ? 'mobile_number@ybl'
                          : null
                }
                id='bank'
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                className='outline-none px-2 py-2 border-[1px] border-gray-200' />
            </div>
            <div className='w-full h-auto flex justify-center items-center mt-4'>
              <button onClick={updateDetails} className='px-5 py-2 bg-blue-500 text-white font-semibold font-cg-times rounded-md'>Update Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet