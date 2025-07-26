import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addToCart, clearCart, getCart } from '../controllers/cartController.js';



const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;
