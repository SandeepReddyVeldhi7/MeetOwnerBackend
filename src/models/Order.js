// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
productId: Number,
      quantity: Number,
    }
  ],
  amount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created'
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});


const Order= mongoose.model('Order', orderSchema);
export default Order