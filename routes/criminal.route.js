const express = require('express');
const router = express.Router();
const criminalController = require('../controllers/criminal.controller');

// CRUD
router.post('/', criminalController.createCriminal);
router.get('/', criminalController.getAllCriminals);
router.get('/:id', criminalController.getCriminalById);
router.put('/:id', criminalController.updateCriminal);
router.delete('/:id', criminalController.deleteCriminal);

// Geo query
router.get('/geo/nearby', criminalController.getCriminalsByLocation);

module.exports = router;
