import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    console.log("🔔 Incoming cartItems & amount:");
    console.log(JSON.stringify(req.body, null, 2));

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await instance.orders.create({
      amount: req.body.amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    console.log("✅ Razorpay order created:");
    console.dir(razorpayOrder, { depth: null });

    const newOrder = await Order.create({
      user: req.user._id,
      items: req.body.cartItems.map(item => ({
        productId: item.productId?._id || item.productId?.id || item.productId,
        quantity: item.quantity,
      })),
      amount: req.body.amount,
      razorpay_order_id: razorpayOrder.id,
      status: 'created',
    });

    console.log("📦 Order saved to DB:");
    console.dir(newOrder, { depth: null });

    res.json(razorpayOrder);
  } catch (error) {
    console.error("❌ Error in createOrder:", error);
    res.status(500).json({ success: false, message: 'Server error while creating order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("🔐 Payment details received:");
    console.log(JSON.stringify(req.body, null, 2));

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');

    console.log("🧾 Expected Signature:", expectedSignature);
    console.log("🧾 Actual Signature:", razorpay_signature);

    const order = await Order.findOne({ razorpay_order_id });
    if (!order) {
      console.error("⚠️ Order not found");
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (expectedSignature === razorpay_signature) {
      order.status = 'paid';
      order.razorpay_payment_id = razorpay_payment_id;
      order.paidAt = new Date();
      await order.save();

      console.log("✅ Payment verified & order updated:");
      console.dir(order, { depth: null });

      return res.json({ success: true, order });
    } else {
      order.status = 'failed';
      await order.save();
      console.warn("❌ Invalid signature - Payment failed");
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return res.status(500).json({ success: false, message: "Server error during payment verification" });
  }
};
