import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: false,
    },
    familyName: {
        type: String,
        required: true,
        trim: true,
    },
    headOfFamily: {
        type: String,
        required: true,
        trim: true,
    },
    contactNo: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
        trim: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model("Family", familySchema);
