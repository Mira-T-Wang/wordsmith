const { scoreCorrectness, levenshtein } = require("./correctness");
const { scoreLatency } = require("./latency");
const { scoreFluency } = require("./fluency");
const { deriveGrade } = require("./grade");

module.exports = {
  scoreCorrectness,
  levenshtein,
  scoreLatency,
  scoreFluency,
  deriveGrade,
};