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
import SearchMentor from './components/SearchMentor.jsx'
import SingleMentor from './components/SingleMentor.jsx'
import MentorDashboard from './components/MentorDashboardComponent/MentorDashboard.jsx'
import Mentor from './Mentor.jsx'
import ApprovalSection from './components/MentorDashboardComponent/ApprovalSection.jsx'
import ChangePassword from './components/MentorDashboardComponent/ChangePassword.jsx'
import Notifications from './components/MentorDashboardComponent/Notifications.jsx'
import Chat from './components/MentorDashboardComponent/Chat.jsx'
import ProfileSetting from './components/MentorDashboardComponent/ProfileSetting.jsx'
import Referals from './components/MentorDashboardComponent/Referals.jsx'
import Sessions from './components/MentorDashboardComponent/Sessions.jsx'
import Withdrawal from './components/MentorDashboardComponent/Withdrawal.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/student-profile/:id?' element={<StudentProfile />} />
        <Route path='/search-mentor' element={<SearchMentor />} />
        <Route path='/single-mentor/:id' element={<SingleMentor />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/login/forgot-password' element={<ForgotPassword />} />
      <Route path='/login/forgot-password/resetPassword/:token' element={<ResetLink />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signup/mentor-signup' element={<MentorSignup />} />
      <Route path='/signup/mentor-signup/mentor-signup-success' element={<MentorSignupSuccess />} />
      <Route path='/mentor-dashboard' element={<Mentor />}>
        <Route path='/mentor-dashboard' element={<MentorDashboard />} />
        <Route path='/mentor-dashboard/approval-section' element={<ApprovalSection />} />
        <Route path='/mentor-dashboard/change-password' element={<ChangePassword />} />
        <Route path='/mentor-dashboard/chat/:id?' element={<Chat />} />
        <Route path='/mentor-dashboard/notifications' element={<Notifications />} />
        <Route path='/mentor-dashboard/profile-setting' element={<ProfileSetting />} />
        <Route path='/mentor-dashboard/referals' element={<Referals />} />
        <Route path='/mentor-dashboard/sessions' element={<Sessions />} />
        <Route path='/mentor-dashboard/withdrawal' element={<Withdrawal />} />
      </Route>
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
