const router = require('express').Router()
const UserController = require('../controllers/user.controller')
// user registration
router.post('/register',UserController.signup)
router.post('/login',UserController.signin)
module.exports = router