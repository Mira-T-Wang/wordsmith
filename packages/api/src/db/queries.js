const User = require("./models/User");
const Word = require("./models/Word");
const Card = require("./models/Card");

// Start a user learning a word. Fresh SM-2 state comes from schema defaults.
async function createCard(userId, wordId) {
  return Card.create({ userId, wordId });
}

// Find a user's cards that are due now or overdue, word details included.
async function getDueCards(userId) {
  const now = new Date();
  return Card.find({ userId, dueDate: { $lte: now } })
    .populate("wordId")
    .sort({ dueDate: 1 });
}

// Save the scheduler's result. Converts interval (days) into a real dueDate here.
async function recordReview(cardId, { ease, interval, reps }) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  return Card.findByIdAndUpdate(
    cardId,
    { ease, interval, reps, dueDate },
    { returnDocument: "after" }
  );
}

// Find a user by email (used by login later).
async function getUserByEmail(email) {
  return User.findOne({ email: email.trim().toLowerCase() });
}

module.exports = { createCard, getDueCards, recordReview, getUserByEmail };