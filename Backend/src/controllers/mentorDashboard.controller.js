import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Mentor } from "../models/mentor.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/student.model.js";
import { sendVerificationEmail } from "./emailService.js";


const getAllSessionRequests = asyncHandler(async (req, res) => {
    const mentorId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    if (!mentorId) {
        return res.status(401).json(new ApiResponse(401, {}, "Mentor id is required"))
    }

    try {
        const user = await Mentor.findById(mentorId)
            .populate({
                path: "sessionRequests.package",
                select: "packageName packagePrice"
            })
            .populate({
                path: "sessionRequests.student",
                select: "username _id"
            })
            .select("sessionRequests");

        if (!user) {
            return res.status(404).json(new ApiResponse(404, {}, "User not found"));
        }

        const totalSessionsRequests = user.sessionRequests.length;
        const totalPages = Math.ceil(totalSessionsRequests / limit);

        const paginatedSessions = user.sessionRequests.slice(skip, skip + limit);

        return res.status(200).json(new ApiResponse(200, {
            data: paginatedSessions,
            pagination: {
                currentPage: page,
                totalPages,
                totalSessionsRequests,
            }
        }, "All sessions requests retrieved successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, {}, "An error occurred while retrieving sessions"));
    }


})

const acceptSessionRequests = asyncHandler(async (req, res) => {
    const { requestId, studentId } = req.body
    const mentorId = req.user._id


    if (!requestId || !studentId) {
        return res.status(401).json(new ApiResponse(401, {}, "Request id and student id is required"))
    }

    const mentor = await Mentor.findById(mentorId)
        .populate({
            path: "sessionRequests.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "sessionRequests.student",
            select: "username _id"
        })
        .select("sessionRequests");
    const sessionRequestArray = mentor.sessionRequests
    let indexOfRequest
    sessionRequestArray.map((item, index) => {
        if (item._id == requestId) {
            indexOfRequest = index
        }
    })
    const requestItem = sessionRequestArray[indexOfRequest]
    const activeRequest = await Mentor.findByIdAndUpdate(
        mentorId,
        {
            $push: {
                activeSessions: {
                    package: requestItem.package._id,
                    student: requestItem.student._id,
                    purchasedSessionId: requestItem.purchasedSessionId,
                    purchaseDate: requestItem.purchaseDate,
                    status: 'active'
                }
            }
        },
        { new: true }
    ).populate("activeSessions.package activeSessions.student");

    if (!activeRequest) {
        return res.status(404).json(new ApiResponse(404, {}, "No active session found"))
    }
    mentor.sessionRequests.splice(indexOfRequest, 1)
    await mentor.save();

    const student = await Student.findById(requestItem.student._id).populate("purchasedSessions")

    const studentPurchasedSessionsArr = student.purchasedSessions

    studentPurchasedSessionsArr.map((item, index) => {
        if (item._id == requestItem.purchasedSessionId) {
            item.status = 'active'
        }
    })
    await student.save()

    const mailContent = `
Dear Student,

We are pleased to inform you that your session request has been accepted by the mentor. You can now proceed to communicate with the mentor directly to discuss the session details and schedule a convenient meeting time.

If you have any questions or need further assistance, feel free to reach out to us.

Best regards,
The NexMentor Team
`;
    const message = 'Session Requested Accepted'

    await sendVerificationEmail(student.email, mailContent, message);
    // Add here to mail student that mentor has accepted the request you can chat with him and decide a session timing

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Session requested Accepted Successfully "))

})

const getAllActiveSessions = asyncHandler(async (req, res) => {
    const mentorId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    if (!mentorId) {
        return res.status(401).json(new ApiResponse(401, {}, "Mentor id is required!"))
    }

    const activeSessionsArray = await Mentor.findById(mentorId)
        .populate({
            path: "activeSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "activeSessions.student",
            select: "username _id"
        })
        .select("activeSessions");

    const totalActiveSessions = activeSessionsArray.activeSessions.length
    const totalPages = Math.ceil(totalActiveSessions / limit)

    const paginatedSessions = activeSessionsArray.activeSessions.slice(skip, skip + limit);

    if (!activeSessionsArray) {
        return res.status(404).json(new ApiResponse(404, {}, "No active sessions found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            data: paginatedSessions,
            pagination: {
                currentPage: page,
                totalPages,
                totalActiveSessions,
            }
        }, "All Active sessions fetched"))

})

const changeStatusToCompleted = asyncHandler(async (req, res) => {
    const mentorId = req.user._id
    const { requestId, studentId } = req.body

    if (!requestId || !studentId) {
        return res.status(401).json(new ApiResponse(401, {}, "Request id and student id is required"))
    }

    const mentor = await Mentor.findById(mentorId)
        .populate({
            path: "activeSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "activeSessions.student",
            select: "username _id"
        })
        .select("activeSessions");
    const activeSessionsArray = mentor.activeSessions
    let indexOfActiveSession
    activeSessionsArray.map((item, index) => {
        if (item._id == requestId) {
            indexOfActiveSession = index
        }
    })
    const requestItem = activeSessionsArray[indexOfActiveSession]

    if (!req.files.imageOfProof) {
        return res.status(401).json(new ApiResponse(401, {}, "Image of proof is required"))
    }

    const imageOfProofFile = req.files.imageOfProof[0];
    const imageOfProofFileUpload = await uploadOnCloudinary(imageOfProofFile.path);
    const completeRequest = await Mentor.findByIdAndUpdate(
        mentorId,
        {
            $push: {
                completeSessions: {
                    package: requestItem.package._id,
                    student: requestItem.student._id,
                    purchasedSessionId: requestItem.purchasedSessionId,
                    purchaseDate: requestItem.purchaseDate,
                    imageOfProof: imageOfProofFileUpload.secure_url,
                    status: 'complete'
                }
            }
        },
        { new: true }
    ).populate("completeSessions.package completeSessions.student");

    if (!completeRequest) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }
    mentor.activeSessions.splice(indexOfActiveSession, 1)
    await mentor.save();

    const student = await Student.findById(requestItem.student._id)
        .populate({
            path: "purchasedSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "purchasedSessions.mentor",
            select: "mentorId _id"
        })
        .select("purchasedSessions")

    const studentPurchasedSessionsArr = student.purchasedSessions
    let indexOfPurchasedSession

    studentPurchasedSessionsArr.map((item, index) => {
        if (item._id == requestItem.purchasedSessionId) {
            indexOfPurchasedSession = index
        }
    })

    const singlePurchasedSession = studentPurchasedSessionsArr[indexOfPurchasedSession]

    const completeSession = await Student.findByIdAndUpdate(
        requestItem.student._id,
        {
            $push: {
                completeSessions: {
                    package: singlePurchasedSession.package._id,
                    mentor: singlePurchasedSession.mentor._id,
                    purchasedSessionId: singlePurchasedSession._id,
                    purchaseDate: singlePurchasedSession.purchaseDate,
                    status: 'complete'
                }
            }
        },
        { new: true }
    ).populate("completeSessions.package completeSessions.mentor");

    if (!completeSession) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    student.purchasedSessions.splice(indexOfPurchasedSession, 1)
    await student.save()

    const mailContent = `
Dear Student,

We would like to inform you that the mentor has marked your recent session as completed. If you believe the session was not completed or if you have any concerns, please report the issue to us within 24 hours. After this period, the session will be considered as completed.

If the session was indeed completed to your satisfaction, we kindly request you to provide feedback on our website. Your feedback is valuable to us and helps us improve our services.

Thank you for your attention, and please don’t hesitate to reach out if you need any assistance.

Best regards,
The NexMentor Team
`;
    const message = 'Session Marked as Completed'

    await sendVerificationEmail(completeSession.email, mailContent, message);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Session Completed Successfully "))
})

const getAllCompletedSessions = asyncHandler(async (req, res) => {
    const mentorId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    if (!mentorId) {
        return res.status(401).json(new ApiResponse(401, {}, "Mentor id is required!"))
    }

    const completeSessionsArray = await Mentor.findById(mentorId)
        .populate({
            path: "completeSessions.package",
            select: "packageName packagePrice"
        })
        .populate({
            path: "completeSessions.student",
            select: "username _id"
        })
        .select("completeSessions");

    const totalActiveSessions = completeSessionsArray.completeSessions.length
    const totalPages = Math.ceil(totalActiveSessions / limit)

    const paginatedSessions = completeSessionsArray.completeSessions.slice(skip, skip + limit);

    if (!completeSessionsArray) {
        return res.status(404).json(new ApiResponse(404, {}, "No active sessions found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            data: paginatedSessions,
            pagination: {
                currentPage: page,
                totalPages,
                totalActiveSessions,
            }
        }, "All Complete sessions fetched"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        number,
        email,
        gender,
        city,
        state,
        yearOfEducation,
        about,
        languages // Add languages to the destructured fields
    } = req.body;

    console.log(languages);
    

    const updateFields = {};

    // Update mentor details if the fields are present in the request body
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (number) updateFields.number = number;
    if (email) updateFields.email = email;
    if (yearOfEducation) updateFields.yearOfEducation = yearOfEducation;
    if (gender) updateFields.gender = gender;
    if (about) updateFields.about = about;

    // Handle city and state together as an address
    if (city || state) {
        updateFields.address = {
            ...(updateFields.address || {}),
            ...(city && { city }),
            ...(state && { state }),
        };
    }

    // Handle languages field, if provided
    if (Array.isArray(languages) && languages.length > 0) {
        // Ensure that languages is an array and not empty
        updateFields.languages = languages;
    }

    // Validation: Check if required fields are missing
    if (!firstName || !lastName || !email) {
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    // If a profile picture is uploaded, handle the file upload
    if (req.files?.profilePicture) {
        const profileImageFile = req.files.profilePicture[0];
        const profileImageUpload = await uploadOnCloudinary(profileImageFile.path);
        if (profileImageUpload?.secure_url) {
            updateFields.profilePicture = profileImageUpload.secure_url;
        }
    }

    // Find and update the mentor details in the database
    const mentor = await Mentor.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select("-password -refreshToken");

    // If mentor is not found, return an error response
    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"));
    }

    // Send success response with updated mentor details
    return res.status(200).json(new ApiResponse(200, mentor, "Details updated or changed successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
    await Mentor.findByIdAndUpdate(
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
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Mentor Logged Out Successfully"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are required"))
    }

    if (newPassword !== confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "New password and confirm Password do not match"))
    }

    const user = await Mentor.findById(req.user?._id)

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

export {
    getAllSessionRequests,
    acceptSessionRequests,
    getAllActiveSessions,
    changeStatusToCompleted,
    getAllCompletedSessions,
    updateAccountDetails,
    logoutUser,
    changeCurrentPassword
}