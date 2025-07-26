import Wishlist from "../models/Wishlist.js";


export const addToWishlist = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: [{ productId }]
    });
  } else {
    const exists = wishlist.items.some(item => item.productId.id === productId.id);
    if (!exists) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }
  }

  res.status(200).json(wishlist);
};

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.userId });
  res.status(200).json(wishlist || { items: [] });
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user.userId });

  if (wishlist) {
    wishlist.items = wishlist.items.filter(item => item.productId.id !== productId.id);
    await wishlist.save();
  }

  res.status(200).json(wishlist);
};
