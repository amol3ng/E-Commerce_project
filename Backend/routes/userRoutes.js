import express from 'express';
import { loginUser, getUser, updateUser, deleteUser, createUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;