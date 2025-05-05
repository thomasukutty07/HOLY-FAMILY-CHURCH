import express from 'express'
import {
    createFamily,
    deleteFamilyImage,
    uploadFamilyImage
} from '../Controllers/familyController.js'

import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()
router.post("/", createFamily)
router.post("/upload-image", upload.single("image"), uploadFamilyImage)
router.delete("/delete-image/:publicId", deleteFamilyImage)

export default router
