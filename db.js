require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB with URI: ${process.env.MONGO_URI ? 'URI found (masked)' : 'URI not found'}`);
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
