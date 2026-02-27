import express from 'express';
import { getCart, addCartItem, updateCartItem, deleteCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:userId', getCart);
router.post('/:userId/items', addCartItem);


router.patch('/:userId/item/:itemId', updateCartItem);
router.delete('/:userId/item/:itemId', deleteCartItem);

export default router;
