import { getConversationUsersForMentors, getConversationUsersForStudents, getMessages, readMessage, searchUserDetails, searchUserDetailsMentors, sendMessage } from "../controllers/message.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/:id').get(verifyJWT, getMessages)
router.route('/send/:id').post(verifyJWT, sendMessage)
router.route('/all-conversations').post(verifyJWT, getConversationUsersForMentors) // this is for mentors
router.route('/all-conversations-students').post(verifyJWT, getConversationUsersForStudents) // this is for students
router.route('/read-message/:id').post(verifyJWT, readMessage)
router.route('/searched-user-details').post(verifyJWT, searchUserDetails) // this is for mentors
router.route('/searched-user-details-mentors').post(verifyJWT, searchUserDetailsMentors) // this is for students

export default router