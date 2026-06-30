function scoreLatency(latencyMs, threshold = 1500) {
  if (latencyMs <= 0) return 1;        // instant (or bad data) — treat as fast
  if (latencyMs >= threshold * 3) return 0; // very long stall

  // linear falloff: at/under threshold ≈ 1, fading to 0 by 3× threshold
  const score = 1 - (latencyMs - threshold) / (threshold * 2);
  return Math.max(0, Math.min(1, score));
}

module.exports = { scoreLatency };