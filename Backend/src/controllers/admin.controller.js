import { Admin } from "../models/admin.model.js";
import { Mentor } from "../models/mentor.model.js";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendVerificationEmail } from "./emailService.js";

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Admin.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating Refresh and Access Token')
    }
}

export const adminCreateAccount = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password is required !")
    }

    const existingUser = await Admin.findOne({ email })

    if (existingUser) {
        throw new ApiError(400, "Email already exists !")
    }

    const user = await Admin.create({
        email,
        password
    })

    if (!user) {
        throw new ApiError(500, "Failed to create user")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Admin is created"))

})

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password is required !")
    }

    const user = await Admin.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User do not exist !")
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password !")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user._id, "Login Successfully"))
})

export const adminDetails = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id).select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Student Details Fetched Successfully"))
})

export const dashboardData = asyncHandler(async (req, res) => {
    const adminId = req.user._id

    const admin = await Admin.findById(adminId)

    if (!admin) {
        throw new ApiError(404, "Admin not found")
    }

    const allMentors = await Mentor.find()
    const allStudents = await Student.find()

    let activeSessionsCount = allMentors.reduce((total, mentor) => {
        return total + (mentor.activeSessions ? mentor.activeSessions.length : 0);
    }, 0);

    let totalNoOfSessions = allMentors.reduce((total, mentor) => {
        return total + (mentor.completeSessions ? mentor.completeSessions.length : 0);
    }, 0);

    let totalWalletAmount = allMentors.reduce((total, item) => total + item.wallet, 0);

    let totalReferred = allMentors.reduce((total, item) => total + item.totalReferrals, 0);

    let totalPendingSessions = allMentors.reduce((total, mentor) => {
        return total + (mentor.sessionRequests ? mentor.sessionRequests.length : 0);
    }, 0);

    const data = {
        totalActiveSessions: activeSessionsCount,
        totalRevenue: admin.totalRevenue,
        totalNoOfSessions,
        totalWalletAmount,
        totalMentors: allMentors.length,
        totalStudents: allStudents.length,
        totalReferred,
        totalPendingSessions
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Admin Dashboard data fetched successfully"))
})

export const totalCompletedSessions = asyncHandler(async (req, res) => {
    const allMentors = await Mentor.find()
        .populate({
            path: "completeSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "completeSessions.student",
            select: "username _id"
        })
        .select("completeSessions mentorId _id feedBack");

    const data = allMentors.filter(item => item.completeSessions.length > 0);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Total Completed Sessions Fetched Successfully"))

})

// this function will be used in total mentors as well as payout page
export const totalMentors = asyncHandler(async (req, res) => {
    const allMentors = await Mentor.find()
        .select("mentorId email address feedBack wallet paymentDetails activate _id")


    return res
        .status(200)
        .json(new ApiResponse(200, allMentors, "All Mentors fetched successfully"))
})

export const totalStudents = asyncHandler(async (req, res) => {
    const allStudents = await Student.find()
        .select("username email currentClass gender number")


    return res
        .status(200)
        .json(new ApiResponse(200, allStudents, "All Students fetched successfully"))
})

export const totalActiveSessions = asyncHandler(async (req, res) => {
    const allMentors = await Mentor.find()
        .populate({
            path: "activeSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "activeSessions.student",
            select: "username _id"
        })
        .select("activeSessions mentorId _id");

    return res
        .status(200)
        .json(new ApiResponse(200, allMentors, "Total Active Sessions Fetched Successfully"))

})

export const totalPendingSessions = asyncHandler(async (req, res) => {
    const allMentors = await Mentor.find()
        .populate({
            path: "sessionRequests.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "sessionRequests.student",
            select: "username _id"
        })
        .select("sessionRequests mentorId _id");

    return res
        .status(200)
        .json(new ApiResponse(200, allMentors, "Total Pending Sessions Fetched Successfully"))

})

export const approvalRequestMentors = asyncHandler(async (req, res) => {
    const allMentors = await Mentor.find(
        { verifiedFromAdmin: false }
    ).select("firstName lastName email address neetScore institute scoreCard studentId gender number createdAt _id")


    return res
        .status(200)
        .json(new ApiResponse(200, allMentors, "Approval request of mentors"))

})

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are required"))
    }

    if (newPassword !== confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "New password and confirm Password do not match"))
    }

    const user = await Admin.findById(req.user?._id)

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiResponse(401, {}, "Old Password is Incorrect"))
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const {
        email
    } = req.body;

    const updateFields = {};

    // Validation: Check if required fields are missing
    if (!email) {
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    updateFields.email = email

    // If a profile picture is uploaded, handle the file upload
    if (req.files?.profilePicture) {
        const profileImageFile = req.files.profilePicture[0];
        const profileImageUpload = await uploadOnCloudinary(profileImageFile.path);
        if (profileImageUpload?.secure_url) {
            updateFields.profilePicture = profileImageUpload.secure_url;
        }
    }

    // Find and update the mentor details in the database
    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select("-password -refreshToken");

    // If admin is not found, return an error response
    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"));
    }

    // Send success response with updated admin details
    return res.status(200).json(new ApiResponse(200, admin, "Details updated or changed successfully"));
});

