import Router from 'express'
import { createAccount, verifyOTP } from '../controllers/mentor.controller.js'

const router = Router()


router.route("/create-account").post(createAccount)
router.route("/verify-email").post(verifyOTP)


export default router