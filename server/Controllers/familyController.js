import Family from "../Models/family.js"
import uploadToCloudinary from "../Helpers/cloudinaryHelper.js";
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
        const { familyName, groupId, imageUrl, publicId, contactNo } = req.body
        const newFamily = new Family({
            familyName, groupId, imageUrl, publicId, contactNo
        })
        if (!newFamily) {
            return res.status(401).json({ success: false, message: "Family creation failed" })
        }
        await newFamily.save()

        return res.status(201).json({ success: true, message: "Family created", newFamily })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create family" })
    }
}

export const fetchAllfFamilyNames = async (req, res) => {
    try {
        const allFamilyNames = await Family.find({}, "familyName")
        if (allFamilyNames) {
            res.status(200).json({ success: true, familyNames: allFamilyNames })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch family names" })

    }
}
export const updateFamily = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update family" })

    }
}
export const fetchFamily = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update family" })

    }
}
export const deleteFamily = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete family" })

    }
}