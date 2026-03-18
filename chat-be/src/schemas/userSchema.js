import { randomUUID } from "crypto";
import { Schema } from "mongoose";

export const userSchema = new Schema({
    id: randomUUID(),
    username: String,
    email: String,
    password: String,
    avatar: String,
    createdAt: String
})