import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Drop from "../models/Drop.js";
import ShippingMethod from "../models/ShippingMethod.js";
import StoreSettings from "../models/StoreSettings.js";
import Content from "../models/Content.js";
import User from "../models/User.js";

dotenv.config();

const heavyHeart = {
  name: "Heavy Heart Hoodie",
  slug: "heavy-heart-hoodie",
  description: "Premium heavyweight black pullover hoodie with Love Is Rage artwork.",
  category: "hoodie",
  price: 88,
  images: ["/images/website front.PNG", "/images/website back.PNG"],
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black"],
  variants: [
    { size: "S", color: "Black", inventory: 12, sku: "LIR-HH-BLK-S" },
    { size: "M", color: "Black", inventory: 18, sku: "LIR-HH-BLK-M" },
    { size: "L", color: "Black", inventory: 18, sku: "LIR-HH-BLK-L" },
    { size: "XL", color: "Black", inventory: 12, sku: "LIR-HH-BLK-XL" },
    { size: "XXL", color: "Black", inventory: 6, sku: "LIR-HH-BLK-XXL" },
  ],
  active: true,
  limitedDrop: true,
  careInstructions: "Wash cold inside out. Hang dry. Do not bleach.",
  sizeGuide: "Relaxed streetwear fit. Size up for oversized.",
};

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const product = await Product.findOneAndUpdate(
    { slug: heavyHeart.slug },
    heavyHeart,
    { new: true, upsert: true, runValidators: true }
  );

  const drop = await Drop.findOneAndUpdate(
    { name: "First Drop: Heavy Heart" },
    {
      name: "First Drop: Heavy Heart",
      description: "The first Love Is Rage hoodie release.",
      dateTime: new Date(process.env.FIRST_DROP_DATE || "2026-05-15T20:00:00-04:00"),
      heroImage: "/images/website front.PNG",
      status: "Scheduled",
      productIds: [product._id],
      featured: true,
      story: "For the ones who love hard, move silent, and never fold.",
      countdownEnabled: true,
      projectedRevenue: 5808,
    },
    { new: true, upsert: true, runValidators: true }
  );

  product.dropId = drop._id;
  await product.save();

  await ShippingMethod.updateOne(
    { name: "Standard shipping" },
    { name: "Standard shipping", rate: 7.95, estimatedDays: "3-5 business days", active: true },
    { upsert: true }
  );

  await StoreSettings.updateOne(
    {},
    {
      storeName: "Love Is Rage",
      logo: "/images/miniLogo.png",
      contactEmail: process.env.STORE_CONTACT_EMAIL || "",
      instagram: process.env.STORE_INSTAGRAM_URL || "",
      tiktok: process.env.STORE_TIKTOK_URL || "",
      shippingPolicy: "Orders ship in 3-5 business days after fulfillment starts.",
      returnPolicy: "Returns accepted within 14 days for unworn items with original packaging.",
      freeShippingThreshold: 150,
      paymentProviderStatus: process.env.STRIPE_SECRET_KEY ? "Test mode" : "Not connected",
    },
    { upsert: true }
  );

  await Content.updateOne(
    {},
    {
      homepageHeroHeadline: "Love Is Rage",
      homepageSubheadline: "For the ones who love hard, move silent, and never fold.",
      ctaText: "Shop The Drop",
      brandStory: "Love made us. Rage shaped us.",
      lookbookCopy: "Soft feel. Heavy message.",
      footerLinks: "Shop, Lookbook, Account, Contact",
      announcementBar: "First drop coming soon.",
      promoBanner: "Free shipping over $150.",
    },
    { upsert: true }
  );

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (admin) {
      admin.isAdmin = true;
      admin.username = process.env.ADMIN_USERNAME || admin.username;
      await admin.save();
    } else {
      await User.create({
        username: process.env.ADMIN_USERNAME || "Owner",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        isAdmin: true,
      });
    }
  }

  await mongoose.disconnect();
  console.log("Production seed complete: Heavy Heart Hoodie is active.");
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
