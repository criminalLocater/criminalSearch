// ./routes/criminal.route.js
const express = require('express');
const router = express.Router();
const criminalController = require('../controllers/criminal.controller');
const upload = require('../middlewares/multer');

// POST: Create Criminal - Requires 1 photo
router.post('/create', upload.single('photo'), criminalController.createCriminal);

// PUT: Update Criminal - Optional update of photo
router.put('/update/:id', upload.single('photo'), criminalController.updateCriminal);

// GET, GET by ID, DELETE, etc.
router.get('/list', criminalController.getAllCriminals);
router.get('/edit/:id', criminalController.getCriminalById);
router.delete('/delete/:id', criminalController.deleteCriminal);
router.get('/geo/nearby', criminalController.getCriminalsByLocation);

module.exports = router;