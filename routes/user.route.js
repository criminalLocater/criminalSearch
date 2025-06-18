const router = require('express').Router()
const UserController = require('../controllers/user.controller')
const authCheck = require('../middlewares/auth')()
const authorizeRoles = require('../middlewares/role')

// user registration
// router.post('/register',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.signup)
router.post('/register',UserController.signup)
// user login
router.post('/login',UserController.signin)
// all user list
router.get('/allUser',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.getAllUser)
// edit specific user
router.get('/edit/:id',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.getSpecificUser)
// update user
router.put('/update/:id',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.updateUser)
// delete user
router.delete('/delete/:id',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.deleteUser)
module.exports = router