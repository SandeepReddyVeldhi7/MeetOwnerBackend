import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  description: String,
  category: String,
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

export default Product
