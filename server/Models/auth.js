import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
})

export default mongoose.model("Auth", authSchema, "Authentication")