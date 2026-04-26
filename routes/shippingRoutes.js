import express from "express";
import asyncHandler from "express-async-handler";
import ShippingMethod from "../models/ShippingMethod.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.admin === "true" ? {} : { active: true };
  const methods = await ShippingMethod.find(filter).sort({ rate: 1 });
  res.json(methods);
}));

router.post("/", protect, admin, asyncHandler(async (req, res) => {
  const method = await ShippingMethod.create(req.body);
  res.status(201).json(method);
}));

router.put("/:id", protect, admin, asyncHandler(async (req, res) => {
  const method = await ShippingMethod.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!method) {
    res.status(404);
    throw new Error("Shipping method not found");
  }
  res.json(method);
}));

router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
  const method = await ShippingMethod.findById(req.params.id);
  if (!method) {
    res.status(404);
    throw new Error("Shipping method not found");
  }
  await method.deleteOne();
  res.json({ message: "Shipping method removed" });
}));

export default router;
