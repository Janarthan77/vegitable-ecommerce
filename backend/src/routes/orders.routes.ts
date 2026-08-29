import { Router } from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getDashboardStats,
  deleteOrder,
} from '../controllers/order.controller.js';

const router = Router();

router.get('/', getOrders);
router.get('/stats', getDashboardStats);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
