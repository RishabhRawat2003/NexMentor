import { Router } from "express";
import { acceptApprovalRequest, activateOrDeactivateStatus, adminCreateAccount, adminDetails, adminLogin, approvalRequestMentors, changeCurrentPassword, dashboardData, logoutAdmin, removeApprovalRequest, totalActiveSessions, totalCompletedSessions, totalMentors, totalPendingSessions, totalStudents, updateAccountDetails } from "../controllers/admin.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'


const router = Router()


router.route("/create-account").post(adminCreateAccount)
router.route("/login").post(adminLogin)

router.route("/admin-details").post(verifyJWT, adminDetails)
router.route("/dashboard-data").post(verifyJWT, dashboardData)
router.route("/total-completed-sessions").post(verifyJWT, totalCompletedSessions)
router.route("/total-mentors").post(verifyJWT, totalMentors)
router.route("/total-students").post(verifyJWT, totalStudents)
router.route("/total-pending-sessions").post(verifyJWT, totalPendingSessions)
router.route("/total-active-sessions").post(verifyJWT, totalActiveSessions)
router.route("/approval-requests").post(verifyJWT, approvalRequestMentors)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-details").post(verifyJWT, upload.fields([{ name: 'profilePicture' }]), updateAccountDetails)
router.route("/accept-approval").post(verifyJWT, acceptApprovalRequest)
router.route("/remove-approval").post(verifyJWT, removeApprovalRequest)
router.route("/toggle-status").post(verifyJWT, activateOrDeactivateStatus)
router.route("/admin-logout").post(verifyJWT, logoutAdmin)



export default router;