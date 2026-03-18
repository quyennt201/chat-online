import { randomUUID } from "crypto";
import { Schema } from "mongoose";

export const ConversationSchema = new Schema({
    id: randomUUID(),
    members: [String, String],
    lastMessage: String,
    updatedAt: String,
})