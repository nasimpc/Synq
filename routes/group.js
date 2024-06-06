const express = require('express');
const groupController = require('../controllers/group')
const router = express.Router();
const userAuthentication = require('../middleware/authentication');

router.post("/create-group", userAuthentication.authenticate, groupController.createGroup);
router.get('/get-groups', userAuthentication.authenticate, groupController.getGroups);
router.get('/get-group', groupController.getGroupbyId);
router.get('/get-group-members', groupController.getGroupMembersbyId);
router.post('/update-group', userAuthentication.authenticate, groupController.updateGroup);

module.exports = router;