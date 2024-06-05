const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();

router.post('/forgotpassword', passwordController.requestResetPassword);
router.get('/reset/:id', passwordController.resetPasswordForm);
router.post('/reset', passwordController.resetPassword);

module.exports = router;
