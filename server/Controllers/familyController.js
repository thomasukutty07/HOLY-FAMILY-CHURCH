import Family from "../Models/family.js"
import Member from "../Models/member.js"
import uploadToCloudinary from "../Helpers/cloudinaryHelper.js";
import cloudinary from "../Config/cloudinary.js";
export const uploadFamilyImage = async (req, res) => {
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
            message: "Family Image uploaded",
            imageUrl: url,
            publicId
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(400).json({
            success: false,
            message: "An error occurred while uploading the image."
        });
    }
};
export const createFamily = async (req, res) => {
    try {
        const { familyName, group, imageUrl, publicId, contactNo, address, location, headOfFamily } = req.body;

        const newFamily = new Family({
            familyName, group, imageUrl, publicId, contactNo, address, headOfFamily, location
        });
        
        if (!newFamily) {
            return res.status(401).json({ success: false, message: "Family creation failed" });
        }
        
        await newFamily.save();
        return res.status(201).json({ success: true, message: "Family created", newFamily });
    } catch (error) {
        console.error("Create family error:", error);
        return res.status(500).json({ success: false, message: "Failed to create family" });
    }
}
export const updateFamily = async (req, res) => {
    try {
        const { familyId } = req.params
        const { familyName, group, imageUrl, publicId, contactNo, address, location, headOfFamily } = req.body
        const updatedFields = {
            familyName, group, imageUrl, publicId, contactNo, address, location, headOfFamily
        }
        const updatedFamily = await Family.findByIdAndUpdate(familyId, updatedFields, { new: true })
        res.status(200).json({ success: true, message: "Family Updated", family: updatedFamily })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update family" })

    }
}
export const deleteFamily = async (req, res) => {
    try {
        const { familyId } = req.params

        const family = await Family.findById(familyId)
        if (!family) {
            return res.status(404).json({ success: false, message: "Family Not found" })
        }
        if (family.publicId) {
            await cloudinary.uploader.destroy(family.publicId)
        }

        await Member.deleteMany({ family: family._id })
        await Family.findByIdAndDelete(familyId)
        return res.status(200).json({ success: true, message: "Family Deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete family" })

    }
}
export const fetchAllFamily = async (req, res) => {
    try {
        console.log("Fetching all families...");
        const families = await Family.find({});
        console.log("Found families:", families);
        
        if (families.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No families found" 
            });
        }

        const familyWithMemberCount = await Promise.all(
            families.map(async (family) => {
                const memberCount = await Member.countDocuments({ family: family._id });
                return {
                    ...family.toObject(),
                    totalMembers: memberCount,
                    displayName: `${family.familyName} (${family.headOfFamily})`
                };
            })
        );
        
        console.log("Families with member count:", familyWithMemberCount);
        return res.status(200).json({ 
            success: true, 
            families: familyWithMemberCount 
        });
    } catch (error) {
        console.error("Error in fetchAllFamily:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch families" 
        });
    }
};
export const deleteFamilyImage = async (req, res) => {
    try {
        const { publicId } = req.params

        const result = await cloudinary.uploader.destroy("church/" + publicId)
        if (result.result === "ok") {
            return res.status(200).json({ success: true, message: "Image removed successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Image not found or already deleted." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete family" })

    }
}
export const fetchFamilyWithGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const families = await Family.find({ group: groupId });

        return res.status(200).json({ success: true, data: families });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while fetching families", error: error.message });
    }
}


