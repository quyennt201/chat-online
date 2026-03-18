import { randomUUID } from "crypto"
import { Schema } from "mongoose"

export const MessageSchema = new Schema({
    id: randomUUID(),
    conversationId: String,
    senderId: String,
    text: String,
    createdAt: String
})