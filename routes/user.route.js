const router = require('express').Router()
const UserController = require('../controllers/user.controller')
const authCheck = require('../middlewares/auth')()
// user registration
router.post('/register',UserController.signup)
// user login
router.post('/login',UserController.signin)
// all user list
router.get('/allUser',authCheck.authenticateAPI,UserController.getAllUser)
// edit specific user
router.get('/edit/:id',authCheck.authenticateAPI,UserController.getSpecificUser)
// update user
router.put('/update/:id',authCheck.authenticateAPI,UserController.updateUser)
// delete user
router.delete('/delete/:id',authCheck.authenticateAPI,UserController.deleteUser)
// create police_station
router.post('/create-station',authCheck.authenticateAPI,UserController.createPoliceStation)
module.exports = router