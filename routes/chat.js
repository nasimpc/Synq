const express = require('express');
const chatController = require('../controllers/chat')
const router = express.Router();
const userauthentication = require('../middleware/auth');
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');

router.post("/add-chat", userauthentication.authenticate, chatController.addChat);
router.post('/add-chatImage', userauthentication.authenticate, upload, chatController.addChatImage)
router.get("/get-chats", userauthentication.authenticate, chatController.getChats);
router.get('/get-messages', chatController.getAllChatHistory);

module.exports = router;