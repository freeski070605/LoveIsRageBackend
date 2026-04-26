import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

const productPayload = (body) => ({
  name: body.name,
  slug: body.slug,
  description: body.description,
  category: (body.category || "hoodie").toLowerCase(),
  price: Number(body.price || 0),
  images: body.images || [],
  sizes: body.sizes || [],
  colors: body.colors || [],
  variants: body.variants || [],
  active: Boolean(body.active),
  limitedDrop: Boolean(body.limitedDrop),
  careInstructions: body.careInstructions || "",
  sizeGuide: body.sizeGuide || "",
  dropId: body.dropId || undefined,
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.category && req.query.category !== "All") {
      filter.category = String(req.query.category).toLowerCase();
    }

    if (req.query.isSoldOut === "true") filter.isSoldOut = true;
    if (req.query.isSoldOut === "false") filter.isSoldOut = false;

    if (req.query.admin !== "true") {
      filter.active = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product || (!product.active && req.query.admin !== "true")) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  })
);

router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const productExists = await Product.findOne({ slug: req.body.slug });

    if (productExists) {
      res.status(400);
      throw new Error("Product with this slug already exists");
    }

    const product = await Product.create(productPayload(req.body));
    res.status(201).json(product);
  })
);

router.put(
  "/:slug",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    Object.assign(product, productPayload({ ...product.toObject(), ...req.body }));
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  })
);

router.delete(
  "/:slug",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  })
);

export default router;
