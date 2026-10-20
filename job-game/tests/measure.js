// Accuracy check: plays pretend workers through the game and counts how often
// their real job is the first guess, in the top 3 and in the top 5.
//   node tests/measure.js                 (the 40 workers the tags were tuned on)
//   node tests/measure.js workers-unseen-2 (15 workers written after tuning)
//   add -v to list the misses, --n 10 to play 10 questions, --hand-only to skip the imported titles
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const set = process.argv.find(a => a.startsWith("workers")) || "workers";
const people = require("./" + set + ".js");
const g = {};
new Function("g", ["data.js", "jobs.js", "all-jobs.js", "words.js", "engine.js"]
  .map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n") +
  ";g.E=Engine;g.J=JOBS;g.A=ALL_JOB_TITLES;g.Q=QUESTIONS;g.T=TOTAL_QUESTIONS")(g);
const QUESTIONS_INDEX = new Map();
g.Q.forEach((q, i) => QUESTIONS_INDEX.set(q, i));
const prepared = g.E.prepareJobs(g.E.allJobs(g.J, process.argv.includes("--hand-only") ? null : g.A));
// Number of questions: --n 10 (default: TOTAL_QUESTIONS)
const nArg = process.argv.indexOf("--n");
const total = nArg > 0 ? +process.argv[nArg + 1] : g.T;

// --vague 0.5: each answer has that chance of being left blank, like a real
// player who skips or gives a vague answer. Repeated over 5 seeded runs.
const vArg = process.argv.indexOf("--vague");
const vague = vArg > 0 ? +process.argv[vArg + 1] : 0;
let seed = 1;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const runs = vague ? 5 : 1;
let top1 = 0, top3 = 0, top5 = 0;
const misses = [];
for (let run = 0; run < runs; run++) for (const p of people) {
  const asked = [], readings = [];
  let x = 0;
  const fixed = g.E.planFixed(total);
  for (let i = 0; i < total; i++) {
    const q = i < fixed.length ? fixed[i] : g.E.pickFollowup(prepared, asked, readings);
    asked.push(q);
    // Fixed questions get the worker's own answer to that question; follow-ups get their extra lines in turn.
    const ans = i < fixed.length ? p.a[QUESTIONS_INDEX.get(q)] : p.x[x++ % p.x.length];
    readings.push(g.E.readFor(q, vague && rand() < vague ? "" : ans));
  }
  const res = g.E.scoreJobs(prepared, readings, null);
  const r = res.findIndex(j => j.name === p.job);
  if (r === 0) top1++;
  if (r >= 0 && r < 3) top3++;
  if (r >= 0 && r < 5) top5++;
  if (r !== 0) misses.push(`${p.job} → #${r + 1} (guessed ${res[0].name})`);
}
const n = people.length * runs, pct = v => `${v}/${n} (${Math.round(v / n * 100)}%)`;
console.log(`${set}: first guess ${pct(top1)}, top 3 ${pct(top3)}, top 5 ${pct(top5)}`);
if (process.argv.includes("-v")) console.log(misses.join("\n"));
