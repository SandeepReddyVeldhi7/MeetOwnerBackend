// routes/productRoutes.js

import express from 'express';
import { getAllProducts, getProductById, searchProducts } from '../controllers/productController.js';


const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

export default router;
