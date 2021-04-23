const express =  require('express');
const router = express.Router();
const { authorization } = require('../middleware/auth');
const AuthController =  require('../controllers/auth');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/logout',authorization, AuthController.logout);

router.get('/profile', authorization , AuthController.profile);

router.put('/forgot-password', AuthController.forgotPassword);

router.put('/resetpassword/:resetpasswordtoken', AuthController.resetPassword);


module.exports = router;