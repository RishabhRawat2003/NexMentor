import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        recipientId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
    }, {
    timestamps: true
})

export const Notification = mongoose.model("Notification", notificationSchema)