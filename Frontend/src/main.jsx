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
import Wallet from './components/MentorDashboardComponent/Wallet.jsx'
import Updates from './components/MentorDashboardComponent/Updates.jsx'
import Help from './components/MentorDashboardComponent/Help.jsx'
import Admin from './Admin.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import ActiveSessions from './components/Admin/ActiveSessions.jsx'
import BlogPost from './components/Admin/BlogPost.jsx'
import AdminChangePassword from './components/Admin/ChangePassword.jsx'
import MentorApproval from './components/Admin/MentorApproval.jsx'
import Mentors from './components/Admin/Mentors.jsx'
import Payment from './components/Admin/Payment.jsx'
import AdminProfileSetting from './components/Admin/ProfileSetting.jsx'
import Students from './components/Admin/Students.jsx'
import AdminUpdates from './components/Admin/Updates.jsx'
import Webinars from './components/Admin/Webinars.jsx'
import AdminLogin from './components/Admin/Login.jsx'
import PendingSessions from './components/Admin/PendingSessions.jsx'
import ClearedPayment from './components/Admin/ClearedPayment.jsx'
import FeaturedMentors from './components/Admin/FeaturedMentors.jsx'
import AddTestimonial from './components/Admin/AddTestimonial.jsx'
import FeaturedAd from './components/Admin/FeaturedAd.jsx'
import BecameMentor from './components/BecameMentor.jsx'
import WebinarPage from './components/WebinarPage.jsx'
import BlogsPage from './components/BlogsPage.jsx'
import SingleBlogPage from './components/SingleBlogPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import TermsCondition from './components/TermsCondition.jsx'
import RefundPolicy from './components/RefundPolicy.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import AboutUs from './components/AboutUs.jsx'
import FaqMentor from './components/FaqMentor.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import FaqStudents from './components/FaqStudents.jsx'
import WhyChooseUsPage from './components/WhyChooseUsPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Homepage />} />
        <Route path='/student-profile/:id?' element={<StudentProfile />} />
        <Route path='/terms-condition' element={<TermsCondition />} />
        <Route path='/refund-policy' element={<RefundPolicy />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/faq-mentors' element={<FaqMentor />} />
        <Route path='/faq-students' element={<FaqStudents />} />
        <Route path='/why-choose-us' element={<WhyChooseUsPage />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/became-mentor' element={<BecameMentor />} />
        <Route path='/search-mentor' element={<SearchMentor />} />
        <Route path='/webinar-page' element={<WebinarPage />} />
        <Route path='/blogs-page' element={<BlogsPage />} />
        <Route path='/single-blog' element={<SingleBlogPage />} />
        <Route path='/single-mentor/:id' element={<SingleMentor />} />
        <Route path='/contact-us' element={<ContactPage />} />
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
        <Route path='/mentor-dashboard/wallet' element={<Wallet />} />
        <Route path='/mentor-dashboard/updates' element={<Updates />} />
        <Route path='/mentor-dashboard/help' element={<Help />} />
      </Route>
      <Route path='/admin-dashboard' element={<Admin />}>
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/admin-dashboard/pending-sessions' element={<PendingSessions />} />
        <Route path='/admin-dashboard/active-sessions' element={<ActiveSessions />} />
        <Route path='/admin-dashboard/blog-post' element={<BlogPost />} />
        <Route path='/admin-dashboard/featured-ad' element={<FeaturedAd />} />
        <Route path='/admin-dashboard/admin-change-password' element={<AdminChangePassword />} />
        <Route path='/admin-dashboard/mentor-approval' element={<MentorApproval />} />
        <Route path='/admin-dashboard/mentors' element={<Mentors />} />
        <Route path='/admin-dashboard/featured-mentors' element={<FeaturedMentors />} />
        <Route path='/admin-dashboard/payment' element={<Payment />} />
        <Route path='/admin-dashboard/cleared-payment' element={<ClearedPayment />} />
        <Route path='/admin-dashboard/admin-profile-setting' element={<AdminProfileSetting />} />
        <Route path='/admin-dashboard/students' element={<Students />} />
        <Route path='/admin-dashboard/admin-updates' element={<AdminUpdates />} />
        <Route path='/admin-dashboard/webinars' element={<Webinars />} />
        <Route path='/admin-dashboard/testimonial' element={<AddTestimonial />} />
      </Route>
      <Route path='/admin/login' element={<AdminLogin />} />
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
