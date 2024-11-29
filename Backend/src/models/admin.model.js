import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    refreshToken: {
        type: String
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String
    },
    name: {
        type: String,
        default: 'NexMentor'
    },
    clearedAmount: [
        {
            id: {
                type: String
            },
            mentorId: {
                type: String
            },
            email: {
                type: String
            },
            amountCleared: {
                type: Number
            },
            imageOfProof: {
                type: String
            },
            clearDate: {
                type: String
            }
        }
    ],
    featuredMentors: [
        {
            id: {
                type: String
            },
            mentorId: {
                type: String
            },
            email: {
                type: String
            },
            state: {
                type: String
            },
            city: {
                type: String
            },
            feedBack: {
                type: [Object],
                default: [],
            }
        }
    ],
    updates: [
        {
            content: {
                type: String
            },
            date: {
                type: String
            }
        }
    ],
    testimonials: [
        {
            name: {
                type: String
            },
            image: {
                type: String
            },
            testimonial: {
                type: String
            }
        }
    ],
    featuredAd: {
        type: String
    },
    verificationAmount: {
        type: Number,
        default: 149
    },
    blogs: [
        {
            title: {
                type: String
            },
            content: {
                type: String
            },
            image: {
                type: String
            }
        }
    ],
    webinar: {
        image: {
            type: String
        },
        date: {
            type: String
        },
        day: {
            type: String
        },
        year: {
            type: String
        },
        content:{
            type:String
        }
    }
}, {
    timestamps: true
})

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = function () {
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

export const Admin = mongoose.model("Admin", adminSchema)