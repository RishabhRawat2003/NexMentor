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
import { Mentor } from '../models/mentor.model.js'
import { razorpayInstance } from '../config/razorpayConfig.js'
import { Package } from '../models/mentorPackage.model.js';
import { Notification } from '../models/notification.model.js';

const razorpayInstanceValue = razorpayInstance()
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

async function createProfilePicture(firstName, lastName) {
    try {
        const response = await axios.get(`https://ui-avatars.com/api/?name=${firstName}+${lastName}/?background=0D8ABC&color=fff`)
        return response.config.url
    } catch (error) {
        console.log("Error while creating profile picture", error);
    }
}

// registering student logic
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

    const url = await createProfilePicture(firstName, lastName)
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now().toString().slice(-4)}`;

    const newStudent = new Student({
        firstName,
        email,
        lastName,
        password,
        otp,
        otpExpiry,
        profilePicture: url,
        username: generatedUsername
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

//student login, details and logout logic
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
        .json(new ApiResponse(200, existedStudent._id, "Login Successfully"))
})

const studentDetails = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id).select("-password -refreshToken")
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

//forgot password logic
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    let user = await Student.findOne({ email });
    let userType = "Student";

    if (!user) {
        user = await Mentor.findOne({ email });
        userType = "Mentor";
    }

    if (!user) {
        console.log("User with this email does not exist");
        return res.status(404).json(new ApiResponse(404, {}, "User with this email does not exist"));
    }

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/login/forgot-password/resetPassword/${resetToken}`; //change the url when deploy

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
            to: user.email,
            subject: 'Password Reset Request',
            text: `
Dear ${userType},

We received a request to reset the password for your account. If you made this request, please click the link below or copy and paste it into your browser to proceed with resetting your password:

${resetUrl}

If you did not request this password reset, please disregard this email. Your account remains secure.

Best regards,  
NexMentor Support Team
`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(new ApiResponse(200, {}, "Reset link sent successfully"));

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, 'Email could not be sent');
    }
});

//reset password logic
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "Password and Confirm Password are required"));
    }

    if (password !== confirmPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "Password and Confirm Password do not match"));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let user = await Mentor.findOne({ resetPasswordToken: hashedToken });

    if (!user) {
        user = await Student.findOne({ resetPasswordToken: hashedToken });
    }

    if (!user) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid or expired token"));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

//google authentication
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
            const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now().toString().slice(-4)}`;

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
            const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now().toString().slice(-4)}`;
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

// profile update controllers
const updateProfileDetails = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        username,
        number,
        email,
        currentClass,
        gender
    } = req.body;

    const updateFields = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (username) updateFields.username = username;
    if (number) updateFields.number = number;
    if (email) updateFields.email = email;
    if (currentClass) updateFields.currentClass = currentClass;
    if (gender) updateFields.gender = gender;

    if (!firstName || !lastName || !username || !email) {
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required "))
    }

    if (req.files?.profilePicture) {
        const profileImageFile = req.files.profilePicture[0];
        const profileImageUpload = await uploadOnCloudinary(profileImageFile.path);
        if (profileImageUpload?.secure_url) {
            updateFields.profilePicture = profileImageUpload.secure_url;
        }
    }

    const student = await Student.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select("-password -refreshToken");

    if (!student) {
        return res.status(404).json(new ApiResponse(404, {}, "Student not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Details updated or changed Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
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
        sameSite: 'lax'
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Student Logged Out Successfully"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are required"))
    }

    if (newPassword !== confirmPassword) {
        return res.status(401).json(new ApiResponse(401, {}, "New password and confirm Password do not match"))
    }

    const user = await Student.findById(req.user?._id)

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

//student buying session package logic
const createOrder = asyncHandler(async (req, res) => {
    const { packageId } = req.body

    if (!packageId) {
        return res.status(401).json(new ApiResponse(401, {}, "Package ID is required"))
    }

    const packagePrice = await Package.findById(packageId)

    const amount = packagePrice.packagePrice

    const option = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }

    try {
        razorpayInstanceValue.orders.create(option, (err, order) => {
            if (err) {
                console.log("Failed to create Payment")
                return res.status(401).json(new ApiResponse(401, {}, "Failed to create Payment, Try again"));
            }
            return res
                .status(200)
                .json(new ApiResponse(200, order, "Order Created Successfully"))
        })
    } catch (error) {
        console.log("Failed to create Payment")
        return res.status(401).json(new ApiResponse(401, {}, "Failed to create Payment, Try again"));
    }

})

