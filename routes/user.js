const express = require('express');
const userController = require('../controllers/user');
const introController = require('../controllers/intro');
const userAuthentication = require('../middleware/authentication');

const router = express.Router();

router.post('/add-user', userController.addUser);
router.post('/login', userController.login);
router.get('/get-users', userAuthentication.authenticate, userController.getAlluser)
router.get('/get-user', userAuthentication.authenticate, userController.getcurrentuser)

router.get('/', introController.getMainpage)

module.exports = router;