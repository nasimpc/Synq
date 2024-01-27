const express = require('express');
const introController = require('../controllers/intro')
const router = express.Router();
router.get('/', introController.getIntropage);
module.exports = router;