const { scoreLatency } = require("./latency");

const cases = [
  { ms: 0,    threshold: 1500, expect: 1,    note: "instant" },
  { ms: 800,  threshold: 1500, expect: 1,    note: "well under threshold" },
  { ms: 1500, threshold: 1500, expect: 1,    note: "exactly at threshold" },
  { ms: 3000, threshold: 1500, expect: 0.5,  note: "halfway down" },
  { ms: 4500, threshold: 1500, expect: 0,    note: "3x threshold" },
  { ms: 9000, threshold: 1500, expect: 0,    note: "very long stall" },
];

let passed = 0;
for (const c of cases) {
  const got = scoreLatency(c.ms, c.threshold);
  const ok = Math.abs(got - c.expect) < 0.001; // float-safe compare
  if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.note.padEnd(24)} got ${got.toFixed(3)}, expected ${c.expect}`);
}
console.log(`\n${passed}/${cases.length} passed`);