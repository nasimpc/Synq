const express = require('express');
const userController = require('../controllers/user');
const introController = require('../controllers/intro');
const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-user', userController.addUser);
router.post('/login', userController.login);
router.get('/get-users', userauthentication.authenticate, userController.getAlluser)
router.get('/get-user', userauthentication.authenticate, userController.getcurrentuser)

router.get('/', introController.getMainpage)

module.exports = router;