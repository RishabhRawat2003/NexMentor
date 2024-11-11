import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'


const studentSchema = new Schema({
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
            return !this.googleId && !this.linkedinId; // Password is required only if no social login IDs are present
        },
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
    googleId: {
        type: String
    },
    linkedinId: {
        type: String
    },
    number: {
        type: Number,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: '' // make a default image
    },
    refreshToken: {
        type: String,
    },
    currentClass: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    purchasedSessions: [
        {
            package: {
                type: Schema.Types.ObjectId,
                ref: 'Package'
            },
            mentor: {
                type: Schema.Types.ObjectId,
                ref: "Mentor"
            },
            purchaseDate: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                trim: true
            }
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    completeSessions: [
        {
            package: {
                type: Schema.Types.ObjectId,
                ref: 'Package'
            },
            mentor: {
                type: Schema.Types.ObjectId,
                ref: "Mentor"
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
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
}, {
    timestamps: true
})

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

studentSchema.methods.generateAccessToken = function () {
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

studentSchema.methods.generateRefreshToken = function () {
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

export const Student = mongoose.model("Student", studentSchema)