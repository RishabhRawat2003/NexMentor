import { Mentor } from '../models/mentor.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { sendVerificationEmail } from './emailService.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { razorpayInstance } from '../config/razorpayConfig.js'
import { Student } from '../models/student.model.js'
import { Package } from '../models/mentorPackage.model.js'
import axios from 'axios'

const razorpayInstanceValue = razorpayInstance()

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

async function createProfilePicture(firstName, lastName) {
    try {
        const response = await axios.get(`https://ui-avatars.com/api/?name=${firstName}+${lastName}/?background=0D8ABC&color=fff`)
        return response.config.url
    } catch (error) {
        console.log("Error while creating profile picture", error);
    }
}
// account creation releated logic here
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
    const url = await createProfilePicture(firstName, lastName)
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Date.now().toString().slice(-4)}`;

    const newMentor = await Mentor.create({
        firstName,
        lastName,
        email,
        password,
        mentorId: generatedUsername,
        otp,
        profilePicture: url,
        otpExpiry,
        address: {
            city,
            state
        }
    })
    const mailContent = `
Dear User,

Thank you for registering on NeXmentor. 

Your One-Time Password (OTP) for email verification is: **${otp}**.

Please enter this OTP on the verification page to complete your registration process. 

For your security, this OTP is valid for only 5 minutes. If you did not request this code, please ignore this email.

