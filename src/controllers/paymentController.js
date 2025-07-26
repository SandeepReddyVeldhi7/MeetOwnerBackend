  import Razorpay from 'razorpay';
  import crypto from 'crypto';
  import Order from '../models/Order.js';


    export const createOrder = async (req, res) => {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await instance.orders.create({
      amount: req.body.amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    await Order.create({
    user: req.user._id,
    items: req.body.cartItems.map(item => ({
     productId: item.productId?._id || item.productId?.id || item.productId,
      quantity: item.quantity
    })),
    amount: req.body.amount,
    razorpay_order_id: razorpayOrder.id,
    status: 'created',
  });

    res.json(razorpayOrder);
  };



 export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('razorpay_order_id', razorpay_order_id);
    console.log('razorpay_payment_id', razorpay_payment_id);
    console.log('razorpay_signature', razorpay_signature);  

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');
console.log("Expected:", expectedSignature);
console.log("Actual:", razorpay_signature);

    const order = await Order.findOne({ razorpay_order_id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (expectedSignature === razorpay_signature) {
      order.status = 'paid';
      order.razorpay_payment_id = razorpay_payment_id;
      order.paidAt = new Date();
      await order.save();

      return res.json({ success: true, order });
    } else {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return res.status(500).json({ success: false, message: "Server error during payment verification" });
  }
};



