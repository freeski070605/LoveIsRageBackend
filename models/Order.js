import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    items: { type: [OrderItemSchema], required: true, default: [] },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Packed", "Shipped", "Delivered", "Refunded", "Cancelled"],
      default: "Pending",
    },
    trackingNumber: { type: String, default: "" },
    carrier: { type: String, default: "" },
    notes: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    paymentProvider: { type: String, default: "manual" },
    paymentStatus: { type: String, default: "unpaid" },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
