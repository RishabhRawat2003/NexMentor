import Router from 'express'
import { createAccount, mentorAcademicDetails, mentorDetails, mentorLogin, mentorLogout, verifyOTP } from '../controllers/mentor.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
verifyJWT
const router = Router()


router.route("/create-account").post(createAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/fill-academic-details").post(mentorAcademicDetails)
router.route("/login").post(mentorLogin)
router.route("/mentor-details").post(verifyJWT, mentorDetails)
router.route("/logout").post(verifyJWT, mentorLogout)



export default router