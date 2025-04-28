import uploadToCloudinary from '../Helpers/cloudinaryHelper.js'
import Group from '../Models/group.js'

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
        const { secretaryName, imageUrl, publicId, leaderName, groupName } = req.body
        const newGroup = new Group({
            secretaryName,
            imageUrl,
            publicId,
            leaderName,
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

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while deleting group" })
    }
}
export const fetchAllGroupName = async (req, res) => {
    try {
        const groupNames = await Group.find({})
        if (!groupNames) {
            return res.status(500).json({ success: false, message: "Someting went wrong" })
        }
        return res.status(200).json({ success: true, data: groupNames })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while getting group name" })
    }
}
export const fetchAllGroup = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while fetching groups" })
    }
}

