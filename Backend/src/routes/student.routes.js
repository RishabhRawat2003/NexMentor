import Router from 'express'
import { createStudentAccount, forgotPassword, googleLogin, linkdinRedirect, linkedinLogin, resetPassword, studentDetails, studentLogin, studentLogout, verifyOTP } from '../controllers/student.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
const router = Router()


router.route("/create-account").post(createStudentAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/login").post(studentLogin)
router.route("/student-details").post(verifyJWT, studentDetails)
router.route("/logout").post(verifyJWT, studentLogout)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/google-auth").post(googleLogin)
router.route("/auth/linkedin").get(linkdinRedirect)
router.route("/auth/linkedin/callback").get(linkedinLogin)


export default router