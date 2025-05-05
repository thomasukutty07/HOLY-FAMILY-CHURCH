import Family from "../Models/family.js"
import Group from '../Models/group.js'
import mongoose from "mongoose";
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
        const { familyName, group, imageUrl, publicId, contactNo, address, headOfFamily } = req.body
        const newFamily = new Family({
            familyName, group, imageUrl, publicId, contactNo, address, headOfFamily
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
        const { group } = req.params
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete family" })

    }
}
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

