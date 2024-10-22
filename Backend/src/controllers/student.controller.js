import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from './emailService.js'
import { Student } from '../models/student.model.js'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Student.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating Refresh and Access Token')
    }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createStudentAccount = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return new ApiError(400, 'Please fill in all fields')
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, 'Passwords do not match')
    }

    const existingStudent = await Student.findOne({
        email
    })

    if (existingStudent) {
        throw new ApiError(400, 'Username or Email already exists')
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const newStudent = new Student({
        firstName,
        email,
        lastName,
        password,
        otp,
        otpExpiry
    });

    await newStudent.save();

    const mailContent = `
Dear User,

Thank you for registering on NeXmentor. 

Your One-Time Password (OTP) for email verification is: **${otp}**.

Please enter this OTP on the verification page to complete your registration process. 

For your security, this OTP is valid for only 5 minutes. If you did not request this code, please ignore this email.

Thank you,
The NeXmentor Team`;

    await sendVerificationEmail(email, mailContent);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP sent to your email."));

})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    if (student.otp !== otp || Date.now() > student.otpExpiry) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    student.isVerified = true;
    student.otp = undefined;
    student.otpExpiry = undefined;
    await student.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email verified successfully and Your account is Created"));
});


const studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(401, "Email and Password are Required")
    }

    const existedStudent = await Student.findOne({ email })

    if (!existedStudent) {
        throw new ApiError(404, "Mentor Not Found")
    }

    const isPasswordCorrect = await existedStudent.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedStudent._id)

    const options = {
        httpOnly: true,
        secure: false // change this to true when hosting the app
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {}, "Login Successfully"))
})

const studentDetails = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, student, "Student Details Fetched Successfully"))
})

const studentLogout = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "Student Logged Out Successfully"))
})


export {
    createStudentAccount,
    verifyOTP,
    studentLogin,
    studentDetails,
    studentLogout
}