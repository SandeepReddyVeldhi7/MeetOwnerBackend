import Cart from "../models/Cart.js";



// Add or merge items to user's cart
export const addToCart = async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid cart items' });
  }

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { upsert: true, new: true }
  );

  res.status(200).json({ message: 'Cart synced' });
};


// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId });
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// Clear user's cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Cart.deleteOne({ user: userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};
