import { Admin } from "../models/admin.model.js";
import { Mentor } from "../models/mentor.model.js";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { registeredUserForWebinar, sendVerificationEmail } from "./emailService.js";

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
    const allMentors = await Mentor.find(
        { verifiedFromAdmin: true }
    )
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

export const removePendingSession = asyncHandler(async (req, res) => {
    const { id } = req.body

    const mentor = await Mentor.findOne(
        { 'sessionRequests._id': id }, // Match document containing the session
        { sessionRequests: { $elemMatch: { _id: id } } } // Limit `sessionRequests` to the matching object
    )
        .populate("sessionRequests.package")

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $inc: { totalRevenue: -mentor.sessionRequests[0].package.packagePrice },
        },
        { new: true }
    );

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, null, "Admin Not Found"))
    }

    const removeSessionFromStudent = await Student.findByIdAndUpdate(
        mentor.sessionRequests[0].student,
        { $pull: { purchasedSessions: { _id: mentor.sessionRequests[0].purchasedSessionId } } },
        { new: true }
    )


    if (!removeSessionFromStudent) {
        return res.status(404).json(new ApiResponse(404, null, "Student Not Found"))
    }

    const removeSessionFromMentor = await Mentor.findByIdAndUpdate(
        mentor._id,
        { $pull: { sessionRequests: { _id: id } } },
        { new: true }
    )

    if (!removeSessionFromMentor) {
        return res.status(404).json(new ApiResponse(404, null, "Mentor Not Found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Pending session removed successfully"))

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

    const mailContent = `
    Dear Mentor,

Thank you for submitting your application to join NexMentor! We appreciate your interest in contributing to the success of NEET aspirants and are excited to move forward with your application.

Application Received:
We have successfully received your application, including your basic details, NEET scorecard, and college ID card. This is the first step in your journey to becoming a mentor with NexMentor.

Next Steps:
Document Verification and Soft Skills Assessment
Our team will now review your submitted documents to ensure all requirements are met. We will also conduct a brief interview to assess your soft skills and suitability for mentoring.

Selection Notification
If your application meets our criteria, we will notify you and provide details on the next steps, including training and onboarding.

What You Can Do Now:
Stay Prepared: Reflect on your journey and your approach to mentoring to prepare for the soft skills assessment.
Be Patient: Our team will notify you once the review process is complete.
Questions or Assistance:
If you have any questions or need further information during this process, please don’t hesitate to reach out to us at [support@nexmentor.com].

Important Note:
Please be aware that we will only contact you through this email or the phone number displayed on the NexMentor homepage of our website. For your security, do not respond to any other communication claiming to be from NexMentor.

Thank you for your enthusiasm and commitment. We look forward to supporting you through this process and the possibility of welcoming you to NexMentor!

Best regards,
Team NexMentor
Mentorship from Achievers
    `;
    const message = `Application Received – NexMentor Review Process`

    await sendVerificationEmail(mentor.email, mailContent, message);  // this func is use to send email to mentor when they are approved from admin

    mentor.notifications.push(
        {
            message: "Congratulations, You are now verified by Admin",
            isRead: false
        }
    )

    await mentor.save()

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

export const featuredMentors = asyncHandler(async (req, res) => {
    const { mentorId } = req.body

    if (!mentorId) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor id is required"))
    }

    const featuredMentors = await Mentor.findById(mentorId)

    if (!featuredMentors) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                featuredMentors: {
                    id: featuredMentors._id,
                    mentorId: featuredMentors.mentorId,
                    email: featuredMentors.email,
                    state: featuredMentors.address.state,
                    city: featuredMentors.address.city,
                    feedBack: featuredMentors.feedBack
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor Featured Successfully"))

})

export const removeFeaturedMentor = asyncHandler(async (req, res) => {
    const { mentorId } = req.body


    if (!mentorId) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor id is required"))
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                featuredMentors: { id: mentorId }
            }
        },
        { new: true }
    );

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Featured Mentor Removed Successfully"))

})

export const addUpdates = asyncHandler(async (req, res) => {
    const { message } = req.body

    if (!message) {
        return res.status(404).json(new ApiResponse(404, {}, "Message is required"))
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                updates: {
                    content: message,
                    date: new Date().toISOString()
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Update Added Successfully"))

})

export const deleteUpdates = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(404).json(new ApiResponse(404, {}, "ID is required"))
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                updates: { _id: id }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Update Deleted Successfully"))
})

export const getUpdates = asyncHandler(async (req, res) => {
    const admin = await Admin.find().select("profilePicture name updates")

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin, "All Updates Fetched Successfully"))


})

