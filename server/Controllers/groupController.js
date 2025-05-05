import cloudinary from '../Config/cloudinary.js'
import uploadToCloudinary from '../Helpers/cloudinaryHelper.js'
import Group from '../Models/group.js'
import Member from '../Models/member.js'
import Family from '../Models/family.js'

export const uploadGroupImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({ success: false, message: "Image is missing" })
        }

        const { url, publicId } = await uploadToCloudinary(req.file.buffer)
        return res.status(200).json({ success: true, message: "Group image uploaded successfully", imageUrl: url, publicId })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while uploading image" })
    }
}
export const createGroup = async (req, res) => {
    try {
        const { secretaryName, imageUrl, publicId, leaderName, groupName, location } = req.body
        const newGroup = new Group({
            secretaryName,
            imageUrl,
            publicId,
            leaderName
            , location,
            groupName
        })
        const savedGroup = await newGroup.save()
        if (!savedGroup) {
            return res.status(500).json({ success: false, message: "Something wrong" })
        }
        return res.status(201).json({ success: true, message: "Group Created" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while creating group" })
    }
}
export const updateGroup = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while updating group" })
    }
}
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }
        if (group.publicId) {
            await cloudinary.uploader.destroy(group.publicId);
        }
        await Family.deleteMany({ group });
        await Member.deleteMany({ group });
        await Group.findByIdAndDelete(groupId);

        return res.status(200).json({ success: true, message: "Group deleted successfully along with related Family and Member data" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while deleting group" });
    }
};

export const fetchAllGroup = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while fetching groups" })
    }
}

export const deleteGroupImage = async (req, res) => {
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
export const fetchGroupsWithFamilies = async (req, res) => {
    try {
        const groups = await Group.aggregate([
            {
                $lookup: {
                    from: "families",
                    localField: "_id",
                    foreignField: "group",
                    as: "families"
                }
            },
            {
                $addFields: {
                    totalFamilies: { $size: "$families" }
                }
            }
        ]);

        return res.status(200).json({ success: true, data: groups });

    } catch (error) {
        console.error("Error fetching groups with families:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch group data",
            error: error.message
        });
    }
};

