const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    ease: {
      type: Number,
      default: 2.5,
    },
    interval: {
      type: Number,
      default: 0,
    },
    reps: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cardSchema.index({ userId: 1, wordId: 1 }, { unique: true });

module.exports = mongoose.model("Card", cardSchema);