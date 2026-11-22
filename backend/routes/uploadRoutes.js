import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @desc    Upload single file (image or video)
 * @route   POST /api/upload
 * @access  Private / Admin & Store Admin
 */
router.post('/', protect, admin, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return sendError(res, 400, err.message || 'File upload failed');
    }

    if (!req.file) {
      return sendError(res, 400, 'Please select a file to upload');
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return sendSuccess(res, 201, 'File uploaded successfully', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
    });
  });
});

export default router;

