const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["hoodie", "tee"],
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  isSoldOut: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
