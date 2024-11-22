import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../app.js";
import { Student } from "../models/student.model.js";

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { message, participantType } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Validate the participantType before proceeding
        if (!['Mentor', 'Student'].includes(participantType)) {
            return res.status(400).json(new ApiResponse(400, {}, "Invalid participant type"));
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            // If no conversation exists, create one
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                participantType, // Set participantType from frontend
            });
        }

        // Create and save the message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            senderType: participantType === 'Mentor' ? 'Mentor' : 'Student',
            receiverType: participantType === 'Mentor' ? 'Student' : 'Mentor',
        });

        // Push the new message's _id into the conversation's messages array
        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit the new message to the receiver via socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            newMessage.read = true; // Mark as read
            await newMessage.save();
        }

        return res.status(200).json(new ApiResponse(200, newMessage, "Message sent successfully"));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error while sending message");
    }
});


const getMessages = asyncHandler(async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Fetch the conversation and populate the messages
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json(new ApiResponse(200, [], "No messages found"));
        }

        return res.status(200).json(new ApiResponse(200, conversation.messages, ""));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error while fetching messages");
    }
});

const getConversationUsersForMentors = asyncHandler(async (req, res) => {
    try {
        const mentorId = req.user._id; // Assuming the authenticated mentor's ID is available on `req.user._id`

        // Find conversations where the mentor is a participant
        const conversations = await Conversation.find({
            participants: { $in: [mentorId] },
        }).populate({
            path: 'participants',
            select: '_id username profilePicture',
            model: 'Student', // Populates only student details
        });

        // Extract the "other" participant details who are students
        const students = conversations
            .map((conversation) => {
                // Exclude mentor from participants to get the student
                return conversation.participants.find(
                    (participant) =>
                        !participant._id.equals(mentorId)
                );
            })
            .filter((student) => student); // Remove undefined entries

        // Get the last message for each conversation
        const lastMessagesMap = await lastMessage(mentorId);
        // Combine student details with their last messages
        const studentsWithLastMessages = students.map((student) => ({
            ...student.toObject(),
            lastMessage: lastMessagesMap[student._id.toString()] || null,
        }));

        return res
            .status(200)
            .json(new ApiResponse(200, studentsWithLastMessages, "Students and their last messages retrieved successfully"));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error while retrieving conversation users");
    }
});

// Get the last message in each conversation for the user
const lastMessage = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId
        }).populate('messages', '_id read message receiverId');

        const lastMessageMap = {};

        conversations.forEach(conversation => {
            const messages = conversation.messages;
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const otherParticipant = conversation.participants.find(participant => participant._id.toString() !== userId.toString());
                if (otherParticipant) {
                    lastMessageMap[otherParticipant._id.toString()] = lastMessage;
                }
            }
        });

        return lastMessageMap;

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal server error");
    }
};

const readMessage = asyncHandler(async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Find conversation and populate messages
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation) {
            throw new ApiError(404, "Conversation not found");
        }

        // Mark unread messages as read
        let unreadMessages = conversation.messages.filter((msg) => !msg.read);
        if (unreadMessages.length > 0) {
            unreadMessages.forEach(async (msg) => {
                msg.read = true;
                await msg.save();
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, unreadMessages, "Messages marked as read successfully"));
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Error while marking messages as read");
    }
});

//used to get info about student this is used in mentor
const searchUserDetails = asyncHandler(async (req, res) => {
    const { searchedUserId } = req.body

    if (!searchedUserId) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide a valid id "))
    }

    const student = await Student.findById(searchedUserId).select("username profilePicture")

    if (!student) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, student, "Student details fetched successfully"))

})

export { sendMessage, getMessages, getConversationUsersForMentors, readMessage, searchUserDetails };
