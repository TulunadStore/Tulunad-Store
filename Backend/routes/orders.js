// tulunad-backend/routes/orders.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

// User routes (protected for logged-in users)
router.post('/', authController.protect, orderController.createOrder);
router.get('/my-orders', authController.protect, orderController.getUserOrders);

// Admin routes (protected for admin users)
router.get(
  '/', // Route to get all orders (e.g., /api/orders for admin)
  authController.protect,
  authController.authorizeRoles('admin'),
  orderController.getAllOrders
);

module.exports = router;