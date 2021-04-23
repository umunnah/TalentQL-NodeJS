const express =  require('express');
const router = express.Router();
const { authorization } = require('../middleware/auth');
const AuthController =  require('../controllers/auth');
const multer =  require('multer');

// for parsing multipart/form-data
// Middleware to upload files
const upload = multer();

router.post('/register', upload.array(), AuthController.register);

router.post('/login',upload.array(), AuthController.login);

router.get('/logout',authorization, AuthController.logout);

router.get('/profile', authorization , AuthController.profile);

router.put('/forgot-password', AuthController.forgotPassword);

router.put('/resetpassword/:resetpasswordtoken', AuthController.resetPassword);


module.exports = router;