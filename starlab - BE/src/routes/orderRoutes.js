import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate, orderSchema } from '../middleware/validation.js';

const router = express.Router();

// POST /order/create  — protected
router.post('/create', protect, validate(orderSchema), createOrder);

// GET /order/my-orders  — protected
router.get('/my-orders', protect, getMyOrders);

// GET /order/:id  — protected
router.get('/:id', protect, getOrderById);

export default router;
