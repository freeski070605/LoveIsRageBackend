import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post(
  '/',
  asyncHandler(async (req, res) => {
    // Admin middleware will be applied here
    const { name, slug, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;

    const productExists = await Product.findOne({ slug });

    if (productExists) {
      res.status(400);
      throw new Error('Product with this slug already exists');
    }

    const product = new Product({
      name: name || 'Sample name',
      slug: slug || `sample-slug-${Date.now()}`,
      user: req.user._id, // User from auth middleware
      image: image || '/images/sample.jpg',
      brand: brand || 'Sample brand',
      category: category || 'Sample category',
      description: description || 'Sample description',
      price: price || 0,
      countInStock: countInStock || 0,
      rating: rating || 0,
      numReviews: numReviews || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

// @desc    Update a product
// @route   PUT /api/products/:slug
// @access  Private/Admin
router.put(
  '/:slug',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, description, price, imageUrl, category, size, quantity } = req.body;

    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.size = size || product.size;
      product.quantity = quantity || product.quantity;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Delete a product
// @route   DELETE /api/products/:slug
// @access  Private/Admin
router.delete(
  '/:slug',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;
