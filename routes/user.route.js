const router = require('express').Router()
const UserController = require('../controllers/user.controller')
const authCheck = require('../middlewares/auth')()
const authorizeRoles = require('../middlewares/role')

// user registration
router.post('/register',authorizeRoles('admin'),UserController.signup)
// user login
router.post('/login',UserController.signin)
// all user list
router.get('/allUser',authorizeRoles('admin'),authCheck.authenticateAPI,UserController.getAllUser)
// edit specific user
router.get('/edit/:id',authorizeRoles('admin'),authCheck.authenticateAPI,UserController.getSpecificUser)
// update user
router.put('/update/:id',authorizeRoles('admin'),authCheck.authenticateAPI,UserController.updateUser)
// delete user
router.delete('/delete/:id',authorizeRoles('admin'),authCheck.authenticateAPI,UserController.deleteUser)
module.exports = router