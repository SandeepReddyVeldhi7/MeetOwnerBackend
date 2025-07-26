import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  amount: Number,
  items: [
    {
      productId: Object,
      quantity: Number
    }
  ],
  status: { type: String, default: 'paid' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
