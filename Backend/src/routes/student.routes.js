import Router from 'express'
import { createStudentAccount, studentDetails, studentLogin, studentLogout, verifyOTP } from '../controllers/student.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
const router = Router()


router.route("/create-account").post(createStudentAccount)
router.route("/verify-email").post(verifyOTP)
router.route("/login").post(studentLogin)
router.route("/student-details").post(verifyJWT, studentDetails)
router.route("/logout").post(verifyJWT, studentLogout)



export default router