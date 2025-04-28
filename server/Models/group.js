import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    imageUrl: { type: String },
    publicId: { type: String },
    groupName: { type: String, required: true, trim: true },
    leaderName: { type: String, required: true, trim: true },
    secretaryName: { type: String, required: true, trim: true }
})

export default mongoose.model("Groups", groupSchema, "Groups")