import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';


const router = express.Router();

router.post('/add', authMiddleware, addToWishlist);
router.get('/', authMiddleware, getWishlist);
router.delete('/remove', authMiddleware, removeFromWishlist);

export default router;
