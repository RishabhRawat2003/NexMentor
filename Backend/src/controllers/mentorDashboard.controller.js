import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Mentor } from "../models/mentor.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/student.model.js";

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

export {
    getAllSessionRequests,
    acceptSessionRequests,
    getAllActiveSessions
}