import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const studentSchema = new Schema({
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
        type: number,
        trim: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: '' // make a default image
    },
    refreshToken: {
        type: String,
    },
    educationalDetails: {
        currentClass: {
            type: String,
            trim: true
        },
        currentCollege: {
            collegeName: {
                type: String,
                trim: true
            },
            batch: {
                type: String,
                trim: true
            },
            year: {
                type: String,
                trim: true
            }
        },
        dropout: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
})

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

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