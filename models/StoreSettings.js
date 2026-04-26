import mongoose from "mongoose";

const StoreSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Love Is Rage" },
    logo: { type: String, default: "/images/miniLogo.png" },
    contactEmail: { type: String, default: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    shippingPolicy: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
    freeShippingThreshold: { type: Number, default: 150 },
    paymentProviderStatus: { type: String, enum: ["Not connected", "Test mode", "Live"], default: "Not connected" },
    notifications: {
      newOrders: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      dropReminders: { type: Boolean, default: true },
      customerReplies: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const StoreSettings = mongoose.models.StoreSettings || mongoose.model("StoreSettings", StoreSettingsSchema);

export default StoreSettings;
