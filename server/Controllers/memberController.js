import Member from "../Models/member.js";
import uploadToCloudinary from "../Helpers/cloudinaryHelper.js";
import cloudinary from "../Config/cloudinary.js";
import Family from "../Models/family.js";

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
        res.status(500).json({
            success: false,
            message: "An error occurred while uploading the image."
        });
    }
};

// Create a new member
export const createMember = async (req, res) => {
    try {
        console.log("Creating member with data:", req.body);
        
        // Validate required fields
        const requiredFields = ['name', 'sex', 'baptismName', 'isActive', 'role'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });
        
        if (missingFields.length > 0) {
            console.log("Missing required fields:", missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Convert string values to appropriate types
        const memberData = {
            ...req.body,
            married: req.body.married === 'true' || req.body.married === true,
            isActive: req.body.isActive === 'true' || req.body.isActive === true,
            dateOfBirth: req.body.dateOfBirth || undefined,
            marriageDate: req.body.marriageDate || undefined,
            dateOfDeath: req.body.dateOfDeath || undefined
        };

        // Remove empty strings for optional fields
        Object.keys(memberData).forEach(key => {
            if (memberData[key] === '') {
                delete memberData[key];
            }
        });

        console.log("Processed member data:", memberData);

        const newMember = new Member(memberData);
        await newMember.save();
        
        console.log("Member created successfully:", newMember);
        
        res.status(201).json({
            success: true,
            message: "Member created successfully",
            data: newMember
        });
    } catch (error) {
        console.error("Error creating member:", error);
        res.status(500).json({
            success: false,
            message: "Error creating member",
            error: error.message
        });
    }
};

// Get all members
export const getAllMembers = async (req, res) => {
    try {
        console.log("Fetching all members...");
        const members = await Member.find().populate('family');
        console.log("Found members:", members);
        res.status(200).json({
            success: true,
            members: members
        });
    } catch (error) {
        console.error("Error in getAllMembers:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching members"
        });
    }
};

// Get member by ID
export const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('family');
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
        res.status(200).json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching member"
        });
    }
};

// Update member
export const updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('family');
        
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Member updated successfully",
            data: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating member"
        });
    }
};

// Delete member
export const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Member deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting member"
        });
    }
};

// Get birthdays
export const getBirthdays = async (req, res) => {
    try {
        const members = await Member.find({ dateOfBirth: { $exists: true } })
            .populate('family')
            .select('name dateOfBirth family role');
            
        res.status(200).json({
            success: true,
            members: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching birthdays"
        });
    }
};

export const fetchFamilyWithMembers = async (req, res) => {
    try {
        console.log("Fetching family members...");
        const { familyId } = req.params;
        console.log("Family ID:", familyId);
        
        const members = await Member.find({ family: familyId });
        console.log("Found members:", members);
        
        res.status(200).json({ 
            success: true, 
            members: members 
        });
    } catch (error) {
        console.error("Error in fetchFamilyWithMembers:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error occurred while fetching family members" 
        });
    }
};

export const deleteMemberImage = async (req, res) => {
    try {
        const { publicId } = req.params;
        console.log("Attempting to delete image with publicId:", publicId);
        
        if (!publicId) {
            console.error("No publicId provided");
            return res.status(400).json({ 
                success: false, 
                message: "No image ID provided" 
            });
        }
        
        // Remove any existing 'church/' prefix to avoid double prefixing
        const cleanPublicId = publicId.replace(/^church\//, '');
        const fullPublicId = `church/${cleanPublicId}`;
        
        console.log("Deleting image with full publicId:", fullPublicId);
        const result = await cloudinary.uploader.destroy(fullPublicId);
        console.log("Cloudinary delete result:", result);

        if (result.result === "ok") {
            return res.status(200).json({ 
                success: true, 
                message: "Image removed successfully." 
            });
        } else {
            console.error("Image deletion failed:", result);
            return res.status(404).json({ 
                success: false, 
                message: "Image not found or already deleted." 
            });
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while deleting the image.",
            error: error.message 
        });
    }
};

// Get public members
export const getPublicMembers = async (req, res) => {
    try {
        const publicRoles = ["vicar", "coordinator", "teacher", "sister", "sister_superior"];
        const members = await Member.find({ role: { $in: publicRoles } })
            .select('name role imageUrl')
            .sort({ role: 1 });
            
        res.status(200).json({
            success: true,
            members: members
        });
    } catch (error) {
        console.error("Error in getPublicMembers:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching public members"
        });
    }
};
