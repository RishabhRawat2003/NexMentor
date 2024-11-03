import { Mentor } from '../models/mentor.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { sendVerificationEmail } from './emailService.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { razorpayInstance } from '../config/razorpayConfig.js'

// const razorpayInstanceValue = razorpayInstance()

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
        console.log("All Fields are required !!");
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are required !!"))
    }

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return res.status(401).json(new ApiResponse(401, {}, "Passwords do not match"))
    }

    const existingMentor = await Mentor.findOne({
        email
    })

    if (existingMentor) {
        console.log('Email already exists')
        return res.status(401).json(new ApiResponse(401, {}, "Email already exists"))
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
The NexMentor Team`;

    await sendVerificationEmail(email, mailContent);

    return res
        .status(200)
        .json(new ApiResponse(200, newMentor._id, "OTP sent to your email."));
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    if (mentor.otp !== otp || Date.now() > mentor.otpExpiry) {
        console.log('Invalid or expired OTP');
        return res.status(401).json(new ApiResponse(401, {}, "Invalid or expired OTP"))
    }

    mentor.emailVerified = true;
    mentor.otp = undefined;
    mentor.otpExpiry = undefined;
    await mentor.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const mentorAcademicDetails = asyncHandler(async (req, res) => {
    const { email, neetScore, neetExamYear, yearOfEducation, institute, number, scoreCard, studentId, statement, gender, neetAttempt } = req.body // here email should be changed to id

    if (!email || !neetScore || !neetExamYear || !yearOfEducation || !institute || !number || !scoreCard || !studentId || !statement || !gender || !neetAttempt) {
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
            statement,
            gender,
            neetAttempt
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

const resendOtp = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        throw new ApiError(401, "Id is required")
    }

    const mentor = await Mentor.findById(id)

    if (!mentor) {
        throw new ApiError(404, "Mentor not found")
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    mentor.otp = otp;
    mentor.otpExpiry = otpExpiry;
    await mentor.save();

    const mailContent = `
Dear User,

Thank you for registering on NeXmentor. 

Your One-Time Password (OTP) for email verification is: **${otp}**.

Please enter this OTP on the verification page to complete your registration process. 

For your security, this OTP is valid for only 5 minutes. If you did not request this code, please ignore this email.

Thank you,
The NexMentor Team`;

    await sendVerificationEmail(mentor.email, mailContent);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP resend to your email."));


})

const removeMentorIfNotVerified = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    await Mentor.findOneAndDelete({ email })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor account is deleted Without verifying !!"))

})

const mentorLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        console.log("Email and Password are Required")
        return res.status(400).json(new ApiResponse(401, {}, "Email and Password are Required"))
    }

    const existedMentor = await Mentor.findOne({ email })

    if (!existedMentor) {
        console.log("Mentor Not Found")
        return res.status(400).json(new ApiResponse(404, {}, "Mentor Not Found"))
    }

    const isPasswordCorrect = await existedMentor.comparePassword(password)

    if (!isPasswordCorrect) {
        console.log("Invalid Password")
        return res.status(400).json(new ApiResponse(401, {}, "Invalid Password"))
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
NexMentor Support Team
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

//this is for when mentor first create there account
const createOrder = asyncHandler(async (req, res) => {
    const amount = 149 // this amount can be changed in the future

    const option = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }

    try {
        razorpayInstanceValue.orders.create(option, (err, order) => {
            if (err) {
                throw new ApiError(500, "Failed to create order")
            }
            return res
                .status(200)
                .json(new ApiResponse(200, order, "Order Created Successfully"))
        })
    } catch (error) {
        throw new ApiError(500, "Failed to create order")
    }

})

const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature } = req.body

    const secretKey = process.env.RAZORPAY_KEY_SECRET

    const hmac = crypto.createHmac("sha256", secretKey)

    hmac.update(orderId + "|" + paymentId)

    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === signature) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Payment verified Successfully"))
    } else {
        throw new ApiError(401, "Payment not verified")
    }

})



export {
    createAccount,
    verifyOTP,
    mentorAcademicDetails,
    mentorLogin,
    mentorDetails,
    mentorLogout,
    forgotPassword,
    resetPassword,
    createOrder,
    verifyPayment,
    resendOtp,
    removeMentorIfNotVerified
}