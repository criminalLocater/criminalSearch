const router = require('express').Router()
const UserController = require('../controllers/user.controller')
// user registration
router.post('/register',UserController.registration)
module.exports = router