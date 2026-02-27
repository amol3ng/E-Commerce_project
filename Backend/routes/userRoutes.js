import express from 'express';
import {
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  getCurrentUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUser);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUser);
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

export default router;