export const addTestimonials = asyncHandler(async (req, res) => {
    const { name, message } = req.body

    if (!name || !message || !req.files.image) {
        return res.status(404).json(new ApiResponse(404, {}, "Name , Image and Message are required"))
    }

    const image = req.files.image[0];
    const imageFileUpload = await uploadOnCloudinary(image.path);

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                testimonials: {
                    name,
                    testimonial: message,
                    image: imageFileUpload.secure_url
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial Added Successfully"))
})

export const deleteTestimonials = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(404).json(new ApiResponse(404, {}, "id is required"))
    }


    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                testimonials: { _id: id }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial removed Successfully"))

})

export const getTestimonials = asyncHandler(async (req, res) => {

    const admin = await Admin.find()
        .select("testimonials")

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin[0].testimonials, "All Testimonials fetched Successfully"))
})

export const featuredAdAndUpdateAmount = asyncHandler(async (req, res) => {
    const { amount } = req.body

    let updateFields = {}

    if (amount) updateFields.verificationAmount = amount

    if (req.files.image) {
        const image = req.files.image[0];
        const imageFileUpload = await uploadOnCloudinary(image.path);
        updateFields.featuredAd = imageFileUpload.secure_url
    }

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Ad and verification amount set successfully"))

})

export const addBlogs = asyncHandler(async (req, res) => {
    const { title, content } = req.body

    if (!title || !content || !req.files.image) {
        return res.status(400).json(new ApiResponse(400, {}, "Title ,Image and Content are required"))
    }

    const image = req.files.image[0];
    const imageFileUpload = await uploadOnCloudinary(image.path);

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                blogs: {
                    title,
                    content,
                    image: imageFileUpload.secure_url
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog added Successfully"))

})

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json(new ApiResponse(400, {}, "id is required"))
    }


    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                blogs: {
                    _id: id
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog removed Successfully"))

})

export const getBlogs = asyncHandler(async (req, res) => {
    const admin = await Admin.find().select("blogs")

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin[0].blogs, "All blogs fetched Successfully"))

})

export const getSingleBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params

    if (!blogId) {
        return res.status(400).json(new ApiResponse(400, {}, "blogId is required"))
    }

    const admin = await Admin.find().select("blogs")

    const singleBlog = admin[0].blogs.filter(blog => blog._id == blogId)

    if (!singleBlog) {
        return res.status(404).json(new ApiResponse(404, {}, "Blog not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, singleBlog[0], "Single blog fetched Successfully"))
})

export const getFeaturedMentors = asyncHandler(async (req, res) => {

    const admin = await Admin.find().select("featuredMentors")

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    const featuredMentors = admin[0].featuredMentors;

    if (featuredMentors.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No featured mentors available"));
    }

    const mentorIds = featuredMentors.map(mentor => mentor.id);

    const mentors = await Mentor.find({ '_id': { $in: mentorIds } }).select("firstName lastName profilePicture neetScore institute feedBack")

    return res
        .status(200)
        .json(new ApiResponse(200, mentors, "Featured Mentors Fetched successfully"))
})

export const createWebinar = asyncHandler(async (req, res) => {
    const { date, day, year, content, time } = req.body

    if (!date || !day || !year || !req.files.image || !content || !time) {
        return res.status(400).json(new ApiResponse(400, {}, "Date, Day, Content, Image and Year are required"))
    }

    const image = req.files.image[0];
    const imageFileUpload = await uploadOnCloudinary(image.path);

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                webinar: {
                    time,
                    date,
                    day,
                    year,
                    content,
                    image: imageFileUpload.secure_url
                }
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Webinar Created Successfully"))

})

export const getWebinar = asyncHandler(async (req, res) => {
    const admin = await Admin.find().select("webinar")

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin[0].webinar, "Webinar fetched Successfully"))

})

export const deleteWebinar = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                webinar: 1
            }
        },
        { new: true }
    )

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Webinar removed Successfully"))
})

export const registerForWebinar = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    if (!name || !email) {
        return res.status(400).json(new ApiResponse(400, {}, "Name and Email are required"))
    }

    const mailContent = `
This user registered for incoming Webinar :-
name: ${name}
email: ${email}
`;
    const message = `Registered For Incoming Webinar ${name}`

    await registeredUserForWebinar(email, mailContent, message);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User Registered Successfully"))
})

export const contactUs = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json(new ApiResponse(400, {}, "Name and Email are required"))
    }

    const mailContent = `
    This user contacted us :-
    name: ${name}
    email: ${email}
    message: ${message}
`;
    const message2 = `Contact Us Throught NexMentor ${name}`

    await registeredUserForWebinar(email, mailContent, message2);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User Registered Successfully"))

})

export const getVerificationAmount = asyncHandler(async (req, res) => {

    const admin = await Admin.find()

    if (!admin) {
        return res.status(404).json(new ApiResponse(404, {}, "Admin Not Found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin[0].verificationAmount, "User Registered Successfully"))

})