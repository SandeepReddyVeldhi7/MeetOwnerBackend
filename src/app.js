import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";



import auth from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB()

const app=express()

// Core Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/user', auth); 

app.use('/api/products', productRoutes);
app.use('/api/auth', auth);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});