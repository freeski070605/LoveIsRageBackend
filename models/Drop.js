import mongoose from "mongoose";

const DropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dateTime: { type: Date, required: true },
    heroImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Live", "Sold Out", "Archived"],
      default: "Draft",
    },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    featured: { type: Boolean, default: false },
    story: { type: String, default: "" },
    countdownEnabled: { type: Boolean, default: true },
    projectedRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Drop = mongoose.models.Drop || mongoose.model("Drop", DropSchema);

export default Drop;
