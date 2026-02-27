// Backend/routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getUserOrders,
  trackOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// ─── USER ─────────────────────────────────────────────────────────────────────
router.post('/',                        createOrder);       // place order
router.get('/user/:userId',             getUserOrders);     // order history
router.get('/track/:orderNumber',       trackOrder);        // track by order number (login required enforced on frontend)
router.get('/:id',                      getOrderById);      // single order by id

// ─── ADMIN ────────────────────────────────────────────────────────────────────
router.get('/',                         getAllOrders);       // all orders
router.patch('/:id/status',             updateOrderStatus); // update status

export default router;
