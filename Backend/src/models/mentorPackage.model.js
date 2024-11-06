import mongoose, { Schema } from "mongoose";


const packageSchema = new Schema(
    {
        packageName: {
            type: String,
            required: true,
            trim: true,
            default: "this is the name of the title" // this can be changed by admin
        },
        packageDescription: {
            type: String,
            required: true,
            trim: true,
            default: "this is the description of the title and this can only accessed by admin" // this can be changed by admin

        },
        packagePrice: {
            type: Number,
            default: 0
        },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'Mentor',
            required: true
        },
        neetScore: {
            type: Number,
            trim: true
        }
    }, {
    timestamps: true
})

export const Package = mongoose.model("Package", packageSchema)
