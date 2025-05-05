import express from 'express';
import { upload } from '../Middleware/uploadMiddleware.js';
import {
    addMember,
    deleteMember,
    deleteMemberImage,
    fetchAllMembers,
    updateMember,
    uploadMemberImage
} from '../Controllers/memberController.js';

const router = express.Router();
router.post("/members", addMember);
router.get("/members", fetchAllMembers);
router.delete("/members/:id", deleteMember);
router.put("/members/:id", updateMember);
router.post("/members/upload-image", upload.single("image"), uploadMemberImage);
router.delete("/member/delete-image/:publicId", deleteMemberImage);

export default router;
