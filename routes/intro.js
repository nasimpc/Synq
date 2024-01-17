const express = require('express');
const introControler = require('../controllers/intro')
const router = express.Router();
router.get('/', introControler.getIntropage);
module.exports = router;