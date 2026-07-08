const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../../.env" });

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing from .env");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = { connectDB };