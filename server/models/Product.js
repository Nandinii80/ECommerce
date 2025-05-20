import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: [String], required: true },

    price: { type: Number, required: true, min: 0 },

    offerPrice: { type: Number, required: true, min: 0 },

    image: { type: [String], required: true }, // URLs of images

    category: { type: String, required: true, lowercase: true, trim: true },

    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
