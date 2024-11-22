import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            refPath: 'senderType', // Dynamic reference to Mentor or Student
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            refPath: 'receiverType', // Dynamic reference to Mentor or Student
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        senderType: {
            type: String,
            enum: ['Mentor', 'Student'], // Allow only Mentor or Student
            required: true,
        },
        receiverType: {
            type: String,
            enum: ['Mentor', 'Student'], // Allow only Mentor or Student
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", messageSchema);
