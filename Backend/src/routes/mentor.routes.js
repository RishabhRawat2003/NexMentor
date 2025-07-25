import Router from 'express'
import { allMentors, createAccount, createOrder, forgotPassword, mentorAcademicDetails, mentorDetails, mentorLogin, mentorLogout, removeMentorIfNotVerified, resendOtp, resetPassword, searchMentor, singleMentor, verifyOTP, verifyPayment } from '../controllers/mentor.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { acceptSessionRequests, changeCurrentPassword, changeStatusToCompleted, getAllActiveSessions, getAllCompletedSessions, getAllSessionRequests, logoutUser, notificationsRead, updateAccountDetails, updatePaymentDetails } from '../controllers/mentorDashboard.controller.js'
const router = Router()


router.route("/create-account").post(createAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/resend-otp").post(resendOtp)
router.route("/delete-mentor").post(removeMentorIfNotVerified)
router.route("/fill-academic-details").post(upload.fields([{ name: 'scoreCard' }, { name: 'studentId' }]), mentorAcademicDetails)
router.route("/login").post(mentorLogin)
router.route("/logout").post(verifyJWT, mentorLogout)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/create-order").post(createOrder)
router.route("/verify-payment").post(verifyPayment)
router.route('/all-mentors').get(allMentors)
router.route('/single-mentor').post(singleMentor)
router.route('/search-mentor').post(searchMentor)

//secure routes Dashboard routes
router.route("/mentor-details").post(verifyJWT, mentorDetails)
router.route('/all-sessions-requests').post(verifyJWT, getAllSessionRequests)
router.route('/accept-sessions-request').post(verifyJWT, acceptSessionRequests)
router.route('/all-active-sessions').post(verifyJWT, getAllActiveSessions)
router.route("/all-complete-sessions").post(verifyJWT, getAllCompletedSessions)
router.route('/accept-sessions-request').post(verifyJWT, acceptSessionRequests)
router.route("/change-status-completed").post(verifyJWT, upload.fields([{ name: 'imageOfProof' }]), changeStatusToCompleted)
router.route("/mentor-update-details").post(verifyJWT, upload.fields([{ name: 'profilePicture' }]), updateAccountDetails)
router.route("/mentor-logout").post(verifyJWT,logoutUser)
router.route("/change-current-password").post(verifyJWT,changeCurrentPassword)
router.route("/update-payment-details").post(verifyJWT,updatePaymentDetails)
router.route("/read-notifications").post(verifyJWT,notificationsRead)



export default router