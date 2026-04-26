import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    source: { type: String, default: "Website" },
    tags: { type: [String], default: ["Drop list"] },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 }, { unique: true, sparse: true });
SubscriberSchema.index({ phone: 1 }, { unique: true, sparse: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

export default Subscriber;