Thank you,
The NexMentor Team`;

    const message = 'Email Verification - OTP'

    await sendVerificationEmail(email, mailContent, message);

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
    const { id, neetScore, neetExamYear, yearOfEducation, institute, number, gender, neetAttempt, agreeVerificationStep } = req.body;

    if (!id || !neetScore || !neetExamYear || !yearOfEducation || !institute || !number || !req.files?.scoreCard || !req.files?.studentId || !gender || !neetAttempt || !agreeVerificationStep) {
        console.log("All Fields are Required");
        return res.status(401).json(new ApiResponse(401, {}, "All Fields are Required"));
    }

    const scoreCardFile = req.files.scoreCard[0]; // Get the uploaded score card file
    const studentIdFile = req.files.studentId[0]; // Get the uploaded student ID file

    // console.log(scoreCardFile,studentIdFile);

    const scoreCardUpload = await uploadOnCloudinary(scoreCardFile.path);
    const studentIdUpload = await uploadOnCloudinary(studentIdFile.path);

    const updatedMentor = await Mentor.findByIdAndUpdate(
        id,
        {
            neetScore,
            number,
            neetExamYear,
            yearOfEducation,
            institute,
            scoreCard: scoreCardUpload ? scoreCardUpload.secure_url : '',
            studentId: studentIdUpload ? studentIdUpload.secure_url : '',
            gender,
            neetAttempt,
            agreeVerificationStep
        },
        { new: true }
    );

    if (!updatedMentor) {
        console.log("Mentor Not Found");
        return res.status(404).json(new ApiResponse(404, {}, "Mentor Not Found"));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Mentor details updated successfully"));
});

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

    const message = 'Email Verification - OTP'

    await sendVerificationEmail(mentor.email, mailContent, message);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP resend to your email."));


})

const removeMentorIfNotVerified = asyncHandler(async (req, res) => {
    const { email, id } = req.body

    if (!email && !id) {
        throw new ApiError(400, "email or id is required")
    }

    await Mentor.findOneAndDelete({
        $or: [{ email }, { id }],
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Mentor account is deleted Without verifying !!"))

})

// mentor login, details and logout logic
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
    const mentor = await Mentor.findById(req.user._id).select("-password -refreshToken")
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

// password related logic
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

// this is the payment gateway for mentor when they first create thier account
const createOrder = asyncHandler(async (req, res) => {
    const amount = 149 // this amount can be changed in the future from Admin Dashboard

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
    const { orderId, paymentId, signature, userId } = req.body

    const secretKey = process.env.RAZORPAY_KEY_SECRET

    const hmac = crypto.createHmac("sha256", secretKey)

    hmac.update(orderId + "|" + paymentId)

    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === signature) {

        if (!userId) {
            return res.status(401).json(new ApiResponse(401, {}, "User not found"))
        }
        await createOrUpdatePackage(userId)

        await Mentor.findByIdAndUpdate(
            userId,
            { $set: { paid: true } },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Payment verified Successfully"))
    } else {
        throw new ApiError(401, "Payment not verified")
    }

})

//Make a new package to show in the mentor profile
const createOrUpdatePackage = async (mentorId) => {
    const searchedMentor = await Mentor.findById(mentorId);
    if (!searchedMentor) {
        throw new Error('Mentor not found');
    }

    const neetScore = searchedMentor.neetScore
    let packagePrice

    if (neetScore < 599) {
        packagePrice = 199
    } else if (neetScore >= 600 && neetScore <= 640) {
        packagePrice = 249
    } else if (neetScore >= 641 && neetScore <= 680) {
        packagePrice = 299
    } else {
        packagePrice = 349
    }

    let existingPackage = await Package.findOne({ mentorId });

    if (existingPackage) {
        existingPackage.packagePrice = packagePrice;
        existingPackage.neetScore = searchedMentor.neetScore;
        await existingPackage.save();
    } else {
        existingPackage = await Package.create({
            packageName: "Mentor Package",
            packageDescription: "Package for mentor based on NEET score",
            packagePrice: packagePrice,
            mentorId: mentorId,
            neetScore: searchedMentor.neetScore,
        });

        searchedMentor.package.push(existingPackage._id);
        await searchedMentor.save();
    }

    return existingPackage;
};

//changes later here that only verified mentors are sended in response
const allMentors = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    try {
        let mentors = await Mentor.find()
            .skip(skip)
            .limit(limit)
            .select("-password -refreshToken -address -email -emailVerified -agreeVerificationStep -verifiedFromAdmin -paid -notifications -sessionRequests -number -scoreCard -studentId -package")

        if (!mentors.length) {
            console.log("No Mentor Found");
            return res.status(404).json(new ApiResponse(404, {}, "No mentors found"));
        }

        const totalMentors = await Mentor.countDocuments();
        const totalPages = Math.ceil(totalMentors / limit);

        return res.status(200).json(new ApiResponse(200, {
            data: mentors,
            pagination: {
                currentPage: page,
                totalPages,
                totalMentors,
            },
        }, "Mentors retrieved successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "An error occurred while retrieving mentors" });
    }
});

const singleMentor = asyncHandler(async (req, res) => {
    const { mentorId } = req.body

    if (!mentorId) {
        throw new ApiError(401, "Mentor Id is Required")
    }

    const mentor = await Mentor.findById(mentorId).select("-password -refreshToken -email -emailVerified -agreeVerificationStep -verifiedFromAdmin -paid -notifications -sessionRequests -number -scoreCard -studentId").populate("package address")

    if (!mentor) {
        return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, mentor, "Single mentor Info fetched Successfully"))

})

const searchMentor = asyncHandler(async (req, res) => {
    const { username, neetExamYear, minBudget, maxBudget, city, state, minNeetScore, maxNeetScore, gender, neetAttempts } = req.body;

    if (
        username &&
        !neetExamYear &&
        !minBudget &&
        !maxBudget &&
        !city &&
        !state &&
        !minNeetScore &&
        !maxNeetScore &&
        !gender &&
        !neetAttempts
    ) {
        const mentor = await Mentor.findOne({ mentorId: username })
            .select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")
            .populate({
                path: 'package',
                select: 'packagePrice'
            });

        if (!mentor) {
            return res.status(404).json(new ApiResponse(404, {}, "Mentor not found"));
        }

        return res.status(200).json(new ApiResponse(200, mentor, "Mentor Fetched of that username"));
    }
    const query = {};
    if (username) query.mentorId = username;
    if (neetExamYear) query.neetExamYear = neetExamYear;
    if (minNeetScore || maxNeetScore) query.neetScore = { $gte: minNeetScore || 0, $lte: maxNeetScore || Infinity };
    if (gender) query.gender = gender;
    if (neetAttempts) query.neetAttempt = neetAttempts;
    if (city) query['address.city'] = city;
    if (state) query['address.state'] = state;

    // Fetch mentors based on the constructed query
    let mentors = await Mentor.find(query)
        .select("-password -refreshToken -address -email -emailVerified -agreeVerificationStep -verifiedFromAdmin -paid -notifications -sessionRequests -number -scoreCard -studentId -package")
        .populate({
            path: 'package',
            select: 'packagePrice'
        });

    if (minBudget || maxBudget) {
        mentors = mentors.filter(mentor => {
            const packagePrices = mentor.package.map(pkg => pkg.packagePrice);
            return packagePrices.some(price => price >= (minBudget || 0) && price <= (maxBudget || Infinity));
        });
    }

    if (!mentors || mentors.length === 0) {
        return res.status(404).json(new ApiResponse(404, {}, "No mentors found matching the criteria"));
    }

    return res.status(200).json(new ApiResponse(200, mentors, "Mentors fetched based on the criteria"));
});


export {
    createAccount,
    verifyOTP,
    mentorLogin,
    mentorAcademicDetails,
    mentorDetails,
    mentorLogout,
    forgotPassword,
    resetPassword,
    createOrder,
    verifyPayment,
    resendOtp,
    removeMentorIfNotVerified,
    allMentors,
    singleMentor,
    searchMentor
}