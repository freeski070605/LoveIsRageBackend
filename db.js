import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB with URI: ${process.env.MONGO_URI ? "URI found (masked)" : "URI not found"}`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL", error.message);
    process.exit(1);
  }
};

export default connectDB;
