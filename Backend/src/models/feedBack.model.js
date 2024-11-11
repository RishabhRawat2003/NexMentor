import mongoose, { Schema } from "mongoose"

const feedbackSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    {
        timestamps: true
    }
)

export const Feedback = mongoose.model("Feedback", feedbackSchema)