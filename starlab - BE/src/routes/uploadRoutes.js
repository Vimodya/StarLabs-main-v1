import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'starlabs_assets',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage });

// @desc    Upload an image
// @route   POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }
    res.status(200).json({
      success: true,
      url: req.file.path,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

export default router;
