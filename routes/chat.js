const express = require('express');
const chatController = require('../controllers/chat')
const router = express.Router();
const userauthentication = require('../middleware/auth');

router.post("/add-chat", userauthentication.authenticate, chatController.addChat);
router.get("/get-chats", userauthentication.authenticate, chatController.getChats);
module.exports = router;