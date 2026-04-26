import express from "express";
import asyncHandler from "express-async-handler";
import Drop from "../models/Drop.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.admin === "true" ? {} : { status: { $in: ["Scheduled", "Live", "Sold Out"] } };
  const drops = await Drop.find(filter).sort({ dateTime: 1 });
  res.json(drops);
}));

router.post("/", protect, admin, asyncHandler(async (req, res) => {
  const drop = await Drop.create(req.body);
  res.status(201).json(drop);
}));

router.put("/:id", protect, admin, asyncHandler(async (req, res) => {
  const drop = await Drop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!drop) {
    res.status(404);
    throw new Error("Drop not found");
  }
  res.json(drop);
}));

router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
  const drop = await Drop.findById(req.params.id);
  if (!drop) {
    res.status(404);
    throw new Error("Drop not found");
  }
  await drop.deleteOne();
  res.json({ message: "Drop removed" });
}));

export default router;
