const mongoose = require("mongoose");
const { connectDB } = require("./connect");
const User = require("./models/User");
const Word = require("./models/Word");
const { createCard, getDueCards, recordReview, getUserByEmail } = require("./queries");

async function run() {
  try {
    await connectDB();
    await User.deleteMany({ email: "qtest@wordsmith.app" });
    await Word.deleteMany({ word: "lucid" });

    const user = await User.create({
      email: "qtest@wordsmith.app",
      passwordHash: "x",
      username: "qtester",
      fullName: "Query Tester",
    });
    const word = await Word.create({
      word: "lucid",
      definition: "clear and easy to understand",
      theme: "emotions",
      difficulty: 2,
    });

    // 1. createCard
    const card = await createCard(user._id, word._id);
    console.log("createCard      -> card id exists:", !!card._id);

    // 2. getDueCards (a brand-new card is due now)
    const due = await getDueCards(user._id);
    console.log("getDueCards     -> found", due.length, "due; word:", due[0].wordId.word);

    // 3. recordReview (simulate scheduler output: interval 6 days)
    const updated = await recordReview(card._id, { ease: 2.6, interval: 6, reps: 3 });
    const daysFromNow = Math.round((updated.dueDate - new Date()) / 86400000);
    console.log("recordReview    -> interval saved:", updated.interval, "; due in ~", daysFromNow, "days");

    // 4. getUserByEmail
    const found = await getUserByEmail("  QTEST@wordsmith.app ");
    console.log("getUserByEmail  -> found user:", found.username);

    const dueAfter = await getDueCards(user._id);
    console.log("due after review-> should be 0:", dueAfter.length);

    // cleanup
    await mongoose.connection.collection("cards").deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });
    await Word.deleteOne({ _id: word._id });
    console.log("Cleaned up. Data layer working.");
  } catch (err) {
    console.log("FAILED:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

run();