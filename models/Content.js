import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    homepageHeroHeadline: { type: String, default: "Love Is Rage" },
    homepageSubheadline: { type: String, default: "For the ones who love hard, move silent, and never fold." },
    ctaText: { type: String, default: "Shop The Drop" },
    brandStory: { type: String, default: "Love made us. Rage shaped us." },
    lookbookCopy: { type: String, default: "Soft feel. Heavy message." },
    footerLinks: { type: String, default: "Shop, Lookbook, Account, Contact" },
    announcementBar: { type: String, default: "First drop coming soon." },
    promoBanner: { type: String, default: "Free shipping over $150." },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);

export default Content;
