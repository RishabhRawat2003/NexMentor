import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Mentor } from "../models/mentor.model.js";
import { Student } from "../models/student.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized Token")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await Mentor.findById(decodedToken?._id).select("-password -refreshToken") || await Student.findById(decodedToken?._id).select("-password -refreshToken") || await Admin.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

})