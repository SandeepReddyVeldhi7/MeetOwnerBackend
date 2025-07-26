import Cart from "../models/Cart.js";


// export const addToCart = async (req, res) => {
//   const userId = req.user.userId;
//   const { productId, quantity } = req.body;

//   let cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     cart = await Cart.create({
//       user: userId,
//       items: [{ productId, quantity }]
//     });
//   } else {
//     const index = cart.items.findIndex(i => i.productId.id === productId.id);
//     if (index !== -1) {
//       cart.items[index].quantity += quantity;
//     } else {
//       cart.items.push({ productId, quantity });
//     }
//     await cart.save();
//   }

//   res.status(200).json(cart);
// };


export const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No cart items provided' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items });
  } else {
    cart.items = items; // You can implement merging logic if needed
    await cart.save();
  }

  res.status(200).json(cart);
};

export const getCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({ user: userId });
  res.status(200).json(cart || { items: [] });
};

export const clearCart = async (req, res) => {
  const userId = req.user.userId;
  await Cart.deleteOne({ user: userId });
  res.status(200).json({ message: 'Cart cleared' });
};
