import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    color: { type: String, required: true },
    inventory: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true },
  },
  { _id: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ["hoodie", "tee", "accessory"], default: "hoodie" },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true, default: [] },
    sizes: { type: [String], required: true, default: [] },
    colors: { type: [String], required: true, default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
    active: { type: Boolean, default: false },
    limitedDrop: { type: Boolean, default: true },
    careInstructions: { type: String, default: "" },
    sizeGuide: { type: String, default: "" },
    dropId: { type: mongoose.Schema.Types.ObjectId, ref: "Drop" },
    isSoldOut: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("stock").get(function () {
  return this.variants.reduce((sum, variant) => sum + variant.inventory, 0);
});

ProductSchema.virtual("imageUrl").get(function () {
  return this.images?.[0] || "/images/hoodie-placeholder.jpg";
});

ProductSchema.pre("save", function () {
  const stock = this.variants.reduce((sum, variant) => sum + variant.inventory, 0);
  this.isSoldOut = stock <= 0;
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
