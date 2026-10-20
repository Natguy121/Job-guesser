// Builds all-jobs.js from source/all_jobs.csv (a list of 70,000+ job titles).
//   node scripts/build-all-jobs.js
//
// The titles have no descriptions, so each one is tagged automatically:
//  1. Find the closest hand-written job in jobs.js by shared words (the last
//     word of a title, like "Teacher" in "Zoology Teacher", counts most).
//     Borrow its hidden areas and training years.
//  2. Add any areas the title's own words point to (from words.js).
//  3. If nothing matches, fall back to what the last word suggests
//     ("...Technician" -> repair, "...Manager" -> management, and so on).
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const g = {};
new Function("g", ["data.js", "jobs.js", "words.js", "engine.js"]
  .map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n") + ";g.E=Engine;g.J=JOBS;g.S=STOPWORDS")(g);
const E = g.E;
const STOPWORDS = g.S;

// Hand-written jobs (real ones only) and a word index over them.
const curated = g.J.filter(j => j[4] !== "f");
const have = new Set(g.J.map(j => j[0].toLowerCase()));
const words = (s) => E.tokenize(s).filter(w => w.length >= 2 && !STOPWORDS.has(w)).map(E.stem);
const df = new Map();
const index = new Map(); // word -> [{i, inName}]
curated.forEach((j, i) => {
  const nameW = new Set(words(j[0]));
  const descW = new Set(words(j[1]));
  new Set([...nameW, ...descW]).forEach(w => {
    df.set(w, (df.get(w) || 0) + 1);
    if (!index.has(w)) index.set(w, []);
    index.get(w).push({ i, inName: nameW.has(w) });
  });
});
const idf = w => Math.log(1 + curated.length / (df.get(w) || 1));

function closest(title) {
  const tw = words(title);
  if (!tw.length) return null;
  const scores = new Map();
  tw.forEach((w, k) => {
    const head = k === tw.length - 1 ? 1.6 : 1;   // the last word is usually the job itself
    (index.get(w) || []).forEach(({ i, inName }) => {
      scores.set(i, (scores.get(i) || 0) + idf(w) * head * (inName ? 2 : 0.6));
    });
  });
  let best = null, bestScore = 0;
  scores.forEach((s, i) => {
    // Prefer shorter names when tied, so "Teacher" beats "Kindergarten Teacher" for "2nd Grade Teacher".
    const adj = s - 0.01 * curated[i][0].length;
    if (adj > bestScore) { bestScore = adj; best = i; }
  });
  return bestScore >= 3 ? best : null;
}

// Fallbacks from the last word of the title.
const ROLE = {
  technician: "repair", tech: "repair", mechanic: "repair", operator: "repair", repairer: "repair", installer: "build",
  engineer: "eng", designer: "visual", analyst: "rsch", scientist: "lab", researcher: "rsch", specialist: "mgmt",
  manager: "mgmt", supervisor: "mgmt", director: "mgmt", coordinator: "mgmt", administrator: "mgmt", lead: "mgmt",
  officer: "mgmt", executive: "mgmt", head: "mgmt", chief: "mgmt", president: "mgmt", owner: "money",
  clerk: "money", accountant: "money", assistant: "service", associate: "sales", representative: "sales", agent: "sales",
  consultant: "sales", advisor: "social", adviser: "social", counselor: "mind", worker: "build", laborer: "build",
  helper: "build", inspector: "police", examiner: "law", teacher: "school", instructor: "instr", trainer: "instr",
  tutor: "school", professor: "school", nurse: "nurse", therapist: "rehab", aide: "nurse", driver: "drive",
  attendant: "service", cook: "cook", writer: "write", editor: "write", developer: "code", programmer: "code",
  architect: "eng", artist: "visual", maker: "craft", builder: "build", fitter: "build", machinist: "repair",
  welder: "build", painter: "build", cleaner: "service", guard: "police", planner: "mgmt", buyer: "sales",
  estimator: "money", auditor: "money", controller: "money", nanny: "kids", sitter: "kids", coach: "instr",
};

const lines = [];
const seen = new Set();
let fromClosest = 0, fromWords = 0, fromRole = 0, generic = 0;
const csv = fs.readFileSync(path.join(root, "source/all_jobs.csv"), "utf8").split(/\r?\n/).slice(1);
for (let raw of csv) {
  const title = raw.trim().replace(/^"|"$/g, "").replace(/""/g, '"').replace(/\s+/g, " ").trim();
  if (!title || /[|]/.test(title)) continue;
  const key = title.toLowerCase();
  if (have.has(key) || seen.has(key)) continue;
  seen.add(key);

  const tags = new Map();
  let train = 1, sim = -1;
  const c = closest(title);
  if (c !== null) {
    curated[c][2].split(" ").forEach(s => { const m = s.match(/^([a-z]+)(\d)$/); tags.set(m[1], +m[2]); });
    train = curated[c][3]; sim = c; fromClosest++;
  }
  // Areas the title's own words point to
  const hits = new Map();
  E.tokenize(title).forEach(w => E.topicsFor(w).forEach(t => hits.set(t, (hits.get(t) || 0) + 1)));
  [...hits.entries()].sort((a, b) => b[1] - a[1]).forEach(([t], k) => {
    if (!tags.has(t)) tags.set(t, tags.size === 0 ? 3 : k === 0 ? 2 : 1);
  });
  if (c === null && hits.size) fromWords++;
  if (!tags.size) {
    const last = E.tokenize(title).pop() || "";
    const role = ROLE[last] || ROLE[last.replace(/s$/, "")];
    if (role) { tags.set(role, 3); fromRole++; } else { tags.set("mgmt", 1); tags.set("service", 1); generic++; }
  }
  const tagStr = [...tags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t, w]) => t + w).join(" ");
  lines.push(`${title}|${tagStr}|${train}|${sim}`);
}

const out = `// Future Map — ${lines.length.toLocaleString("en-US")} more job titles from source/all_jobs.csv.
// Built by scripts/build-all-jobs.js; don't edit by hand, re-run the script.
// Each line: title | hidden areas | years of training | index of the closest hand-written job (-1 = none)
const ALL_JOB_TITLES = ${JSON.stringify(lines.join("\n"))};
`;
fs.writeFileSync(path.join(root, "all-jobs.js"), out);
console.log(`wrote ${lines.length} titles: ${fromClosest} from a close job, ${fromWords} from title words, ${fromRole} from the last word, ${generic} generic`);
