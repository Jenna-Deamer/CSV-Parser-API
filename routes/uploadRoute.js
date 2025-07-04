const express = require('express');
const multer = require('multer'); // Middleware for handling file uploads
const uploadController = require('../controllers/uploadController');

// define a new router instance
const router = express.Router();

// Configure multer for file uploads
// memoryStorage() keeps uploaded files in memory as Buffer objects instead of saving to disk
// This is useful for processing files immediately without temporary file storage
const upload = multer({ storage: multer.memoryStorage() });

// Define the route for file uploads
// 1. upload.single('file') - Multer processes the uploaded file with field name 'file'
// 2. uploadController.handleUpload - Our custom controller handles the business logic
router.post('/upload', upload.single('file'), uploadController.handleUpload);

module.exports = router;
