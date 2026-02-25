import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// ─── PUBLIC / USER ────────────────────────────
router.post('/',                  createOrder);        // place order from checkout
router.get('/user/:userId',       getUserOrders);      // order history
router.get('/:id',                getOrderById);       // single order

// ─── ADMIN ────────────────────────────────────
router.get('/',                   getAllOrders);        // all orders (admin)
router.patch('/:id/status',       updateOrderStatus);  // update order/payment status (admin)

export default router;

/*
─── MOUNT IN app.js ───────────────────────────────────────
import orderRoutes   from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes    from './routes/cartRoutes.js';

app.use('/api/orders',   orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts',    cartRoutes);
───────────────────────────────────────────────────────────
*/