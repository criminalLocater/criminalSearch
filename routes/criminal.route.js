// ./routes/criminal.route.js
const express = require('express');
const router = express.Router();
const criminalController = require('../controllers/criminal.controller');

// Import multer config
const { upload, validatePhotoUpload } = require('../middlewares/multer');

// POST: Create Criminal - Requires 1-5 photos
router.post('/', upload.array('photos', 5), validatePhotoUpload, criminalController.createCriminal);

// PUT: Update Criminal - Optional update of photos
router.put('/:id', upload.array('photos', 5), validatePhotoUpload, criminalController.updateCriminal);

// GET, GET by ID, DELETE, etc.
router.get('/', criminalController.getAllCriminals);
router.get('/:id', criminalController.getCriminalById);
router.delete('/:id', criminalController.deleteCriminal);
router.get('/geo/nearby', criminalController.getCriminalsByLocation);

module.exports = router;