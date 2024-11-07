import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './otherCss.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import Homepage from './components/Homepage.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import store from './components/store/store.js'
import MentorSignup from './components/MentorSignup.jsx'
import MentorSignupSuccess from './components/MentorSignupSuccess.jsx'
import ResetLink from './components/ResetLink.jsx'
import StudentProfile from './components/StudentProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/student-profile' element={<StudentProfile />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/login/forgot-password' element={<ForgotPassword />} />
      <Route path='/login/forgot-password/resetPassword/:token' element={<ResetLink />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signup/mentor-signup' element={<MentorSignup />} />
      <Route path='/signup/mentor-signup/mentor-signup-success' element={<MentorSignupSuccess />} />
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
