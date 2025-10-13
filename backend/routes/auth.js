const express = require('express');
const { register, login, getProfile, forgotPassword, resetPassword, updateProfile, changePassword, googleAuth } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/google-auth', googleAuth);

module.exports = router;