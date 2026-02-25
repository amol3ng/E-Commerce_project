import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySku,
  createProduct,
  updateProduct,
  adjustStock,
  deactivateProduct,
  deleteProduct,
  getLowStockProducts,
} from '../controllers/productController.js';

const router = express.Router();

// ─── PUBLIC ───────────────────────────────────
// GET  /api/products                → list all (supports ?type=&category=&brand_id=&active=)
// GET  /api/products/:id            → single product by id
// GET  /api/products/sku/:sku       → single product by SKU
router.get('/',         getProducts);
router.get('/sku/:sku', getProductBySku);       // before /:id so "sku" isn't treated as an id
router.get('/:id',      getProductById);

// ─── ADMIN ────────────────────────────────────
// Prefix: /api/admin/products  (mount separately in app.js — see note below)
// OR protect these with an auth/role middleware if mounted on /api/products

// GET    /api/products/admin/low-stock     → products at or below threshold
// POST   /api/products                     → create new product
// PATCH  /api/products/:id                 → partial update
// PATCH  /api/products/:id/stock           → stock adjustment only
// DELETE /api/products/:id                 → soft delete (is_active = false)
// DELETE /api/products/:id/hard            → hard delete (permanent)

router.get('/admin/low-stock',   getLowStockProducts);
router.post('/',                 createProduct);
router.patch('/:id',             updateProduct);
router.patch('/:id/stock',       adjustStock);
router.delete('/:id',            deactivateProduct);
router.delete('/:id/hard',       deleteProduct);

export default router;

/*
─── HOW TO MOUNT IN app.js ───────────────────────────────────────────────────

import productRoutes from './routes/productRoutes.js';
import cartRoutes    from './routes/cartRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/carts',    cartRoutes);

─── FUTURE ADMIN MIDDLEWARE EXAMPLE ──────────────────────────────────────────
If you add JWT auth later, protect admin routes like this:

import { requireAuth, requireAdmin } from './middleware/auth.js';

// In productRoutes.js, replace the admin lines with:
router.get('/admin/low-stock',  requireAdmin, getLowStockProducts);
router.post('/',                requireAdmin, createProduct);
router.patch('/:id',            requireAdmin, updateProduct);
router.patch('/:id/stock',      requireAdmin, adjustStock);
router.delete('/:id',           requireAdmin, deactivateProduct);
router.delete('/:id/hard',      requireAdmin, deleteProduct);
──────────────────────────────────────────────────────────────────────────────
*/