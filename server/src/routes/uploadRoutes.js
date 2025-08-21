import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/image', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64, { folder: 'mern_blog' });
    res.status(201).json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

