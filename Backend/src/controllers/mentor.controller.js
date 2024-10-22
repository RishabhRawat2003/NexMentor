import { Mentor } from '../modals/mentor.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from './emailService.js'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Mentor.findById(userId);
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

const createAccount = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    if (!(firstName || lastName || email || password || confirmPassword)) {
        throw new ApiError(400, 'All Fields are required')
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, 'Passwords do not match')
    }

    const existingMentor = await Mentor.findOne({
        $or: [{ username }, { email }]
    })

    if (existingMentor) {
        throw new ApiError(400, 'Username or Email already exists')
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const newMentor = new Mentor({
        firstName,
        email,
        lastName,
        password,
        otp,
        otpExpiry
    });

    await newMentor.save();

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

    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    if (mentor.otp !== otp || Date.now() > mentor.otpExpiry) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    mentor.isVerified = true;
    mentor.otp = undefined;
    mentor.otpExpiry = undefined;
    await mentor.save();

    return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});


export {
    createAccount, verifyOTP
}