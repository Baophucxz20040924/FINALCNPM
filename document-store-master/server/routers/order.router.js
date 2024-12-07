const express = require('express');
const router = express.Router();

const {
  getOrders,
  createOrder,
  callbackMomo, 
} = require('../controllers/order.controller');

router.route('/').get(getOrders).post(createOrder);
router.route('/callback').post(callbackMomo); 

module.exports = router;
