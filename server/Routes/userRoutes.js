import express from 'express';
import { upload } from '../Middleware/uploadMiddleware.js';
import {
    addUser,
    deleteUser,
    fetchAllUsers,
    updateUser,
    uploadUserImage
} from '../Controllers/userController.js';

const router = express.Router();
router.post("/users", addUser);
router.get("/users", fetchAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.post("/users/upload-image", upload.single("image"), uploadUserImage);

export default router;
