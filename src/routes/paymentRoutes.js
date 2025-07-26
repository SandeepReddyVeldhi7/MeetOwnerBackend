import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';


const router = express.Router();

router.post('/razorpay-order', authMiddleware, createOrder);

export default router;
