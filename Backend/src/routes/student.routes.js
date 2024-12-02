import Router from 'express'
import { allCompletedSessions, allPurchasedSessions, changeCurrentPassword, createOrder, createStudentAccount, forgotPassword, giveFeedBack, googleLogin, isFeedbackAlreadyGiven, linkdinRedirect, linkedinLogin, logoutUser, notificationsRead, removeStudentIfNotVerified, resendOtp, resetPassword, studentDetails, studentLogin, studentLogout, updateProfileDetails, verifyOTP, verifyPayment } from '../controllers/student.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
const router = Router()

//Routes for login and signup
router.route("/create-account").post(createStudentAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/resend-otp").post(resendOtp)
router.route("/delete-student").post(removeStudentIfNotVerified)
router.route("/login").post(studentLogin)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/google-auth").post(googleLogin)
router.route("/auth/linkedin").get(linkdinRedirect)
router.route("/auth/linkedin/callback").get(linkedinLogin)


//Secure routes
router.route("/logout").post(verifyJWT, studentLogout)
router.route("/student-details").post(verifyJWT, studentDetails)
router.route("/student-update-details").post(verifyJWT, upload.fields([{ name: 'profilePicture' }]), updateProfileDetails)
router.route("/create-order").post(verifyJWT, createOrder)
router.route("/verify-payment").post(verifyJWT, verifyPayment)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/purchased-sessions").post(verifyJWT, allPurchasedSessions)
router.route("/complete-sessions").post(verifyJWT, allCompletedSessions)
router.route("/give-feedback").post(verifyJWT, giveFeedBack)
router.route("/is-feedback-given").post(verifyJWT, isFeedbackAlreadyGiven)
router.route("/read-notifications").post(verifyJWT,notificationsRead)


export default router