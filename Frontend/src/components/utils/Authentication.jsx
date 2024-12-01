import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AiFillLinkedin } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Authentication() {
    const navigate = useNavigate()

    const handleLoginRedirect = () => {
        window.location.href = "http://localhost:8000/api/v1/students/auth/linkedin"; //change this later
    };

    const handleLoginSuccess = async (response) => {
        const idToken = response.credential;
        try {
            const res = await axios.post("/api/v1/students/google-auth", { idToken });
            if (res.data.statusCode === 200) {
                localStorage.setItem("userType", JSON.stringify("Student"))
                localStorage.setItem("userId", JSON.stringify(res.data.data._id))
                navigate('/search-mentor');
            }
        } catch (error) {
            console.error('Error sending ID token to backend:', error);
        }
    };

    const handleLoginFailure = (error) => {
        console.error('Login failed:', error);
    };

    return (
        <>
            <div className='w-full h-auto flex items-center justify-between mt-7'>
                <div className='w-[45%]'>
                    <GoogleOAuthProvider clientId={googleClientId}>
                        <div className='w-full h-10 bg-gray-300'>
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginFailure}
                                text="Sign In"
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>
                <div className='w-[45%] py-1 border-[1px] md:hover:bg-blue-50 active:bg-blue-50'>
                    <button className='flex items-center px-2 rounded-sm w-full h-7.5' onClick={handleLoginRedirect}>
                        <AiFillLinkedin size={30} className='text-blue-700' />
                        <p className='flex-1'>LinkedIn</p>
                    </button>
                </div>
            </div>
            <div className='h-auto mt-7 mx-4 flex items-center gap-3 justify-center'>
                <p className='w-full h-[1px] bg-gray-400'></p>
                <span className='w-[20%] text-xs text-gray-400 font-semibold text-center font-cg-times'>OR</span>
                <p className='w-full h-[1px] bg-gray-400'></p>
            </div>
        </>
    )
}

export default Authentication