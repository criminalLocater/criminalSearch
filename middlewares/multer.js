// ./middlewares/multer.middleware.js
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  }
});

// File Filter for Validation
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
  cb(null, true);
};

// Configure Multer for single file upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

module.exports = upload;