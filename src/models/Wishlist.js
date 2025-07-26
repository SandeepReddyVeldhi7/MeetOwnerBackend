// models/Wishlist.js
import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: Object, // we're storing fake API product data directly
    required: true
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [wishlistItemSchema]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
