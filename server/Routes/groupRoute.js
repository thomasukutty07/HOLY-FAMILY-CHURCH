import express from 'express'
import {
    createGroup,
    fetchAllGroupName,
    uploadGroupImage
} from '../Controllers/groupController.js'

import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()

router.post("/groups", createGroup)
router.get("/groups", fetchAllGroupName)
router.post("/groups/upload-image", upload.single("image"), uploadGroupImage)

export default router
