const mongoose = require("mongoose");
const { connectDB } = require("./connect");

async function run() {
  try {
    await connectDB();
    console.log("Success — connection is working.");
  } catch (err) {
    console.log("Failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

run();