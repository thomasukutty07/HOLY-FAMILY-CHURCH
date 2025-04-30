import express from 'express'
import {
    createFamily,
    fetchAllFamilyNames,
    fetchFamiliesByGroup,
    uploadFamilyImage
} from '../Controllers/familyController.js'

import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()
router.post("/families", createFamily)
router.post("/families/upload-image", upload.single("image"), uploadFamilyImage)
router.get("/families/names", fetchAllFamilyNames)
router.get("/families/names/grouped", fetchFamiliesByGroup)

export default router
