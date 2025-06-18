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

// Limits: Max 5 files, each under 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 5                // Max 5 files
  }
});

// Wrap multer upload.array() middleware to validate count
const validatePhotoUpload = (req, res, next) => {
  const minFiles = 1;
  const maxFiles = 5;
  if (!req.files || req.files.length < minFiles) {
    return res.status(400).json({
      success: false,
      message: `At least ${minFiles} photo is required.`,
    });
  }
  if (req.files.length > maxFiles) {
    return res.status(400).json({
      success: false,
      message: `Maximum ${maxFiles} photos are allowed.`,
    });
  }
  next();
};

// Export both the multer instance and validator middleware
module.exports = {
  upload,
  validatePhotoUpload
};