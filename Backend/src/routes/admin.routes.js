import { Router } from "express";
import { acceptApprovalRequest, activateOrDeactivateStatus, addBlogs, addTestimonials, addUpdates, adminCreateAccount, adminDetails, adminLogin, approvalRequestMentors, changeCurrentPassword, clearPayment, dashboardData, deleteBlog, deleteTestimonials, deleteUpdates, featuredAdAndUpdateAmount, featuredMentors, getBlogs, getSingleBlog, getTestimonials, getUpdates, logoutAdmin, removeApprovalRequest, removeFeaturedMentor, totalActiveSessions, totalCompletedSessions, totalMentors, totalPendingSessions, totalStudents, updateAccountDetails } from "../controllers/admin.controller.js";
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
router.route("/clear-payment").post(verifyJWT, upload.fields([{ name: 'imageOfProof' }]), clearPayment)
router.route("/feature-mentor").post(verifyJWT, featuredMentors)
router.route("/remove-feature-mentor").post(verifyJWT, removeFeaturedMentor)
router.route("/add-update").post(verifyJWT, addUpdates)
router.route("/delete-update").post(verifyJWT, deleteUpdates)
router.route("/get-updates").post(verifyJWT, getUpdates)
router.route("/add-testimonial").post(verifyJWT, upload.fields([{ name: 'image' }]), addTestimonials)
router.route("/delete-testimonial").post(verifyJWT, deleteTestimonials)
router.route("/get-testimonial").post(verifyJWT, getTestimonials)
router.route("/add-feature-ad").post(verifyJWT, upload.fields([{ name: 'image' }]), featuredAdAndUpdateAmount)
router.route("/add-blog").post(verifyJWT, upload.fields([{ name: 'image' }]), addBlogs)
router.route("/remove-blog").post(verifyJWT, deleteBlog)
router.route("/get-blogs").post(verifyJWT, getBlogs)
router.route("/get-single-blog/:blogId").post(verifyJWT, getSingleBlog)




export default router;