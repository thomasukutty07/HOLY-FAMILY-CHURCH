import express from 'express'
import {
    createGroup,
    deleteGroup,
    deleteGroupImage,
    fetchGroupsWithFamilies,
    uploadGroupImage
} from '../Controllers/groupController.js'

import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()

router.post("/", createGroup)
router.post("/upload-image", upload.single("image"), uploadGroupImage)
router.delete('/delete/:groupId', deleteGroup)
router.delete('/delete-image/:publicId', deleteGroupImage)
router.get("/names/grouped/", fetchGroupsWithFamilies)

export default router
