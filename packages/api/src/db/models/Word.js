const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    definition: {
      type: String,
      required: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    partOfSpeech: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Word", wordSchema);