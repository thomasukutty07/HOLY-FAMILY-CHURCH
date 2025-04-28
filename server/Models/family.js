import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
    familyName: { type: String, required: true },
    imageUrl: { type: String },
    publicId: { type: String },
    contactNo: { type: String, required: true },
    groupId: { type: mongoose.Schema.ObjectId, ref: "Group", default: null }
})

export default mongoose.model("Family", familySchema, "Families")