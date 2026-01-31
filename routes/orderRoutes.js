import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/auth.js'; // Import protect and admin middleware
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect, // Protect this route
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),
        user: req.user._id, // User from auth middleware
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  })
);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get(
  '/myorders',
  protect, // Protect this route
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).populate(
      'userId',
      'username email'
    ).populate('products.productId', 'name price'); // Populate user info and product details

    res.json(orders);
  })
);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate('userId', 'username email')
      .populate('products.productId', 'name price');
    res.json(orders);
  })
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get(
  '/:id',
  protect, // Protect this route
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'userId', // Changed from 'user' to 'userId' to match OrderSchema
      'username email' // Changed from 'name email' to 'username email'
    ).populate('products.productId', 'name price'); // Populate product details

    if (order) {
      // Ensure the logged-in user owns this order or is an admin
      if (order.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  })
);

export default router;
