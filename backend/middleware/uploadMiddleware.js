import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backend/uploads folder exists reliably regardless of working directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const isVideo = file.mimetype.startsWith('video/') || /mp4|webm|mov|mkv/i.test(ext);
    const prefix = isVideo ? 'video' : 'img';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

// File validation filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpg|jpeg|png|webp|avif|svg|mp4|webm|mov|mkv/i;
  const isExtAllowed = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const isMimeAllowed =
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/octet-stream';

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Supported formats: JPG, PNG, WebP, SVG, MP4, WebM, MOV (Max 100MB)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max (ideal for high-quality hero videos and images)
  fileFilter
});

export default upload;
