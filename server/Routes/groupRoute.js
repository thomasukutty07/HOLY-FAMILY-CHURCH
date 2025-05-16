import express from 'express'
import {
    createGroup,
    deleteGroup,
    deleteGroupImage,
    fetchAllGroups,
    uploadGroupImage,
    updateGroup
} from '../Controllers/groupController.js'

import { upload } from '../Middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', fetchAllGroups)
router.post("/create-group", createGroup)
router.post("/upload-image", upload.single("image"), uploadGroupImage)
router.delete('/delete/:groupId', deleteGroup)
router.delete('/delete-image/:publicId', deleteGroupImage)
router.put('/update/:id', updateGroup)

export default router
