import express from "express";
import asyncHandler from "express-async-handler";
import Subscriber from "../models/Subscriber.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, admin, asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, phone, source, tags } = req.body;

  if (!email && !phone) {
    res.status(400);
    throw new Error("Email or phone is required");
  }

  const existing = await Subscriber.findOne({
    $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean),
  });

  if (existing) {
    existing.name = name || existing.name;
    existing.source = source || existing.source;
    existing.tags = Array.from(new Set([...(existing.tags || []), ...(tags || ["Drop list"])]));
    const updated = await existing.save();
    return res.json(updated);
  }

  const subscriber = await Subscriber.create({ name, email, phone, source, tags });
  res.status(201).json(subscriber);
}));

export default router;
