import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from './emailService.js'
import { Student } from '../models/student.model.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import axios from 'axios'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        console.log("All Fields are required !!");
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are required !!"))
    }

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return res.status(401).json(new ApiResponse(401, {}, "Passwords do not match"))
    }

    const existingStudent = await Student.findOne({
        email
    })

    if (existingStudent) {
        console.log('Email already exists')
        return res.status(401).json(new ApiResponse(401, {}, "Email already exists"))
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
The NexMentor Team`;

    await sendVerificationEmail(email, mailContent);

    return res
        .status(200)
        .json(new ApiResponse(200, newStudent._id, "OTP send to your email."));

})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    if (student.otp !== otp || Date.now() > student.otpExpiry) {
        console.log('Invalid or expired OTP');
        return res.status(401).json(new ApiResponse(401, {}, "Invalid or expired OTP"))
    }

    student.emailVerified = true;
    student.otp = undefined;
    student.otpExpiry = undefined;
    await student.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Email verified successfully and Your account is Created"));
});

const resendOtp = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        throw new ApiError(401, "Id is required")
    }

    const student = await Student.findById(id)

    if (!student) {
        throw new ApiError(404, "Student not found")
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    student.otp = otp;
    student.otpExpiry = otpExpiry;
    await student.save();

    const mailContent = `
Dear User,

Thank you for registering on NeXmentor. 

Your One-Time Password (OTP) for email verification is: **${otp}**.

Please enter this OTP on the verification page to complete your registration process. 

For your security, this OTP is valid for only 5 minutes. If you did not request this code, please ignore this email.

Thank you,
The NexMentor Team`;

    await sendVerificationEmail(student.email, mailContent);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP resend to your email."));


})

const removeStudentIfNotVerified = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    await Student.findOneAndDelete({ email })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Student account is deleted Without verifying !!"))

})

const studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        console.log("Email and Password are Required")
        return res.status(400).json(new ApiResponse(401, {}, "Email and Password are Required"))
    }

    const existedStudent = await Student.findOne({ email })

    if (!existedStudent) {
        console.log("Student Not Found")
        return res.status(400).json(new ApiResponse(404, {}, "Student Not Found"))
    }

    const isPasswordCorrect = await existedStudent.comparePassword(password)

    if (!isPasswordCorrect) {
        console.log("Invalid Password")
        return res.status(400).json(new ApiResponse(401, {}, "Invalid Password"))
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


const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
        throw new ApiError(404, "User with this email does not exist");
    }

    const resetToken = student.generateResetToken()
    await student.save({ validateBeforeSave: false });

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
            to: student.email,
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
        student.resetPasswordToken = undefined;
        student.resetPasswordExpire = undefined;
        await student.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Email could not be sent');
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


    const user = await Student.findOne({
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
            email_verified: emailVerified
        } = payload;
        let student = await Student.findOne({
            $or: [{ googleId }, { email }]
        });

        if (!student) {
            const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now()}`;

            student = new Student({
                googleId,
                email,
                firstName,
                lastName,
                profilePicture,
                emailVerified,
                username: generatedUsername
            });
            await student.save()
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(student._id);

        const options = {
            httpOnly: true,
            secure: false // Change to true in production
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, student, "Google login successful"));

    } catch (error) {
        throw new ApiError(500, "Error during Google login")
    }
});


// Linkedin authentication
const linkdinRedirect = asyncHandler(async (req, res) => {
    const state = process.env.ACCESS_TOKEN_SECRET;
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid%20profile%20email&state=${state}`;
    res.redirect(authUrl);
})

const linkedinLogin = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        throw new ApiError(401, "No authorization code provided");
    }

    try {
        const tokenResponse = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        const accessToken = tokenResponse.data.access_token;

        const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const linkedinId = profileResponse.data.sub;
        const firstName = profileResponse.data.given_name;
        const lastName = profileResponse.data.family_name;
        const profilePicture = profileResponse.data.picture || null;
        const email = profileResponse.data.email;
        const emailVerified = profileResponse.data.email_verified


        let student = await Student.findOne({ $or: [{ linkedinId }, { email }] });
        if (!student) {
            const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now()}`;
            student = new Student({
                linkedinId,
                email,
                firstName,
                lastName,
                profilePicture,
                username: generatedUsername,
                emailVerified
            });
            await student.save();
        }
        const { accessToken: mentorAccessToken, refreshToken } = await generateAccessAndRefreshToken(student._id);

        const options = {
            httpOnly: true,
            secure: false// Set secure to true in production
        };

        return res
            .status(200)
            .cookie("accessToken", mentorAccessToken, options)
            .cookie("refreshToken", refreshToken, options)
            // .json(new ApiResponse(200, mentor, "LinkedIn login successful"))
            .redirect("http://localhost:5173")
    } catch (error) {
        throw new ApiError(500, "Error during LinkedIn login");
    }
});


export {
    createStudentAccount,
    verifyOTP,
    studentLogin,
    studentDetails,
    studentLogout,
    forgotPassword,
    resetPassword,
    googleLogin,
    linkdinRedirect,
    linkedinLogin,
    resendOtp,
    removeStudentIfNotVerified
}