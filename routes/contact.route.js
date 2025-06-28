const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/create', contactController.createContact);
router.get('/list', contactController.getAllContacts);
router.get('/edit/:id', contactController.getContactbyId);
router.put('/update/:id', contactController.updateContact);
router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;