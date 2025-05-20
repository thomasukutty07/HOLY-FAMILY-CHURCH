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
        // Validate required fields
        const requiredFields = ['name', 'sex', 'baptismName', 'isActive', 'role'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });
        
        if (missingFields.length > 0) {
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

        const newMember = new Member(memberData);
        await newMember.save();
        
        res.status(201).json({
            success: true,
            message: "Member created successfully",
            data: newMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all members
export const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('family');
        res.status(200).json({
            success: true,
            members: members
        });
    } catch (error) {
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
            .select('name dateOfBirth family');
            
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
        const { familyId } = req.params;
        
        const members = await Member.find({ family: familyId });
        
        res.status(200).json({ 
            success: true, 
            members: members 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error occurred while fetching family members" 
        });
    }
};

export const deleteMemberImage = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        // Remove any 'church/' prefix if it exists
        const cleanPublicId = publicId.replace(/^church\//, '');
        
        // Add 'church/' prefix for Cloudinary
        const cloudinaryPublicId = "church/" + cleanPublicId;
        
        const result = await cloudinary.uploader.destroy(cloudinaryPublicId);

        if (result.result === "ok") {
            return res.status(200).json({ 
                success: true, 
                message: "Image removed successfully." 
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Image not found or already deleted." 
            });
        }

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while deleting the image.",
            error: error.message 
        });
    }
};

// Public endpoint for vicar, coordinator, teacher, sister, mother info
export const getPublicMembers = async (req, res) => {
  try {
    const publicRoles = ['vicar', 'coordinator', 'teacher', 'sister', 'sister_superior'];
    const members = await Member.find(
      { role: { $in: publicRoles }, imageUrl: { $exists: true, $ne: '' } },
      'name imageUrl role'
    );
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public members' });
  }
};
