import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import io from "socket.io-client";
import { BsArrowRight } from "react-icons/bs";
import { FcGallery } from "react-icons/fc";
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import Loading from '../utils/Loading';

const server = import.meta.env.VITE_SERVER

function ChatSingle() {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messageDivRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState({
        username: '',
        profilePicture: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("userId"));
    const participantType = JSON.parse(localStorage.getItem("userType"))

    function handleBack() {
        navigate('/mentor-dashboard/chat')
    }

    async function handleSubmitMessage() {
        try {
            const response = await axios.post(`/api/v1/message/send/${id}`, { message, participantType });
            setMessage('');
            setMessages((prevMessages) => [...prevMessages, response.data.data]);
            setTimeout(() => {
                messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
            }, 200);
        } catch (error) {
            console.error('Error while sending message', error);
        }
    }

    async function fetchUserDetails() {
        try {
            setLoading(true)
            const details = { searchedUserId: id };
            const response = await axios.post('/api/v1/message/searched-user-details', details);
            const { username, profilePicture } = response.data.data;
            setUserData({ username, profilePicture });
            setLoading(false)
        } catch (error) {
            console.log("Error while fetching user details", error);
            setLoading(false)
        }
    }

    async function fetchPreviousMessages() {
        try {
            setLoading(true)
            const response = await axios.get(`/api/v1/message/${id}`);
            setMessages(response.data.data);
            setLoading(false)

        } catch (error) {
            console.log("Error while fetching previous messages", error);
            setLoading(false)

        }
    }

    async function messageRead() {
        try {
            const response = await axios.post(`/api/v1/message/read-message/${id}`)
        } catch (error) {
            console.log("Error while reading message", error);
        }
    }


    useEffect(() => {
        fetchUserDetails();
        fetchPreviousMessages();
        messageRead()
        setTimeout(() => {
            messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
        }, 300);
    }, [id]);


    useEffect(() => {
        if (currentUser) {
            const socketInstance = io(server, {
                query: {
                    userId: currentUser,
                },
            });

            setSocket(socketInstance);

            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketInstance.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [currentUser, server]);

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setTimeout(() => {
                messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
            }, 300);
        });

        return () => socket.off("newMessage");
    }, [socket]);


    return (
        <>
            {
                loading && <Loading />
            }
            <div className='w-full h-full flex flex-col relative'>
                <div className='w-full flex justify-between items-center border-b-2 border-black p-3'>
                    <div className='flex gap-4 items-center'>
                        <img
                            src={userData.profilePicture}
                            alt="profile Image"
                            className='w-8 h-8 2xl:w-10 2xl:h-10 bg-gray-200 rounded-full'
                        />
                        <span className='font-semibold'>{userData.username}</span>
                    </div>
                    <BsArrowRight size={25} className='ml-3 cursor-pointer xl:hidden' onClick={handleBack} />
                </div>

                <div ref={messageDivRef} className='w-full flex-grow overflow-y-auto p-3 scrollbar-none disable-scrollbar'>
                    {
                        messages?.map((user, index) => (
                            user.senderId !== id
                                ? <div key={index} className='w-full flex justify-end mt-3'>
                                    <div className='w-auto rounded-full bg-blue-500 text-white flex items-center px-4 py-2 mr-2'>
                                        {user.message}
                                    </div>
                                </div>
                                : <div key={index} className='w-full flex mt-3'>
                                    <div className='w-auto rounded-full bg-gray-200 flex items-center px-4 py-2 ml-2'>
                                        {user.message}
                                    </div>
                                </div>
                        ))
                    }
                </div>

                <div className='w-full bg-white p-4'>
                    <div className='w-[90%] h-12 border-[1px] border-black rounded-3xl mx-auto flex p-2'>
                        <div className='p-1.5 rounded-full bg-gray-200 flex items-center cursor-pointer'>
                            <FcGallery size={20} />
                        </div>
                        <div className='flex-1 px-3'>
                            <input
                                type="text"
                                placeholder='Message...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' ? handleSubmitMessage() : null}
                                className='w-full h-full px-1 outline-none'
                            />
                        </div>
                        <div className='p-1.5 rounded-full bg-gray-200 flex items-center cursor-pointer'>
                            <span onClick={handleSubmitMessage} >
                                <IoMdSend size={20} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatSingle