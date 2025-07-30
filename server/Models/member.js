import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    sex: { type: String, trim: true, required: true },
    baptismName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    married: {
        type: Boolean, set: v => v === '' ? undefined : v
    },
    marriageDate: { type: Date },
    dateOfDeath: { type: Date },
    baptismDate: { type: Date },
    isActive: { type: Boolean, required: true },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        set: v => v === '' ? undefined : v
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups",
        set: v => v === '' ? undefined : v
    },

    role: {
        type: String,
        enum: [
            "member",
            "vicar",
            "sister",
            "mother",
            "teacher",
            "coordinator",
            "group-leader",
            "group-secretary"
        ],
        default: "member"
    }
}, {
    timestamps: true
});

export default mongoose.model("Member", memberSchema,);
