import express from 'express'
import { createFamily, fetchAllfFamilyNames, uploadFamilyImage } from '../Controllers/familyController.js'
import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()


router.post("/create", createFamily)
router.post("/upload-family-image", upload.single("image"), uploadFamilyImage)
router.get("/family-names", fetchAllfFamilyNames)

export default router