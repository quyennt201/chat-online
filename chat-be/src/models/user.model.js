import mongoose, { Schema } from "mongoose";

const userSchema = new Schema
    (
        {
            username: String,
            email: String,
            password: String,
            avatar: String,
            createdAt: String
        },
        { timestamps: true }
    )

const User = mongoose.model('User', userSchema)
export default User 