export const acceptApprovalRequest = asyncHandler(async (req, res) => {
    const { mentorId } = req.body

    if (!mentorId) {
        return res.status(400).json(new ApiResponse(400, {}, "Mentor ID is required"))
    }

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        {
            $set: {
                verifiedFromAdmin: true
            }
        },
        { new: true }
    )

    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor approval requets accepted successfully"))

})

export const removeApprovalRequest = asyncHandler(async (req, res) => {
    const { mentorId } = req.body

    if (!mentorId) {
        return res.status(400).json(new ApiResponse(400, {}, "Mentor ID is required"))
    }

    const mentor = await Mentor.findByIdAndDelete(
        mentorId
    )

    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor approval requets rejected successfully"))

})

export const activateOrDeactivateStatus = asyncHandler(async (req, res) => {
    const { mentorId } = req.body

    if (!mentorId) {
        return res.status(400).json(new ApiResponse(400, {}, "Mentor ID is required"))
    }

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        [
            {
                $set: {
                    activate: { $not: ["$activate"] }
                }
            }
        ],
        { new: true }
    )

    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor id Toggled Successfully"))

})

export const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin Logged Out Successfully"))
})

export const clearPayment = asyncHandler(async (req, res) => {
    const { mentorID } = req.body

    if (!mentorID) {
        return res.status(401).json(new ApiResponse(401, {}, "Mentor id is required"))
    }

    if (!req.files.imageOfProof) {
        return res.status(401).json(new ApiResponse(401, {}, "Image of proof is required"))
    }

    const mentor = await Mentor.findById(mentorID)

    const imageOfProofFile = req.files.imageOfProof[0];
    const imageOfProofFileUpload = await uploadOnCloudinary(imageOfProofFile.path);

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                clearedAmount: {
                    id: mentor._id,
                    mentorId: mentor.mentorId,
                    email: mentor.email,
                    amountCleared: mentor.wallet,
                    imageOfProof: imageOfProofFileUpload.secure_url,
                    clearDate: new Date().toISOString()
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    mentor.wallet = 0
    await mentor.save()

    const mailContent = `
Dear Mentor,

I hope this message finds you well.

We are writing to inform you that the amount due in your wallet has been successfully cleared and transferred to your provided payment method. Below are the details of the payment:

If you do not receive the payment or have any questions regarding the transaction, please feel free to reach out to us.

Thank you for your contributions, and we appreciate your continued support.

Best regards,
The NexMentor Team
`;
    const message = 'Confirmation of Payment Transfer'

    await sendVerificationEmail(mentor.email, mailContent, message);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Session Completed Successfully "))
})
