import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Drop from "../models/Drop.js";
import Campaign from "../models/Campaign.js";
import Subscriber from "../models/Subscriber.js";
import ShippingMethod from "../models/ShippingMethod.js";
import StoreSettings from "../models/StoreSettings.js";
import Content from "../models/Content.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const getSingleton = async (Model) => {
  let doc = await Model.findOne({});
  if (!doc) doc = await Model.create({});
  return doc;
};

router.get(
  "/bootstrap",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const [products, orders, customers, drops, campaigns, subscribers, shippingMethods, storeSettings, content] =
      await Promise.all([
        Product.find({}).sort({ createdAt: -1 }),
        Order.find({}).sort({ createdAt: -1 }),
        User.find({}).select("-password").sort({ createdAt: -1 }),
        Drop.find({}).sort({ dateTime: 1 }),
        Campaign.find({}).sort({ updatedAt: -1 }),
        Subscriber.find({}).sort({ createdAt: -1 }),
        ShippingMethod.find({}).sort({ rate: 1 }),
        getSingleton(StoreSettings),
        getSingleton(Content),
      ]);

    res.json({ products, orders, customers, drops, campaigns, subscribers, shippingMethods, storeSettings, content });
  })
);

export default router;
