const mongoose = require("mongoose");
const { connectDB } = require("../connect");
const User = require("./User");
const Word = require("./Word");
const Card = require("./Card");

async function run() {
  try {
    await connectDB();

    // clean slate for the test
    await User.deleteMany({ email: "test@wordsmith.app" });
    await Word.deleteMany({ word: "serene" });

    // create a user
    const user = await User.create({
      email: "test@wordsmith.app",
      passwordHash: "not-a-real-hash",
      username: "tester",
      fullName: "Test User",
    });
    console.log("User created:", user.username);

    // create a word
    const word = await Word.create({
      word: "serene",
      definition: "calm, peaceful, untroubled",
      theme: "emotions",
      difficulty: 3,
      partOfSpeech: "adjective",
    });
    console.log("Word created:", word.word);

    // create a card linking them (defaults fill the SM-2 state)
    const card = await Card.create({ userId: user._id, wordId: word._id });
    console.log("Card created — ease:", card.ease, "interval:", card.interval, "due:", card.dueDate.toISOString().slice(0, 10));

    // read the card back, pulling in the referenced word
    const found = await Card.findById(card._id).populate("wordId");
    console.log("Read back — card's word is:", found.wordId.word);

    // cleanup
    await Card.deleteOne({ _id: card._id });
    await User.deleteOne({ _id: user._id });
    await Word.deleteOne({ _id: word._id });
    console.log("Cleaned up. All schemas working.");
  } catch (err) {
    console.log("FAILED:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

run();