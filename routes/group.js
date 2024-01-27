const express = require('express');
const groupController = require('../controllers/group')
const router = express.Router();
const userauthentication = require('../middleware/auth');

router.post("/create-group", userauthentication.authenticate, groupController.createGroup);
router.get('/get-groups', userauthentication.authenticate, groupController.getGroups);
router.get('/get-group', groupController.getGroupbyId)
//router.get("/get-chats", userauthentication.authenticate, chatController.getChats);
//router.get('/get-messages', chatController.getAllChatHistory);

module.exports = router;