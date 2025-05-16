import express from 'express'
import {
    createFamily,
    deleteFamily,
    deleteFamilyImage,
    fetchAllFamily,
    fetchFamilyWithGroup,
    updateFamily,
    uploadFamilyImage
} from '../Controllers/familyController.js'

import { upload } from '../Middleware/uploadMiddleware.js'


const router = express.Router()
router.get("/", fetchAllFamily)
router.post("/create-family", createFamily)
router.post("/upload-image", upload.single("image"), uploadFamilyImage)
router.delete("/delete-image/:publicId", deleteFamilyImage)
router.delete("/delete/:familyId", deleteFamily)
router.get("/:groupId/families", fetchFamilyWithGroup)
router.put("/update/:familyId", updateFamily)

export default router
