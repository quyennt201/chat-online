import mongoose, { Schema } from "mongoose";

const userSchema = new Schema
    (
        {
            username: String,
            email: String,
            password: {
                type: String, 
                select: false
            },
            avatar: String,
            createdAt: String
        },
        { timestamps: true }
    )

const User = mongoose.model('User', userSchema)
export default User 