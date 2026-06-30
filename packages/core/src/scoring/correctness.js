function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // delete
        d[i][j - 1] + 1,      // insert
        d[i - 1][j - 1] + cost // substitute
      );
    }
  }
  return d[m][n];
}

function scoreCorrectness(answer, typed) {
  const a = answer.trim().toLowerCase();
  const t = typed.trim().toLowerCase();

  if (a === t) return 1;          // exact
  if (a.length === 0) return 0;

  const dist = levenshtein(a, t);
  if (dist === 1) return 0.6;     // one slip — forgiving partial credit
  return 0;                       // too far off
}

module.exports = { scoreCorrectness, levenshtein };