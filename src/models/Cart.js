// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Object, // since fake API products aren’t in our DB
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },  status: { type: String, default: 'pending' },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
