import Router from 'express'
import { allMentors, createAccount, createOrder, forgotPassword, mentorAcademicDetails, mentorDetails, mentorLogin, mentorLogout, removeMentorIfNotVerified, resendOtp, resetPassword, searchMentor, singleMentor, verifyOTP, verifyPayment } from '../controllers/mentor.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
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

//secure routes 
router.route("/mentor-details").post(verifyJWT, mentorDetails)


export default router