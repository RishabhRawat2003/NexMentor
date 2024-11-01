import Router from 'express'
import { createAccount, createOrder, forgotPassword, mentorAcademicDetails, mentorDetails, mentorLogin, mentorLogout, resetPassword, verifyOTP, verifyPayment } from '../controllers/mentor.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
verifyJWT
const router = Router()


router.route("/create-account").post(createAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/fill-academic-details").post(mentorAcademicDetails)
router.route("/login").post(mentorLogin)
router.route("/mentor-details").post(verifyJWT, mentorDetails)
router.route("/logout").post(verifyJWT, mentorLogout)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/create-order").post(createOrder)
router.route("/verify-payment").post(verifyPayment)


export default router