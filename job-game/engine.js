// Future Map — reads typed answers and turns them into points for 50 hidden
// areas, then into job guesses. Pure functions only (no page code), so it can
// be tested on its own.
const Engine = (function () {
  const TOPIC_KEYS = Object.keys(TOPIC_WORDS);
  const COMMON = new Set(typeof COMMON_JOBS === "undefined" ? [] : COMMON_JOBS);

  // Lowercase, drop apostrophes ("don't" -> "dont"), split into words.
  function tokenize(text) {
    return String(text || "").toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter(Boolean);
  }

  // Light plural stripping so "dogs" and "dog" match.
  function norm(word) {
    if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
    if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    return word;
  }

  // Stronger word stem for matching job names and descriptions:
  // "coaching", "coached" and "coach" all match, as do "own" and "owner".
  function stem(word) {
    let w = norm(word);
    for (const suf of ["ing", "ers", "er", "ed", "es", "e"]) {
      if (w.endsWith(suf) && w.length - suf.length >= 3) { w = w.slice(0, -suf.length); break; }
    }
    return w;
  }

  // Sport families: word -> family name.
  const FAMILY_OF = new Map();
  if (typeof SPORT_FAMILIES !== "undefined") {
    Object.entries(SPORT_FAMILIES).forEach(([fam, words]) => words.split(" ").forEach(w => FAMILY_OF.set(w, fam)));
  }
  function familiesIn(tokens) {
    const fams = new Set(tokens.map(t => FAMILY_OF.get(t)).filter(Boolean));
    if (fams.has("amfootball")) fams.delete("football");  // "american football" is its own sport
    return fams;
  }

  // Build a lookup of clue words -> topics.
  const exact = new Map();   // short entries: "dog" -> [ani]
  const prefixes = [];       // long entries: ["anima", ani]
  TOPIC_KEYS.forEach(t => {
    TOPIC_WORDS[t].split(/\s+/).filter(Boolean).forEach(w => {
      if (w.length >= 5) prefixes.push([w, t]);
      else { if (!exact.has(w)) exact.set(w, new Set()); exact.get(w).add(t); }
    });
  });

  function topicsFor(word) {
    const found = new Set();
    [word, word.replace(/e?s$/, "")].forEach(w => (exact.get(w) || []).forEach(t => found.add(t)));
    prefixes.forEach(([p, t]) => { if (word.startsWith(p)) found.add(t); });
    return found;
  }

  // True if a negating word appears in the 3 words before position i.
  function negatedAt(tokens, i) {
    for (let k = Math.max(0, i - 3); k < i; k++) if (NEGATORS.includes(tokens[k])) return true;
    return false;
  }

  // Jobs: keywords from name + description, weighted so rarer words count more.
  function prepareJobs(jobs) {
    const list = jobs.map(([name, desc, tags, train, outlook, similar]) => {
      // Imported jobs (from the big job-title list) have no description, just a
      // closest hand-written job they were tagged from.
      const imported = similar !== undefined;
      const topics = tags.split(" ").map(s => s.match(/^([a-z]+)(\d)$/)).map(m => ({ t: m[1], w: Number(m[2]) })).sort((a, b) => b.w - a.w);
      const words = new Set(tokenize(name + " " + desc).filter(w => w.length >= 3 && !STOPWORDS.has(w) && !STOPWORDS.has(norm(w))).map(stem));
      const families = familiesIn(tokenize(name + " " + desc));
      const names = name.split(/\s*[\/(]\s*/).map(n => tokenize(n.replace(")", "")).map(norm).join(" ")).filter(Boolean);
      return { name, desc, train, outlook, topics, words, names, families, imported, similar, common: COMMON.has(name) };
    });
    // How rare a word is, judged on the hand-written jobs only, so thousands of
    // imported titles sharing "pipe" or "manager" don't water down the clues.
    const df = new Map();
    list.filter(j => !j.imported).forEach(j => j.words.forEach(w => df.set(w, (df.get(w) || 0) + 1)));
    list.forEach(j => { j.weights = new Map([...j.words].map(w => [w, 1 / Math.log2(1 + (df.get(w) || 1))])); });
    const byName = new Map(list.map(j => [j.name, j]));
    const aliases = Object.entries(ALIASES).map(([k, v]) => [tokenize(k).map(norm).join(" "), byName.get(v)]).filter(([, j]) => j);
    // Phrase lookup for spotting job names in answers: "vet" -> Veterinarian, "zumba instructor" -> Zumba Instructor.
    const phrases = new Map();
    const addPhrase = (p, j) => { if (!phrases.has(p)) phrases.set(p, []); phrases.get(p).push(j); };
    list.forEach(j => j.names.forEach(p => addPhrase(p, j)));
    aliases.forEach(([p, j]) => addPhrase(p, j));
    return { list, aliases, phrases };
  }

  // Read one answer. Question words count half, since kids often repeat them.
  // nameWeight says how much naming a job here counts: fully for "What do you
  // want to be?", only a little for "Who do you look up to?".
  function readAnswer(text, questionText, nameWeight = 0.25) {
    const tokens = tokenize(text);
    const echo = new Set(tokenize(questionText));
    const topics = {};
    const clues = {};
    const words = [];
    tokens.forEach((tok, i) => {
      const neg = negatedAt(tokens, i);
      const n = norm(tok);
      if (!neg && tok.length >= 3 && !STOPWORDS.has(tok) && !STOPWORDS.has(n)) words.push(stem(tok));
      topicsFor(tok).forEach(t => {
        const v = (echo.has(tok) ? 0.5 : 1) * (neg ? -1 : 1);
        topics[t] = (topics[t] || 0) + v;
        if (!neg) (clues[t] = clues[t] || []).push(tok);
      });
    });
    // One answer can give a topic at most 2 points (or -1), so one long answer can't take over.
    Object.keys(topics).forEach(t => { topics[t] = Math.max(-1, Math.min(2, topics[t])); });
    const families = [...familiesIn(tokens.filter((t, i) => !negatedAt(tokens, i)))];
    return { tokens: tokens.map(norm), topics, clues, words, families, nameWeight };
  }

  const YES = "yes yeah yep yup ya yea sure definitely absolutely always usually mostly correct".split(" ");
  const NO = "no nope nah never not rarely hardly".split(" ");
  const IN = "inside indoors indoor office in".split(" ");
  const OUT = "outside outdoors outdoor out".split(" ");

  // Read an answer to a question, including yes/no and inside/outside questions.
  function readFor(q, text) {
    const tokens = tokenize(text);
    // On yes/no questions the first "yes" or "no" answers the question, so read
    // the rest on its own: "no, police academy" must not mean "not police academy".
    const yn = q.kind === "yesno" ? tokens.findIndex(w => YES.includes(w) || NO.includes(w)) : -1;
    const rest = yn >= 0 ? tokens.slice(yn + 1).join(" ") : text;
    const r = readAnswer(rest, q.q, q.named ?? (q.for ? 0.6 : 0.25));
    // Fun questions ("If your job was a food…") count less and can ignore areas.
    if (q.ignore) q.ignore.split(" ").forEach(t => { delete r.topics[t]; delete r.clues[t]; });
    if (q.weight) Object.keys(r.topics).forEach(t => { r.topics[t] *= q.weight; });
    // named: 0 means the answer is about someone else (like your boss), so it hints
    // at your field but its words shouldn't match a particular job.
    if (q.named === 0) r.words = [];
    const boost = list => list.split(" ").forEach(t => { r.topics[t] = Math.min(2, (r.topics[t] || 0) + 0.5); });
    if (q.kind === "yesno") {
      const first = tokens.find(w => YES.includes(w) || NO.includes(w));
      r.answer = first ? (YES.includes(first) ? "yes" : "no") : null;
      if (r.answer && q[r.answer]) boost(q[r.answer]);
      if (q.degree && r.answer) r.degree = r.answer === "yes";
    } else if (q.kind === "path") {
      const t = " " + tokens.join(" ") + " ";
      const uni = /\b(university|uni|degree|college|phd|masters|doctorate|bachelors|med school|law school)\b/.test(t);
      const noUni = /\b(apprentice\w*|no degree|didnt go|left school|on the job|certificate|license|licence|academy|luck|worked my way)\b/.test(t);
      if (uni !== noUni) r.degree = uni;
    } else if (q.kind === "inout") {
      const both = tokens.includes("both") || (tokens.some(w => IN.includes(w)) && tokens.some(w => OUT.includes(w)));
      r.answer = both ? "both" : tokens.some(w => OUT.includes(w)) ? "outside" : tokens.some(w => IN.includes(w)) ? "inside" : null;
      if (r.answer === "inside" || r.answer === "outside") boost(INOUT[r.answer]);
    }
    return r;
  }

  // Combine all answers.
  function tally(readings) {
    const s = Object.fromEntries(TOPIC_KEYS.map(k => [k, 0]));
    const last = Object.fromEntries(TOPIC_KEYS.map(k => [k, -1]));
    const clues = Object.fromEntries(TOPIC_KEYS.map(k => [k, []]));
    readings.forEach((r, n) => {
      if (!r) return;
      Object.entries(r.topics).forEach(([t, v]) => { s[t] += v; if (v > 0) last[t] = n; });
      Object.entries(r.clues).forEach(([t, list]) => list.forEach(w => { if (!clues[t].includes(w)) clues[t].push(w); }));
    });
    TOPIC_KEYS.forEach(t => { s[t] = Math.max(0, Math.round(s[t] * 2) / 2); });
    return { s, last, clues };
  }

  // Jobs the kid named directly ("I want to be a vet"), unless negated.
  function mentions(readings, prepared) {
    const found = new Map();
    readings.forEach(r => {
      if (!r) return;
      const toks = r.tokens;
      for (let i = 0; i < toks.length; i++) {
        let phrase = "";
        for (let len = 1; len <= 6 && i + len <= toks.length; len++) {
          phrase = len === 1 ? toks[i] : phrase + " " + toks[i + len - 1];
          const jobs = prepared.phrases.get(phrase);
          if (!jobs) continue;
          const neg = toks.slice(Math.max(0, i - 3), i).some(w => NEGATORS.includes(w));
          const v = neg ? -r.nameWeight : r.nameWeight;
          jobs.forEach(job => found.set(job.name, neg ? Math.min(found.get(job.name) || 0, v) : Math.max(found.get(job.name) || 0, v)));
        }
      }
    });
    return found;
  }

  const SATURATE = 4;
  const IMPORTED_PRIOR = 0.8;

  // The fixed questions to ask in a game of n questions. Short games use the
  // most telling ones first; long games get all 12 and then follow-ups.
  const FIXED_ORDER = [3, 11, 5, 4, 0, 1, 2, 9, 10, 6, 7, 8];
  function planFixed(n) {
    return FIXED_ORDER.slice(0, Math.min(n, QUESTIONS.length)).sort((a, b) => a - b).map(i => QUESTIONS[i]);
  }

  function startYears(job, age) { return Math.max(0, 18 + job.train - age); }

  // Score every job. Topic fit counts most; exact words from the job's own
  // description add a bit; naming the job adds a lot.
  function scoreJobs(prepared, readings, age) {
    const { s } = tally(readings);
    const best = Math.max(1, ...Object.values(s));
    const named = mentions(readings, prepared);
    const said = new Set(readings.flatMap(r => (r ? r.words : [])));
    const degree = readings.reduce((d, r) => (r && r.degree != null ? r.degree : d), null);
    const sports = new Set(readings.flatMap(r => (r && r.families) || []));
    return prepared.list.map(j => {
      let got = 0, max = 0;
      // Each area counts as fully confirmed after SATURATE clue points, so one huge
      // area can't drown out the smaller ones that tell similar jobs apart.
      const strength = t => Math.min(1, s[t] / Math.min(SATURATE, best));
      j.topics.forEach(({ t, w }) => { got += w * strength(t); max += w; });
      // Jobs tagged with few areas would fit too easily, so pad them a little.
      max += Math.max(0, 5 - j.topics.reduce((sum, x) => sum + x.w, 0)) * 0.5;
      const fit = max ? got / max : 0;
      const hits = [...j.words].filter(w => said.has(w));
      const direct = Math.min(1, hits.reduce((sum, w) => sum + j.weights.get(w), 0) / 2.5);
      const mention = named.get(j.name) || 0;  // -1 to 1
      const yrs = age == null ? 0 : Math.min(15, startYears(j, age));
      const mod = age == null ? 1 : { f: 1 + 0.012 * yrs, g: 1 + 0.004 * yrs, s: 1, c: 1 - 0.008 * yrs }[j.outlook];
      // "Did you need a degree?" nudges jobs by how long their training is.
      const deg = degree == null ? 1 : degree
        ? (j.train >= 4 ? 1.15 : j.train <= 1 ? 0.75 : 0.95)
        : (j.train >= 4 ? 0.7 : j.train <= 2 ? 1.1 : 1);
      // Common jobs are simply more likely: far more people are nurses than primatologists.
      // Imported titles lose close calls to hand-written jobs, so odd variants
      // ("1st Pressman On Web Press") only win when the answers point right at them.
      const prior = j.common ? 1.08 : j.imported ? IMPORTED_PRIOR : 1;
      // Mentioned a sport? Jobs in that sport move up; jobs in other sports move down.
      let fam = 1;
      if (sports.size && j.families.size) fam = [...j.families].some(f => sports.has(f)) ? 1.2 : 0.6;
      const score = (0.6 * fit + 0.35 * direct + 0.45 * mention) * mod * deg * prior * fam;
      return { ...j, pct: Math.max(0, Math.min(99, Math.round(score * 100))), score, hits, mentioned: mention >= 0.5 };
    }).sort((a, b) => b.score - a.score || a.train - b.train || a.name.localeCompare(b.name));
  }

  // Pick the next follow-up question. Early on (few clues) it asks about the
  // strongest area. After that it asks about the area that best splits the
  // current top guesses, so each answer rules some of them in or out.
  function pickFollowup(prepared, asked, readings) {
    const used = new Set(asked);
    const left = FOLLOWUPS.filter(f => !used.has(f));
    if (!left.length) return null;
    const { s } = tally(readings);
    const clues = Object.values(s).reduce((a, b) => a + b, 0);
    if (clues < 2) {
      const ranked = TOPIC_KEYS.slice().sort((a, b) => s[b] - s[a]);
      return left.find(f => f.for === ranked.find(t => left.some(x => x.for === t))) || left[0];
    }
    const top = scoreJobs(prepared, readings, null).slice(0, 8);
    const weights = top.map(j => j.score * j.score);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let best = null, bestValue = -1;
    left.forEach(f => {
      const vals = top.map(j => (j.topics.find(x => x.t === f.for) || { w: 0 }).w);
      const mean = vals.reduce((sum, v, i) => sum + v * weights[i], 0) / total;
      const spread = vals.reduce((sum, v, i) => sum + weights[i] * (v - mean) ** 2, 0) / total;
      // Small bonus for areas the leading guess needs, so the game also confirms its hunch.
      const value = spread + 0.05 * vals[0];
      if (value > bestValue) { bestValue = value; best = f; }
    });
    return best;
  }

  // How sure the game is right now, from 0 (no idea) to 1 (pretty sure).
  // It needs plenty of clues (about 26 clue points to max out) AND a clear lead
  // for the best guess over the next one. Tuned so it climbs gradually.
  function closeness(results, readings) {
    if (results.length < 2 || results[0].score <= 0) return 0;
    const { s } = tally(readings);
    const evidence = Object.values(s).reduce((a, b) => a + b, 0);
    const lead = (results[0].score - results[1].score) / results[0].score;
    return Math.min(1, evidence / 26) * (0.35 + 0.65 * Math.min(1, lead * 6));
  }

  // Combine the hand-written jobs with the imported job titles (all-jobs.js).
  // Future jobs are left out, since nobody has them yet.
  function allJobs(jobs, titles) {
    const real = jobs.filter(j => j[4] !== "f");
    if (!titles) return real;
    const imported = titles.split("\n").map(line => {
      const [name, tags, train, sim] = line.split("|");
      const similar = +sim >= 0 && real[+sim] ? real[+sim][0] : null;
      return [name, "", tags, +train, "s", similar];
    });
    return real.concat(imported);
  }

  return { allJobs, tokenize, stem, topicsFor, readAnswer, readFor, tally, prepareJobs, scoreJobs, pickFollowup, closeness, planFixed, startYears, TOPIC_KEYS };
})();
