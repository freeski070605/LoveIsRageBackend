import express from "express";
import asyncHandler from "express-async-handler";
import Campaign from "../models/Campaign.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, admin, asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({}).sort({ updatedAt: -1 });
  res.json(campaigns);
}));

router.post("/", protect, admin, asyncHandler(async (req, res) => {
  const campaign = await Campaign.create(req.body);
  res.status(201).json(campaign);
}));

router.put("/:id", protect, admin, asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }
  res.json(campaign);
}));

router.post("/:id/send", protect, admin, asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }
  res.status(202).json({ message: "Email/SMS provider integration pending", campaignId: campaign._id });
}));

export default router;
