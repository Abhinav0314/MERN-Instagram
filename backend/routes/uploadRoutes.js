const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');
const path = require('path');

const router = express.Router();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'instagram_clone', // This will be the folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({ 
    storage: storage 
});

// Endpoint for uploading an image
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        // Cloudinary automatically returns the secure URL in req.file.path
        const imageUrl = req.file.path;
        
        res.status(200).json({ success: true, imageUrl: imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
