const router = require('express').Router()
const UserController = require('../controllers/user.controller')
const upload = require('../middlewares/multer');
const authCheck = require('../middlewares/auth')()
const authorizeRoles = require('../middlewares/role')


// user registration
// router.post('/register',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.signup)
router.post('/register', upload.single('photo'), UserController.signup);
//router.put('/update/:id', , userController.updateUser);
// user login
router.post('/login',UserController.signin)

// all user list
router.get('/allUser',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.getAllUser)
// getData of specific user
router.get('/edit',authCheck.authenticateAPI,UserController.getSpecificUser)
// update user
router.put('/update/:id',authCheck.authenticateAPI,upload.single('photo'),authorizeRoles('admin'),UserController.updateUser)
// delete user
router.delete('/delete/:id',authCheck.authenticateAPI,authorizeRoles('admin'),UserController.deleteUser)
router.post('/forgotpassword', UserController.forgotPassword);
router.post('/update-password/:token', UserController.updatePassword);
router.put('/change-password/:userId',authCheck.authenticateAPI, UserController.changePassword);
module.exports = router