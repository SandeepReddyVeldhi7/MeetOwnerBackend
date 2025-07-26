import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await instance.orders.create({
    amount: req.body.amount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  });

  res.json(order);
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const expectedSignature = hmac.digest('hex');

  if (expectedSignature === razorpay_signature) {
    const order = new Order({
      user: req.user._id,
      razorpay_order_id,
      razorpay_payment_id,
      items: cartItems,
      amount: cartItems.reduce((sum, i) => sum + i.productId.price * i.quantity, 0),
    });
    await order.save();

    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};
