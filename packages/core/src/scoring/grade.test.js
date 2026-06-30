const { deriveGrade } = require("./grade");

const cases = [
  { c: 1,   l: 1,   f: 1,   expect: 5, note: "exact, fast, at pace -> easy" },
  { c: 1,   l: 1,   f: 0.3, expect: 4, note: "exact, fast, below pace -> good" },
  { c: 1,   l: 0.3, f: 1,   expect: 3, note: "exact but slow -> shaky" },
  { c: 0.6, l: 1,   f: 1,   expect: 3, note: "typo, fast+smooth -> mechanical slip" },
  { c: 0.6, l: 0.3, f: 0.3, expect: 2, note: "typo, slow -> almost" },
  { c: 0,   l: 1,   f: 0,   expect: 1, note: "wrong but reacted -> again(1)" },
  { c: 0,   l: 0.1, f: 0,   expect: 0, note: "wrong, blanked -> again(0)" },
];

let passed = 0;
for (const c of cases) {
  const got = deriveGrade({ correctness: c.c, latency: c.l, fluency: c.f });
  const ok = got === c.expect;
  if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.note.padEnd(40)} got ${got}, expected ${c.expect}`);
}
console.log(`\n${passed}/${cases.length} passed`);