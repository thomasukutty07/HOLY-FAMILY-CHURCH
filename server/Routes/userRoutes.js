import express from 'express';
import { upload } from '../Middleware/uploadMiddleware.js';
import { addUser, deleteUser, fetchAllUsers, updateUser, uploadUserImage } from '../Controllers/userController.js';

const router = express.Router();

router.post("/add-user", addUser);
router.get("/fetch-users", fetchAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user/:id", updateUser);
router.post("/upload-image", upload.single("image"), uploadUserImage);


export default router;
