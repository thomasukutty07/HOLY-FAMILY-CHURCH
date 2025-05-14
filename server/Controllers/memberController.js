import Member from "../Models/member.js";
import uploadToCloudinary from "../Helpers/cloudinaryHelper.js";
import cloudinary from "../Config/cloudinary.js";

// Upload Member Image
export const uploadMemberImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided."
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.buffer);

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
            imageUrl: url,
            publicId
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while uploading the image."
        });
    }
};
//  Add Member
export const addMember = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is missing." });
        }

        const {
            name,
            publicId,
            imageUrl,
            sex,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            family,
            isActive,
            group,
            married,
            role
        } = req.body;

        const newCreatedMember = new Member({
            name,
            imageUrl,
            publicId,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            sex,
            family,
            isActive,
            group,
            married,
            role
        });

        await newCreatedMember.save();

        return res.status(201).json({
            success: true,
            message: `Successfully added ${role.charAt(0).toUpperCase() + role.slice(1)}.`
        });

    } catch (error) {
        console.error("Add Member Error:", error.message);
        return res.status(500).json({ success: false, message: "An error occurred while creating the member." });
    }
};

export const fetchFamilyWithMembers = async (req, res) => {
    try {
        const { familyId } = req.params;
        const members = await Member.find({ family: familyId });

        res.status(200).json({ success: true, members });
    } catch (error) {
        console.error("Fetch Members Error:", error.message);
        res.status(500).json({ success: false, message: "Error occurred while fetching all members" });
    }
};

// Fetch All Members
export const fetchAllMembers = async (req, res) => {
    try {
        const fetchMembers = await Member.find({});

        if (!fetchMembers || fetchMembers.length === 0) {
            return res.status(404).json({ success: false, message: "No members found" });
        }

        return res.status(200).json({ success: true, members: fetchMembers });

    } catch (error) {
        console.error("Fetch Members Error:", error.message);
        res.status(500).json({ success: false, message: "Error occurred while fetching all members" });
    }
};
// Update Member
export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            publicId,
            imageUrl,
            sex,
            dateOfBirth,
            married,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            isActive,
            group,
            family,
            role
        } = req.body;

        const updatedFields = {
            name,
            imageUrl,
            married,
            publicId,
            isActive,
            sex,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            group,
            family,
            role
        };

        const updatedMember = await Member.findByIdAndUpdate(id, updatedFields, { new: true });

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            member: updatedMember
        });

    } catch (error) {
        console.error("Update Member Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating member"
        });
    }
};
// Delete Member
export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMember = await Member.findByIdAndDelete(id);

        if (!deletedMember) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Member deleted successfully",
            deletedMember
        });

    } catch (error) {
        console.error("Delete Member Error:", error.message);
        res.status(500).json({ success: false, message: "Error occurred while deleting member" });
    }
};
export const deleteMemberImage = async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy("church/" + publicId);

        if (result.result === "ok") {
            return res.status(200).json({ success: true, message: "Image removed successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Image not found or already deleted." });
        }

    } catch (error) {
        console.error("Delete Image Error:", error.message);
        res.status(500).json({ success: false, message: "An error occurred while deleting the image." });
    }
};
