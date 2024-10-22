import mongoose, { Schema } from "mongoose"

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: ["Mentor", "Student"],
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: []
            }
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true
    }
)

export const Conversation = mongoose.model("Conversation", conversationSchema)