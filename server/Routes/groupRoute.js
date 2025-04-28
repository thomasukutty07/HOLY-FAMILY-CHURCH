import express from 'express'
import { createGroup, fetchAllGroupName, uploadGroupImage } from '../Controllers/groupController.js'
const router = express.Router()
import { upload } from '../Middleware/uploadMiddleware.js'
router.post("/create-group", createGroup)
router.get("/fetch-groups", fetchAllGroupName)
router.post("/upload-group-image", upload.single("image"), uploadGroupImage)

export default router