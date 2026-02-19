const express = require('express');
const router = express.Router();

const {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder,
  deleteOrder
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

// User routes
router.get('/myorders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;
