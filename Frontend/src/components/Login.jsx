import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Login() {

  const handleLoginSuccess = async (response) => {
    const idToken = response.credential;

    try {
      const res = await axios.post("/api/v1/students/google-auth", { idToken })
      console.log(res.data);

    } catch (error) {
      console.error('Error sending ID token to backend:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className='w-full h-10 bg-gray-300'>
        <h1>Google Login</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login