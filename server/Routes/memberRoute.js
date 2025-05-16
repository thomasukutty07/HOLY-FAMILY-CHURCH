import express from 'express';
import { upload } from '../Middleware/uploadMiddleware.js';
import {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    getBirthdays,
    fetchFamilyWithMembers,
    uploadMemberImage,
    deleteMemberImage
} from '../Controllers/memberController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/birthdays', getBirthdays);

// Protected routes
router.use(authMiddleware);
router.get('/', getAllMembers);
router.post("/members", createMember);
router.get("/members/:id", getMemberById);
router.put("/members/update/:id", updateMember);
router.delete("/members/:id", deleteMember);
router.post("/upload-image", upload.single("image"), uploadMemberImage);
router.delete("/member/delete-image/:publicId", deleteMemberImage);
router.get("/:familyId/members", fetchFamilyWithMembers);

export default router;
