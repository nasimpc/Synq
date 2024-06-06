const express = require('express');
const purchaseController = require('../controllers/purchase')
const router = express.Router();

router.post("/buy-premium", purchaseController.buyPremium);

module.exports = router;