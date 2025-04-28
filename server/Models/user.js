import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    sex: { type: String, trim: true, required: true },
    baptismName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    married: { type: Boolean, required: true },
    marriageDate: { type: Date },
    dateOfDeath: { type: Date },
    baptismDate: { type: Date },
    isActive: { type: Boolean, required: true },
    familyId: {
        type: mongoose.Schema.ObjectId,
        ref: "Family"
    },
    groupId: { type: mongoose.Schema.ObjectId, ref: "Groups" },
    role: {
        type: String,
        enum: ["member", "teacher", "coordinator", "group-leader", "group-secretary"],
        default: "member"
    }
}, {
    timestamps: true
});


export default mongoose.model("User", userSchema, "Users")