// Future Map — reads typed answers and turns them into topic points and job guesses.
// Pure functions only (no page code), so it can be tested on its own.
const Engine = (function () {
  const TOPIC_KEYS = Object.keys(TOPICS);

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
    const list = jobs.map(([name, desc, tags, train, outlook]) => {
      const topics = tags.split(" ").map(s => ({ t: s.slice(0, 3), w: Number(s.slice(3)) })).sort((a, b) => b.w - a.w);
      const words = new Set(tokenize(name + " " + desc).map(norm).filter(w => w.length >= 4 && !STOPWORDS.has(w)));
      const names = name.split(/\s*[\/(]\s*/).map(n => tokenize(n.replace(")", "")).map(norm).join(" ")).filter(Boolean);
      return { name, desc, train, outlook, topics, words, names };
    });
    const df = new Map();
    list.forEach(j => j.words.forEach(w => df.set(w, (df.get(w) || 0) + 1)));
    list.forEach(j => { j.weights = new Map([...j.words].map(w => [w, 1 / Math.log2(1 + df.get(w))])); });
    const byName = new Map(list.map(j => [j.name, j]));
    const aliases = Object.entries(ALIASES).map(([k, v]) => [tokenize(k).map(norm).join(" "), byName.get(v)]).filter(([, j]) => j);
    return { list, aliases };
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
      if (!neg && n.length >= 4 && !STOPWORDS.has(n)) words.push(n);
      topicsFor(tok).forEach(t => {
        const v = (echo.has(tok) ? 0.5 : 1) * (neg ? -1 : 1);
        topics[t] = (topics[t] || 0) + v;
        if (!neg) (clues[t] = clues[t] || []).push(tok);
      });
    });
    // One answer can give a topic at most 2 points (or -1), so one long answer can't take over.
    Object.keys(topics).forEach(t => { topics[t] = Math.max(-1, Math.min(2, topics[t])); });
    return { tokens: tokens.map(norm), topics, clues, words, nameWeight };
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
      const text = " " + r.tokens.join(" ") + " ";
      const check = (phrase, job) => {
        let at = text.indexOf(" " + phrase + " ");
        while (at !== -1) {
          const before = text.slice(0, at).trim().split(" ").filter(Boolean);
          const neg = before.slice(-3).some(w => NEGATORS.includes(w));
          const v = neg ? -r.nameWeight : r.nameWeight;
          found.set(job.name, neg ? Math.min(found.get(job.name) || 0, v) : Math.max(found.get(job.name) || 0, v));
          at = text.indexOf(" " + phrase + " ", at + 1);
        }
      };
      prepared.list.forEach(j => j.names.forEach(p => check(p, j)));
      prepared.aliases.forEach(([p, j]) => check(p, j));
    });
    return found;
  }

  function startYears(job, age) { return Math.max(0, 18 + job.train - age); }

  // Score every job. Topic fit counts most; exact words from the job's own
  // description add a bit; naming the job adds a lot.
  function scoreJobs(prepared, readings, age) {
    const { s } = tally(readings);
    const best = Math.max(1, ...Object.values(s));
    const named = mentions(readings, prepared);
    const said = new Set(readings.flatMap(r => (r ? r.words : [])));
    return prepared.list.map(j => {
      let got = 0, max = 0;
      j.topics.forEach(({ t, w }) => { got += w * s[t]; max += w * best; });
      // Jobs tagged with few topics would fit too easily, so pad them a little.
      max += Math.max(0, 5 - j.topics.reduce((sum, x) => sum + x.w, 0)) * 0.5 * best;
      const fit = max ? got / max : 0;
      const hits = [...j.words].filter(w => said.has(w));
      const direct = Math.min(1, hits.reduce((sum, w) => sum + j.weights.get(w), 0) / 2.5);
      const mention = named.get(j.name) || 0;  // -1 to 1
      const yrs = age == null ? 0 : Math.min(15, startYears(j, age));
      const mod = age == null ? 1 : { f: 1 + 0.012 * yrs, g: 1 + 0.004 * yrs, s: 1, c: 1 - 0.008 * yrs }[j.outlook];
      const score = (0.6 * fit + 0.35 * direct + 0.45 * mention) * mod;
      return { ...j, pct: Math.max(0, Math.min(99, Math.round(score * 100))), score, hits, mentioned: mention >= 0.5 };
    }).sort((a, b) => b.score - a.score || a.train - b.train || a.name.localeCompare(b.name));
  }

  return { tokenize, readAnswer, tally, prepareJobs, scoreJobs, startYears, TOPIC_KEYS };
})();
