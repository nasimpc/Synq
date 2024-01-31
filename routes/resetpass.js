const express = require('express');

const passwordController = require('../controllers/resetpass');

const router = express.Router();

router.get('/reset/:id', passwordController.resetpasswordform);
router.post('/reset', passwordController.resetpassword);
router.post('/forgotpassword', passwordController.requestresetpassword);

module.exports = router;
