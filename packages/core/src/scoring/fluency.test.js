const { scoreFluency } = require("./fluency");

// baselineCps = 4 means 4 chars/sec is "normal" for this user.
// A 12-char word at 4 cps takes 3000ms (baseline pace).
const cases = [
  { ms: 3000, len: 12, base: 4, expect: 1,   note: "exactly baseline pace" },
  { ms: 1500, len: 12, base: 4, expect: 1,   note: "twice as fast (caps at 1)" },
  { ms: 4000, len: 12, base: 4, expect: 0.5, note: "3/4 speed -> 0.5" },
  { ms: 6000, len: 12, base: 4, expect: 0,   note: "half speed -> 0" },
  { ms: 9000, len: 12, base: 4, expect: 0,   note: "very slow" },
  { ms: 0,    len: 12, base: 4, expect: 1,   note: "bad data -> not punished" },
];

let passed = 0;
for (const c of cases) {
  const got = scoreFluency(c.ms, c.len, c.base);
  const ok = Math.abs(got - c.expect) < 0.001;
  if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.note.padEnd(28)} got ${got.toFixed(3)}, expected ${c.expect}`);
}
console.log(`\n${passed}/${cases.length} passed`);  