const express = require("express");
const { getDueCards, createCard, recordReview } = require("../db/queries");
const Card = require("../db/models/Card");
const {
  scoreCorrectness,
  scoreLatency,
  scoreFluency,
  deriveGrade,
  schedule,
} = require("@wordsmith/core");

const router = express.Router();

router.get("/due/:userId", async (req, res) => {
  try {
    const cards = await getDueCards(req.params.userId);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:cardId/review", async (req, res) => {
  try {
    const { typed, latencyMs, typingMs } = req.body;

    if (typeof typed !== "string" || typeof latencyMs !== "number" || typeof typingMs !== "number") {
      return res.status(400).json({ error: "typed, latencyMs and typingMs are required" });
    }

    const card = await Card.findById(req.params.cardId).populate("wordId");
    if (!card) return res.status(404).json({ error: "card not found" });

    const answer = card.wordId.word;

    const correctness = scoreCorrectness(answer, typed);
    const latency = scoreLatency(latencyMs);
    const fluency = scoreFluency(typingMs, answer.length);
    const grade = deriveGrade({ correctness, latency, fluency });

    const next = schedule(
      { ease: card.ease, interval: card.interval, reps: card.reps },
      grade
    );

    const updated = await recordReview(card._id, next);

    res.json({
      correct: correctness === 1,
      grade,
      scores: { correctness, latency, fluency },
      next: { ease: updated.ease, interval: updated.interval, reps: updated.reps },
      dueDate: updated.dueDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, wordId } = req.body;

    if (!userId || !wordId) {
      return res.status(400).json({ error: "userId and wordId are required" });
    }

    const card = await createCard(userId, wordId);
    res.status(201).json(card);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "card already exists for this user and word" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;