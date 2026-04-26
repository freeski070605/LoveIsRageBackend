import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/auth.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { customerName, customerEmail, customerPhone, items, shippingAddress, paymentProvider, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const customer = customerEmail ? await User.findOne({ email: customerEmail }) : null;

    const order = await Order.create({
      customerId: customer?._id,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      total,
      paymentProvider: paymentProvider || "manual",
      paymentStatus: paymentStatus || "unpaid",
      status: paymentStatus === "paid" ? "Paid" : "Pending",
    });

    if (customer) {
      customer.lastPurchaseDate = new Date();
      await customer.save();
    }

    res.status(201).json(order);
  })
);

router.get(
  "/myorders",
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.customerId?.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to view this order");
    }

    res.json(order);
  })
);

router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    Object.assign(order, {
      status: req.body.status ?? order.status,
      trackingNumber: req.body.trackingNumber ?? order.trackingNumber,
      carrier: req.body.carrier ?? order.carrier,
      notes: req.body.notes ?? order.notes,
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  })
);

export default router;
