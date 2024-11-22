import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                refPath: 'participantType', // Dynamic reference to Mentor or Student
                required: true
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message", // Message reference for the messages array
                default: []
            }
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message", // Reference to the last message in the conversation
        },
        participantType: {
            type: String,
            enum: ['Mentor', 'Student'], // Ensure that participants can only be Mentor or Student
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
