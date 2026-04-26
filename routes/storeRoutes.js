import express from "express";
import asyncHandler from "express-async-handler";
import StoreSettings from "../models/StoreSettings.js";
import Content from "../models/Content.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const getSingleton = async (Model) => {
  let doc = await Model.findOne({});
  if (!doc) doc = await Model.create({});
  return doc;
};

router.get("/settings", asyncHandler(async (req, res) => {
  res.json(await getSingleton(StoreSettings));
}));

router.put("/settings", protect, admin, asyncHandler(async (req, res) => {
  const settings = await getSingleton(StoreSettings);
  Object.assign(settings, req.body);
  res.json(await settings.save());
}));

router.get("/content", asyncHandler(async (req, res) => {
  res.json(await getSingleton(Content));
}));

router.put("/content", protect, admin, asyncHandler(async (req, res) => {
  const content = await getSingleton(Content);
  Object.assign(content, req.body);
  res.json(await content.save());
}));

export default router;
