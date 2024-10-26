import { Mentor } from '../models/mentor.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from './emailService.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const { firstName, lastName, email, password, confirmPassword, city, state } = req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword || !city || !state) {
        throw new ApiError(400, 'All Fields are required')
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, 'Passwords do not match')
    }

    const existingMentor = await Mentor.findOne({
        email
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
        otpExpiry,
        address: {
            city,
            state
        }
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

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const mentorAcademicDetails = asyncHandler(async (req, res) => {
    const { email, neetScore, neetExamYear, yearOfEducation, institute, number, scoreCard, studentId, statement } = req.body // here email should be changed to id

    if (!email || !neetScore || !neetExamYear || !yearOfEducation || !institute || !number || !scoreCard || !studentId || !statement) {
        throw new ApiError(401, "All Fields are Required")
    }

    const existedMentor = await Mentor.findOneAndUpdate(
        { email },
        {
            neetScore,
            number,
            neetExamYear,
            yearOfEducation,
            institute,
            scoreCard,
            studentId,
            statement
        },
        { new: true }
    )

    if (!existedMentor) {
        throw new ApiError(404, "Mentor Not Found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor details updated successfully"))
})

const mentorLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(401, "Email and Password are Required")
    }

    const existedMentor = await Mentor.findOne({ email })

    if (!existedMentor) {
        throw new ApiError(404, "Mentor Not Found")
    }

    const isPasswordCorrect = await existedMentor.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedMentor._id)

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

const mentorDetails = asyncHandler(async (req, res) => {
    const mentor = await Mentor.findById(req.user._id).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, mentor, "Mentor Details Fetched Successfully"))
})

const mentorLogout = asyncHandler(async (req, res) => {
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

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
        throw new ApiError(404, "User with this email does not exist");
    }

    const resetToken = mentor.generateResetToken();

    await mentor.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/resetPassword/${resetToken}`; // change this url when deploying to production or for local host

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: mentor.email,
            subject: 'Password Reset Request',
            text: `
Dear User,

We received a request to reset the password for your account. If you made this request, please click the link below or copy and paste it into your browser to proceed with resetting your password:

${resetUrl}

If you did not request this password reset, please disregard this email. Your account remains secure.

Best regards,  
NeXmentor Support Team
`,
        };

        await transporter.sendMail(mailOptions);

        res
            .status(200)
            .json(new ApiResponse(200, {}, "reset link send successfully"));
    } catch (error) {
        mentor.resetPasswordToken = undefined;
        mentor.resetPasswordExpire = undefined;
        await mentor.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Email could not be sent');
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await Mentor.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
        .status(200)
        .json(new ApiResponse(200, {}, "Password is reset Successfully"));
});

// this controller can create a account if not have and login too 
const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(401, "NO token Provided")
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const {
            sub: googleId,
            email,
            given_name: firstName,
            family_name: lastName,
            picture: profilePicture,
            email_verified: isVerified
        } = payload;

        let mentor = await Mentor.findOne({ googleId });

        if (!mentor) {
            const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now()}`;

            mentor = new Mentor({
                googleId,
                email,
                firstName,
                lastName,
                profilePicture,
                isVerified,
                mentorId: generatedUsername
            });
            await mentor.save()
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(mentor._id);

        const options = {
            httpOnly: true,
            secure: false // Change to true in production
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, mentor, "Google login successful"));

    } catch (error) {
        throw new ApiError(500, "Error during Google login")
    }
});

export {
    createAccount,
    verifyOTP,
    mentorAcademicDetails,
    mentorLogin,
    mentorDetails,
    mentorLogout,
    forgotPassword,
    resetPassword,
    googleLogin
}