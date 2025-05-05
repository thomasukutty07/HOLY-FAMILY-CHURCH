import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        trim: true
    },
    publicId: {
        type: String,
        trim: true
    },
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    leaderName: {
        type: String,
        required: true,
        trim: true
    },
    secretaryName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);
