const { schedule } = require("./schedule");

// Walk ONE card through a realistic life. Each step feeds the previous result.
let card = { ease: 2.5, interval: 0, reps: 0 };
const log = [];

function step(grade, note) {
  card = schedule(card, grade);
  log.push({ note, ...card });
}

step(5, "1st review, easy pass");   // reps 1 -> interval 1
step(4, "2nd pass, good");          // reps 2 -> interval 3 (gentle ramp)
step(4, "3rd pass, good");          // reps 3 -> interval 3 * ease
step(1, "fail (lapse)");            // soft reset: interval * 0.2, reps -> 0
step(4, "recover, pass again");     // reps 1 -> interval 1

console.log("Card life:");
for (const s of log) {
  console.log(`  ${s.note.padEnd(22)} ease ${s.ease}  interval ${s.interval}d  reps ${s.reps}`);
}

// Checks on the key moments
const checks = [
  { label: "after 2nd pass, interval is gentle 3", ok: log[1].interval === 3 },
  { label: "3rd pass grew by ease (interval > 3)",  ok: log[2].interval > 3 },
  { label: "lapse softened, not nuked to 1",         ok: log[3].interval > 1 },
  { label: "lapse reset reps to 0",                  ok: log[3].reps === 0 },
  { label: "ease dropped after fail",                ok: log[3].ease < log[2].ease },
  { label: "recovery restarts ramp (interval 1)",    ok: log[4].interval === 1 },
];

let passed = 0;
for (const c of checks) { if (c.ok) passed++; console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.label}`); }
console.log(`\n${passed}/${checks.length} passed`);