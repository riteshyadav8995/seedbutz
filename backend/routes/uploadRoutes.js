const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'seednutz_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `product-${Date.now()}`,
  },
});

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload image
// @access  Private/Admin
router.post('/', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // req.file.path contains the absolute Cloudinary URL
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
