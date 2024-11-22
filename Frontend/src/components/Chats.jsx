import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import ChatSingle from './ChatSingleStudent'

function Chats() {
    const [chattingToUser, setChattingToUser] = useState([])
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    async function getAllConversations() {
        try {
            setLoading(true)
            const response = await axios.post('/api/v1/message/all-conversations-students')
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
        <div className='w-full h-auto flex flex-col gap-3 md:w-[50vw]'>
            <h1 className='font-cg-times text-2xl font-semibold'>Chats</h1>
            <div className='disable-scrollbar w-full h-[80vh] flex flex-col bg-gray-100 p-3 gap-3 text-sm rounded-md sm:text-base md:text-lg lg:text-xl md:gap-6 overflow-y-scroll'>
                {
                    chattingToUser?.map((mentors, index) => (
                        <NavLink to={`/student-profile/${mentors._id}`} className={`${id ? 'hidden xl:flex' : 'flex xl:flex'} w-full h-auto p-3 shadow-sm cursor-pointer active:bg-gray-50 md:hover:bg-gray-50`} key={index}>
                            <div className='w-16 h-auto'>
                                <img src={mentors.profilePicture} alt="profile picture" className='rounded-full border-[1px] border-blue-500' />
                            </div>
                            <div className='h-auto flex-1 flex flex-col px-2 xl:px-4'>
                                <span className='font-cg-times md:text-lg'>{mentors.mentorId}</span>
                                <span className={`${mentors._id !== mentors.lastMessage.receiverId ? mentors.lastMessage.read ? 'text-gray-500' : 'text-blue-500 font-semibold' : null} mt-3 text-sm md:mt-2 md:text-base `} >{mentors.lastMessage.message}</span>
                            </div>
                        </NavLink>
                    ))
                }
                {window.innerWidth < 1280 && id && <ChatSingle />}
            </div>
        </div>
    )
}

export default Chats