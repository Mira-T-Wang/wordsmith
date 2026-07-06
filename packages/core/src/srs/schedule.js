const LAPSE_MULTIPLIER = 0.2;

function schedule(card, grade) {
  let { ease = 2.5, interval = 0, reps = 0 } = card;

  if (grade < 3) {
    // fail: reset the streak, see it again tomorrow
    reps = 0;
    interval = Math.max(1, Math.round(interval * LAPSE_MULTIPLIER));
  } else {
    // pass: interval grows with each successful rep
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ease);
  }

  ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ease < 1.3) ease = 1.3; 

  return { ease: Number(ease.toFixed(2)), interval, reps };
}

module.exports = { schedule };