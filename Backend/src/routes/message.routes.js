import { getConversationUsersForMentors, getMessages, readMessage, searchUserDetails, sendMessage } from "../controllers/message.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/:id').get(verifyJWT, getMessages)
router.route('/send/:id').post(verifyJWT, sendMessage)
router.route('/all-conversations').post(verifyJWT, getConversationUsersForMentors)
router.route('/read-message/:id').post(verifyJWT, readMessage)
router.route('/searched-user-details').post(verifyJWT, searchUserDetails)

export default router