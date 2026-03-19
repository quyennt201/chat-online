import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema
    (
        {
            members: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User",
                required: true
            },
            messages: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "Message",
                default: []
            },
            lastMessage: String,
            updatedAt: String,
        },
        { timestamps: true }
    )

const Conversation = mongoose.model('Conversation', ConversationSchema)
export default Conversation