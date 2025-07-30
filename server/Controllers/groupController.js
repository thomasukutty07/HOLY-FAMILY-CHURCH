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
        const { id } = req.params;
        const { groupName, leaderName, secretaryName, location, imageUrl, publicId } = req.body;

        const updatedFields = {
            groupName,
            leaderName,
            secretaryName,
            location,
            imageUrl,
            publicId
        };

        const updatedGroup = await Group.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ 
                success: false, 
                message: "Group not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Group updated successfully", 
            group: updatedGroup 
        });
    } catch (error) {
        console.error("Update group error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error while updating group" 
        });
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

        await Family.deleteMany({ group: group._id });
        await Member.deleteMany({ group: group._id });
        await Group.findByIdAndDelete(groupId);

        return res.status(200).json({ success: true, message: "Group deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while deleting group" });
    }
};
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
export const fetchAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({})
        if (groups.length === 0) {
            return res.status(404).json({ success: false, message: "No groups found" })
        }

        const groupWithFamilyCount = await Promise.all(
            groups.map(async (group) => {
                const familyCount = await Family.countDocuments({ group: group._id })
                return {
                    ...group.toObject(),
                    totalFamilies: familyCount
                }
            })
        )
        return res.status(200).json({ success: true, groups: groupWithFamilyCount })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while fetching groups" })
    }
}

