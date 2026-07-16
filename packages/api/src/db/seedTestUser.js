const mongoose = require("mongoose");
const { connectDB } = require("./connect");
const User = require("./models/User");
const Word = require("./models/Word");
const { createCard } = require("./queries");

async function run() {
  try {
    await connectDB();

    // clear any previous run so this is repeatable
    const old = await User.findOne({ email: "demo@wordsmith.app" });
    if (old) {
      await mongoose.connection.collection("cards").deleteMany({ userId: old._id });
      await User.deleteOne({ _id: old._id });
    }
    await Word.deleteMany({ word: "ephemeral" });

    const user = await User.create({
      email: "demo@wordsmith.app",
      passwordHash: "placeholder",
      username: "demo",
      fullName: "Demo User",
    });

    const word = await Word.create({
      word: "ephemeral",
      definition: "lasting for a very short time",
      theme: "emotions",
      difficulty: 4,
      partOfSpeech: "adjective",
    });

    await createCard(user._id, word._id);

    console.log("\n=== Test data ready ===");
    console.log("userId:", user._id.toString());
    console.log("Use this URL in Postman:");
    console.log(`  http://localhost:4000/api/cards/due/${user._id}\n`);
  } catch (err) {
    console.log("FAILED:", err.message);
  } finally {
    await mongoose.connection.close();
  }
}

run();