// Fuse the three sub-scores into an SRS grade 0..5.
// This is the decision table, walked top to bottom.
// correctness/latency/fluency are each 0..1.

function deriveGrade({ correctness, latency, fluency }) {
  const correct = correctness === 1;
  const typo = correctness > 0 && correctness < 1; // forgiving: a single slip
  const fast = latency >= 0.7;
  const atPace = fluency >= 0.7;

  // wrong — nothing else matters
  if (!correct && !typo) {
    return latency < 0.2 ? 0 : 1; // total blank vs. wrong-but-tried
  }

  // exact answer
  if (correct) {
    if (fast && atPace) return 5;  // easy
    if (fast) return 4;            // good, but below own pace
    return 3;                      // correct but slow/shaky
  }

  // typo (forgiving path)
  if (fast && atPace) return 3;    // mechanical slip — knew it
  return 2;                        // almost — slow + fumbled
}

module.exports = { deriveGrade };