const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature, packageId } = req.body

    const secretKey = process.env.RAZORPAY_KEY_SECRET

    const hmac = crypto.createHmac("sha256", secretKey)

    hmac.update(orderId + "|" + paymentId)

    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === signature) {

        const packageItem = await Package.findById(packageId).populate('mentorId');
        if (!packageItem) {
            console.log("Package not found");
            return res.status(400).json(new ApiResponse(400, {}, "Package not found"));
        }

        const student = await Student.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    purchasedSessions: {
                        package: packageItem._id,
                        mentor: packageItem.mentorId._id,
                        status: 'pending'
                    }
                }
            },
            { new: true }
        ).populate("purchasedSessions.package purchasedSessions.mentor");

        if (!student) {
            console.log("Student not found");
            return res.status(404).json(new ApiResponse(404, {}, "Student not found"));
        }

        const newSession = student.purchasedSessions[student.purchasedSessions.length - 1];
        const newSessionId = newSession._id;
        const newSessionPurchasedDate = newSession.purchaseDate

        const mentor = packageItem.mentorId;
        if (mentor) {
            // Implement notification logic here
            // For example, send an email or save a notification in a notifications collection
            const requestToMentor = await Mentor.findByIdAndUpdate(
                mentor._id,
                {
                    $push: {
                        sessionRequests: {
                            package: packageItem._id,
                            student: student._id,
                            purchasedSessionId: newSessionId,
                            status: 'pending',
                            purchaseDate: newSessionPurchasedDate
                        }
                    }
                },
                { new: true }
            ).populate("sessionRequests.package sessionRequests.student");

            if (!requestToMentor) {
                console.log("Mentor not found");
            }


            const mailContent = `
Dear Mentor,

We are excited to inform you that a student has purchased your mentoring package on NexMentor!

**Package Details:**
- **Student Name**: ${student.username}
- **Package Name**: ${packageItem.packageName}

Please review and approve this session to proceed with scheduling and payment. Once approved, you have to coordinate with the student to set up the session.

**Action Required**: 
1. Log in to your mentor account to review the details.
2. Approve the session to finalize scheduling.


Thank you for being a valued mentor on NexMentor. We look forward to seeing you make a positive impact in your student’s learning journey!

Best regards,
The NexMentor Team
`;

            await sendVerificationEmail(mentor.email, mailContent);
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Payment verified Successfully"))
    } else {
        throw new ApiError(401, "Payment not verified")
    }

})

//student session management logic
const allPurchasedSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!userId) {
        return res.status(401).json(new ApiResponse(401, {}, "Unauthorized Access"));
    }

    try {
        const user = await Student.findById(userId)
            .populate({
                path: "purchasedSessions.package",
                select: "packageName packagePrice"
            })
            .populate({
                path: "purchasedSessions.mentor",
                select: "mentorId _id"
            })
            .select("purchasedSessions");

        if (!user) {
            return res.status(404).json(new ApiResponse(404, {}, "User not found"));
        }

        const totalSessions = user.purchasedSessions.length;
        const totalPages = Math.ceil(totalSessions / limit);

        const paginatedSessions = user.purchasedSessions.slice(skip, skip + limit);

        return res.status(200).json(new ApiResponse(200, {
            data: paginatedSessions,
            pagination: {
                currentPage: page,
                totalPages,
                totalSessions,
            }
        }, "Purchased sessions retrieved successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, {}, "An error occurred while retrieving sessions"));
    }
});

const allCompletedSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!userId) {
        return res.status(401).json(new ApiResponse(401, {}, "Unauthorized Access"));
    }

    try {
        const user = await Student.findById(userId)
            .populate({
                path: "completeSessions.package",
                select: "packageName packagePrice"
            })
            .populate({
                path: "completeSessions.mentor",
                select: "mentorId _id"
            })
            .select("completeSessions");

        if (!user) {
            return res.status(404).json(new ApiResponse(404, {}, "User not found"));
        }

        const totalSessions = user.completeSessions.length;
        const totalPages = Math.ceil(totalSessions / limit);

        const paginatedSessions = user.completeSessions.slice(skip, skip + limit);

        return res.status(200).json(new ApiResponse(200, {
            data: paginatedSessions,
            pagination: {
                currentPage: page,
                totalPages,
                totalSessions,
            }
        }, "Complete sessions retrieved successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, {}, "An error occurred while retrieving sessions"));
    }

})

const giveFeedBack = asyncHandler(async (req, res) => {
    const { mentorId, rating } = req.body
    const userId = req.user._id

    if (!mentorId || !rating) {
        return res.status(400).json(new ApiResponse(400, {}, "mentorId and rating is required"))
    }

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        {
            $push: {
                owner: userId,
                rating
            }
        },
        { new: true }
    )

    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Feedback given successfully"))

})


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
    removeStudentIfNotVerified,
    updateProfileDetails,
    verifyPayment,
    createOrder,
    logoutUser,
    changeCurrentPassword,
    allPurchasedSessions,
    allCompletedSessions,
    giveFeedBack
}