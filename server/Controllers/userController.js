import User from "../Models/user.js";
import uploadToCloudinary from "../Helpers/cloudinaryHelper.js";
export const uploadUserImage = async (req, res) => {
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
        res.status(400).json({
            success: false,
            message: "An error occurred while uploading the image."
        });
    }
};

//: Add User
export const addUser = async (req, res) => {
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
            familyId,
            isActive,
            groupId,
            married,
            role
        } = req.body;
        const newlCreatedUser = new User({
            name,
            imageUrl,
            publicId,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            sex,
            familyId,
            isActive, groupId,
            married,
            role
        });

        await newlCreatedUser.save();
        return res.status(201).json({
            success: true,
            message: `Successfully added a ${role.charAt(0).toUpperCase() + role.slice(1)}.`
        });

    } catch (error) {
        console.error("Add User Error:", error.message);
        return res.status(500).json({ success: false, message: "An error occurred while creating the user." });
    }
};

//  Fetch All Users Controller
export const fetchAllUsers = async (req, res) => {
    try {
        const fetchUsers = await User.find({});

        if (!fetchUsers || fetchUsers.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        return res.status(200).json({ success: true, users: fetchUsers });
    } catch (error) {
        console.error("Fetch Users Error:", error.message);
        res.status(400).json({ success: false, message: "Error occurred while fetching all users" });
    }
};

//  Update User Controller
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            publicId,
            imageUrl, sex,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            groupName,
            baptismDate, groupId,
            familyId,
            role
        } = req.body;

        const updatedFields = {
            name,
            imageUrl,
            publicId,
            sex,
            dateOfBirth,
            marriageDate,
            dateOfDeath,
            baptismName,
            baptismDate,
            familyName,
            groupId,
            familyId,
            role
        };
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        res.status(200).json({
            success: true,
            message: "Updated Successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update User Error:", error.message);
        res.status(400).json({
            success: false,
            message: "Error occurred while updating user"
        });
    }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser
        });

    } catch (error) {
        console.error("Delete User Error:", error.message);
        res.status(400).json({ success: false, message: "Error occurred while deleting user" });
    }
};

