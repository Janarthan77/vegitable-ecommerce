import { Router } from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = Router();

// POST /api/upload - multipart form-data with 'image' field
router.post('/', upload.single('image'), uploadImage);

export default router;
