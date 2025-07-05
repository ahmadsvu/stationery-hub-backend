const express = require('express');
const router = express.Router();
const orderController=require('../controllers/orderController')

router.post('/sendorder',orderController.sendOrder)
router.get('/getorders',orderController.getOrders)
router.post('/telegram/webhook', orderController.handleTelegramUpdate);
router.get('/getorder/:id',orderController.getOrder)
module.exports = router;

