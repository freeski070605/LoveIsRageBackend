import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Drop announcement", "Abandoned cart", "Thank-you", "Restock alert", "VIP early access"],
      required: true,
    },
    channel: { type: String, enum: ["Email", "SMS", "Email + SMS"], default: "Email" },
    segmentTags: { type: [String], default: [] },
    status: { type: String, enum: ["Draft", "Ready", "Integration pending"], default: "Draft" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

export default Campaign;
