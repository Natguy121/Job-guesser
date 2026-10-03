// Accuracy check: plays pretend workers through the game and counts how often
// their real job is the first guess, in the top 3 and in the top 5.
//   node tests/measure.js                 (the 40 workers the tags were tuned on)
//   node tests/measure.js workers-unseen-2 (15 workers written after tuning)
//   add -v to list the misses
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const set = process.argv.find(a => a.startsWith("workers")) || "workers";
const people = require("./" + set + ".js");
const g = {};
new Function("g", ["data.js", "jobs.js", "words.js", "engine.js"]
  .map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n") +
  ";g.E=Engine;g.J=JOBS;g.Q=QUESTIONS;g.T=TOTAL_QUESTIONS")(g);
const prepared = g.E.prepareJobs(g.J.filter(j => j[4] !== "f"));

let top1 = 0, top3 = 0, top5 = 0;
const misses = [];
for (const p of people) {
  const asked = [], readings = [];
  let x = 0;
  for (let i = 0; i < g.T; i++) {
    const q = i < g.Q.length ? g.Q[i] : g.E.pickFollowup(prepared, asked, readings);
    asked.push(q);
    // Fixed questions get the worker's own answers; follow-ups get their extra lines in turn.
    readings.push(g.E.readFor(q, i < g.Q.length ? p.a[i] : p.x[x++ % p.x.length]));
  }
  const res = g.E.scoreJobs(prepared, readings, null);
  const r = res.findIndex(j => j.name === p.job);
  if (r === 0) top1++;
  if (r >= 0 && r < 3) top3++;
  if (r >= 0 && r < 5) top5++;
  if (r !== 0) misses.push(`${p.job} → #${r + 1} (guessed ${res[0].name})`);
}
const n = people.length, pct = v => `${v}/${n} (${Math.round(v / n * 100)}%)`;
console.log(`${set}: first guess ${pct(top1)}, top 3 ${pct(top3)}, top 5 ${pct(top5)}`);
if (process.argv.includes("-v")) console.log(misses.join("\n"));
