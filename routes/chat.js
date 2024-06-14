const express = require('express');
const chatController = require('../controllers/chat')
const router = express.Router();
const userAuthentication = require('../middleware/authentication');
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');

router.post("/add-chat", userAuthentication.authenticate, chatController.addChat);
router.post('/add-chatImage', userAuthentication.authenticate, upload, chatController.addChatImage)
router.get('/get-chats', chatController.getChats);

module.exports = router;