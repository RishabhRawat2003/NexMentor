import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const mentorSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        trim: true,
        min: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    googleId: {
        type: String,
        unique: true
    },
    address: {
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        }
    },
    number: {
        type: Number,
        trim: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: '' // make a default image
    },
    ratePerSession: {
        type: Number,
        default: 500 // this need to be changed as per instructions
    },
    neetScore: {
        type: Number,
        default: 0,
        trim: true
    },
    neetExamYear: {
        type: String
    },
    yearOfEducation: {
        type: String
    },
    institute: {
        type: String
    },
    scoreCard: {
        type: String
    },
    studentId: {
        type: String
    },
    statement: {
        type: String,
        default: '',
        trim: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    // experience: [
    //     {
    //         jobTitle: {
    //             type: String,
    //             trim: true
    //         },
    //         company: {
    //             type: String,
    //             trim: true
    //         },
    //         startDate: {
    //             type: Date
    //         },
    //         endDate: {
    //             type: Date
    //         }
    //     }
    // ],
    refreshToken: {
        type: String,
    },
    feedBack: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Feedback'
        }
    ],
    keywords: [
        {
            type: String,
            trim: true
        }
    ]
}, {
    timestamps: true
})

mentorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

mentorSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

mentorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

mentorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Mentor = mongoose.model("Mentor", mentorSchema)