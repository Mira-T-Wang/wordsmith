const { scoreCorrectness } = require("./correctness");

const cases = [
  { answer: "serene",      typed: "serene",  expect: 1,   note: "exact match" },
  { answer: "serene",      typed: "Serene ", expect: 1,   note: "case + space ignored" },
  { answer: "serene",      typed: "serne",   expect: 0.6, note: "one missing letter" },
  { answer: "serene",      typed: "serede",  expect: 0.6, note: "one wrong letter" },
  { answer: "serendipity", typed: "banana",  expect: 0,   note: "way off" },
  { answer: "cat",         typed: "",        expect: 0,   note: "empty" },
];

let passed = 0;
for (const c of cases) {
  const got = scoreCorrectness(c.answer, c.typed);
  const ok = got === c.expect;
  if (ok) passed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.note.padEnd(24)} got ${got}, expected ${c.expect}`);
}
console.log(`\n${passed}/${cases.length} passed`);