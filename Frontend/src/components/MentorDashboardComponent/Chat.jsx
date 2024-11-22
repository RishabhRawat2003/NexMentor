import React, { useEffect, useState } from 'react'
import Header from './Header'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import ChatSingle from './ChatSingle';
import axios from 'axios';
import Loading from '../utils/Loading';

function Chat() {
  const [chattingToUser, setChattingToUser] = useState([])
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  async function getAllConversations() {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/message/all-conversations')
      if (response.data.statusCode === 200) setChattingToUser(response.data.data)
      setLoading(false)
    } catch (error) {
      console.log("Error occured while fetching all coversations", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllConversations()
  }, [])


  return (
    <>
      {
        loading && <Loading />
      }
      <div className='w-full h-auto flex flex-col bg-[#F4F4F4] lg:w-[70%] xl:w-[75%] 2xl:w-[80%]'>
        <Header />
        <div className='w-full h-auto flex justify-center gap-3 2xl:gap-20'>
          <div className='w-full h-screen flex flex-col px-5 sm:w-[60%] mx-auto lg:w-[70%] xl:w-[50%] xl:mx-0 2xl:w-[40%]'>
            <h1 className='text-2xl font-semibold font-cg-times my-4 lg:text-3xl'>Conversations</h1>
            <div className='w-full h-auto flex flex-col gap-4'>
              <input type="text" placeholder='Search by username' className='w-[95%] mx-auto rounded-md py-2 outline-none px-3 bg-[#F4F4F4] border-[1px] border-gray-400' />
              <div className='disable-scrollbar w-full h-[80vh] rounded-md lg:mt-4 bg-white flex flex-col overflow-y-scroll'>
                {
                  chattingToUser?.map((students, index) => (
                    <NavLink to={`/mentor-dashboard/chat/${students._id}`} className={`${id ? 'hidden xl:flex' : 'flex xl:flex'} w-full h-auto p-3 shadow-sm cursor-pointer active:bg-gray-50 md:hover:bg-gray-50`} key={index}>
                      <div className='w-20 h-auto'>
                        <img src={students.profilePicture} alt="profile picture" className='rounded-full' />
                      </div>
                      <div className='h-auto flex-1 flex flex-col px-2'>
                        <span className='font-cg-times md:text-lg'>{students.username}</span>
                        <span className={`${students._id !== students.lastMessage.receiverId ? students.lastMessage.read ? 'text-gray-500' : 'text-blue-500 font-semibold' : null} mt-3 text-sm md:mt-2 md:text-base `}>{students.lastMessage.message}</span>
                      </div>
                    </NavLink>
                  ))
                }
                {window.innerWidth < 1280 && id && <ChatSingle />}
              </div>
            </div>
          </div>
          {
            id && (
              <div className='hidden xl:flex xl:flex-col xl:items-center xl:w-[45%] 2xl:w-[40%]'>
                <div className='w-full h-[600px] rounded-3xl overflow-hidden border-[1px] border-gray-400 mt-20'>
                  {window.innerWidth > 1280 && id && <ChatSingle />}
                </div>
              </div>
            )
          }
        </div>

      </div>
    </>
  )
}

export default Chat