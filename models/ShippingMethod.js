import mongoose from "mongoose";

const ShippingMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    estimatedDays: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShippingMethod = mongoose.models.ShippingMethod || mongoose.model("ShippingMethod", ShippingMethodSchema);

export default ShippingMethod;
