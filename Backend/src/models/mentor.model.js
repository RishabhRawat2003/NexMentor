import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const mentorSchema = new Schema({
    mentorId: {
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
        required: true,
        trim: true,
        min: 6
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
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
    },
    profilePicture: {
        type: String,
        default: '' // make a default image
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
        type: String,
        default: ''
    },
    studentId: {
        type: String,
        default: ''
    },
    package: [{
        type: Schema.Types.ObjectId,
        ref: 'Package'
    }],
    gender: {
        type: String,
        default: '',
        trim: true
    },
    neetAttempt: {
        type: Number,
        trim: true
    },
    agreeVerificationStep: {
        type: Boolean,
        default: false
    },
    sessionRequests: [
        {
            package: {
                type: Schema.Types.ObjectId,
                ref: 'Package'
            },
            student: {
                type: Schema.Types.ObjectId,
                ref: "Student"
            },
            purchaseDate: {
                type: String,
                trim: true
            },
            status: {
                type: String,
                trim: true
            },
            purchasedSessionId: {
                type: String,
                trim: true
            }
        }
    ],
    activeSessions: [
        {
            package: {
                type: Schema.Types.ObjectId,
                ref: 'Package'
            },
            student: {
                type: Schema.Types.ObjectId,
                ref: "Student"
            },
            purchaseDate: {
                type: String,
                trim: true
            },
            purchasedSessionId: {
                type: String,
                trim: true
            },
            status: {
                type: String,
                trim: true
            },
            approvalTime: {
                type: String
            }
        }
    ],
    completeSessions: [
        {
            package: {
                type: Schema.Types.ObjectId,
                ref: 'Package'
            },
            student: {
                type: Schema.Types.ObjectId,
                ref: "Student"
            },
            purchaseDate: {
                type: String,
                trim: true
            },
            purchasedSessionId: {
                type: String,
                trim: true
            },
            imageOfProof: {
                type: String
            },
            status: {
                type: String,
                trim: true
            }
        }
    ],
    verifiedFromAdmin: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    feedBack: [
        {
            owner: {
                type: Schema.Types.ObjectId,
                ref: 'Student',
            },
            rating: {
                type: Number,
                min: 1,
                max: 5
            }
        }
    ],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    about: {
        type: String
    },
    languages: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length <= 3;
            },
            message: "You can select up to 3 languages only.",
        },
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
        },
        paymentInfo: {
            type: String,
        },
        accountHolderName: {
            type: String
        },
        ifscCode: {
            type: String
        }
    },
    wallet: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    totalReferrals: {
        type: Number,
        default: 0
    },
    referralsCode: {
        type: String
    },
    activate: {
        type: Boolean,
        default: true
    },
    notifications: [
        {
            message: {
                type: String
            },
            isRead: {
                type: Boolean,
                default: false
            }
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

mentorSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

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