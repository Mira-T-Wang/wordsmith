const express = require("express");
const { getDueCards, createCard, recordReview } = require("../db/queries");

const router = express.Router();

// GET /api/cards/due/:userId  → this user's due cards
router.get("/due/:userId", async (req, res) => {
  try {
    const cards = await getDueCards(req.params.userId);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;