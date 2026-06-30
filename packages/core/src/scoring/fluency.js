// Was typing smooth relative to this user's own pace? Returns 0..1.
// typingMs: time from first to last keystroke.
// wordLength: characters in the answer (length-normalization).
// baselineCps: user's rolling average characters-per-second.

function scoreFluency(typingMs, wordLength, baselineCps = 4) {
  if (typingMs <= 0 || wordLength <= 0) return 1; // bad/edge data — don't punish
  if (baselineCps <= 0) return 1;

  const seconds = typingMs / 1000;
  const cps = wordLength / seconds;        // this card's speed, length-fair
  const ratio = cps / baselineCps;         // vs. their own normal

  // at/above baseline ≈ 1; fades to 0 as they drop toward half-speed
  const score = (ratio - 0.5) / 0.5;
  return Math.max(0, Math.min(1, score));
}

module.exports = { scoreFluency };