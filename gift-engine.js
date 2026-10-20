// Gift Elf — the guessing engine. Pure functions, so it can be tested on its own.
//
// Every gift starts equally likely. Each answer (Yes, Probably, Don't know,
// Probably not, No) makes gifts that fit it more likely and the rest less
// likely. There are two kinds of question:
//   - broad ones about the person ("Do they love being outdoors?"), one per trait
//   - one question per gift ("Do they cheer for the Dallas Cowboys?"), 1,250 in all
// Every question is scored by its expected information gain. The elf picks at
// random among the questions nearly as good as the best, preferring ones you
// haven't seen in earlier games, so games differ without losing much accuracy.
const GiftEngine = (function () {
  const TRAIT_KEYS = Object.keys(TRAITS);
  const GIFT_BY_ID = Object.fromEntries(GIFTS.map((g, i) => [g.id, i]));
  // Broad questions: one per trait, plus clue questions that hint at a trait.
  // Each has how strongly a Yes and a No count (1 = asking about the trait itself).
  const BROAD = {};
  TRAIT_KEYS.forEach(t => { BROAD[t] = { trait: t, yes: 1, no: 1, question: TRAITS[t] }; });
  CLUES.forEach(c => { BROAD[c.id] = c; });
  const BROAD_KEYS = Object.keys(BROAD);
  const ALL_KEYS = BROAD_KEYS.concat(GIFTS.map(g => g.id));
  const ANSWERS = { yes: 1, probably: 0.75, unsure: 0.5, probablyNot: 0.25, no: 0 };
  // How a gift's own question changes its weight.
  const OWN = { yes: 8, probably: 3, unsure: 1, probablyNot: 0.4, no: 0.08 };
  // A question is "good enough" if it narrows things down at least this much,
  // compared with the best question. The elf picks at random among those.
  const GOOD_ENOUGH = 0.85;
  // An unseen question is asked instead of repeating one if it's at least this good
  // (0: always, while any unseen question is left).
  const FRESH_FLOOR = 0;
  // Groups where a gift lists the ones it suits: ages, and games consoles.
  const GROUPS = [AGE_TRAITS, PLATFORM_TRAITS];
  const groupOf = trait => GROUPS.find(g => g.includes(trait));
  const isGiftQuestion = key => key in GIFT_BY_ID;

  // Fit of every gift to every broad question, worked out once.
  const FIT = {};

  function questionText(key) {
    return isGiftQuestion(key) ? GIFTS[GIFT_BY_ID[key]].question : BROAD[key].question;
  }

  // How well a gift fits a trait, from 0 (not at all) to 1 (perfectly).
  function fit(gift, trait) {
    if (gift.traits.has(trait)) return 1;
    const group = groupOf(trait);
    if (group) {
      // A gift that lists ages (or consoles) doesn't suit the others; one that lists none suits everyone.
      return group.some(a => gift.traits.has(a)) ? 0 : 0.7;
    }
    return 0.2; // not what the gift is about, but it could still suit them
  }

  TRAIT_KEYS.forEach(t => { FIT[t] = Float64Array.from(GIFTS, g => fit(g, t)); });

  // How related each gift is to gift k, from 0 to 1: the share of k's interests
  // it has, or -1 if it's for a different age. Worked out when first needed.
  const RELATED = new Map();
  function related(k) {
    if (RELATED.has(k)) return RELATED.get(k);
    const gk = GIFTS[k];
    const likes = [...gk.traits].filter(t => !groupOf(t));
    const ages = AGE_TRAITS.filter(t => gk.traits.has(t));
    const rel = Float64Array.from(GIFTS, g => {
      if (ages.length && AGE_TRAITS.some(t => g.traits.has(t)) && !ages.some(t => g.traits.has(t))) return -1;
      return likes.length ? likes.filter(t => g.traits.has(t)).length / likes.length : 0;
    });
    RELATED.set(k, rel);
    return rel;
  }

  // A gift's own question is also a clue about the person. A "Yes" to "Do they
  // make fresh pasta?" means they probably love cooking and are a grown-up, so
  // it lifts the pasta machine a lot and lowers gifts that share nothing with
  // it. A "No" mostly lowers the pasta machine, and related gifts a little.
  function ownFactor(a, value, k, i, rel) {
    if (i === k) return OWN[value];
    if (a > 0.5) {
      const s = (a - 0.5) * 2;
      return rel[i] < 0 ? 1 - 0.8 * s : 1 - 0.6 * s * (1 - rel[i]);
    }
    if (a < 0.5) return rel[i] > 0 ? 1 - 0.15 * (0.5 - a) * 2 * rel[i] : 1;
    return 1;
  }

  // How an answer to a broad question changes a gift with fit v: the full effect
  // for a trait question, blended towards no effect for a weaker clue.
  function broadFactor(q, a, v) {
    const full = 1 - 0.9 * Math.abs(a - v); // never all the way to zero, so one slip isn't fatal
    const strength = a > 0.5 ? q.yes : q.no;
    return 1 - strength + strength * full;
  }

  // Gifts over the budget are left out from the start.
  function start(budget = Infinity) {
    return { budget, weights: GIFTS.map(g => (g.price <= budget ? 1 : 0)), asked: [], answers: [] };
  }

  // Apply one answer. "Don't know" changes nothing.
  function answer(state, key, value) {
    const a = ANSWERS[value];
    let weights;
    if (isGiftQuestion(key)) {
      const k = GIFT_BY_ID[key];
      const rel = related(k);
      weights = state.weights.map((w, i) => w * ownFactor(a, value, k, i, rel));
    } else {
      const q = BROAD[key], t = q.trait;
      const group = groupOf(t);
      weights = state.weights.map((w, i) => {
        if (a === 0.5) return w;
        let v = FIT[t][i];
        // "Not a child" shouldn't rule out a gift that also suits teens or adults:
        // a "no" to an age (or console) only counts against gifts just for that one.
        if (group && a < 0.5 && v === 1 && group.some(o => o !== t && GIFTS[i].traits.has(o))) v = a;
        return w * broadFactor(q, a, v);
      });
    }
    return { budget: state.budget, weights, asked: state.asked.concat(key), answers: state.answers.concat(value) };
  }

  // Replay answers from scratch (used for the Back button).
  function replay(budget, asked, answers) {
    return asked.reduce((s, t, i) => answer(s, t, answers[i]), start(budget));
  }

  // Questions that no longer need asking:
  //  - a Yes to an age (or a strong age clue) settles every age question
  //    (consoles aren't settled, since people often own more than one)
  //  - once a trait has been asked about directly, its clues add nothing
  //  - at most 2 questions per topic, so weak clues can't eat up a whole game
  function settled(state) {
    const done = new Set(state.asked);
    const perTrait = {};
    let ageYes = false;
    state.asked.forEach((key, i) => {
      const q = BROAD[key];
      if (!q) return;
      perTrait[q.trait] = (perTrait[q.trait] || 0) + 1;
      const yes = state.answers[i] === "yes" || state.answers[i] === "probably";
      if (yes && AGE_TRAITS.includes(q.trait) && q.yes >= 0.8) ageYes = true;
    });
    BROAD_KEYS.forEach(key => {
      const t = BROAD[key].trait;
      if ((ageYes && AGE_TRAITS.includes(t)) || done.has(t) || perTrait[t] >= 2) done.add(key);
    });
    return done;
  }

  // Spread of likely gifts, in bits: lower means the elf is closer to an answer.
  const ENTROPY = ws => {
    const total = ws.reduce((a, b) => a + b, 0);
    return -ws.reduce((h, w) => (w > 0 ? h + (w / total) * Math.log2(w / total) : h), 0);
  };

  // Every question that could be asked now, with its expected spread after the
  // answer (lower is better).
  function scoreQuestions(state, skip, rand = Math.random) {
    const done = settled(state);
    const ws = state.weights;
    const total = ws.reduce((a, b) => a + b, 0);
    const scores = [];
    BROAD_KEYS.forEach(key => {
      if (done.has(key) || skip.has(key)) return;
      const q = BROAD[key], t = q.trait;
      const f = FIT[t];
      const group = groupOf(t);
      // Spread after a "yes" and after a "no", without copying the weights.
      let pYes = 0, sY = 0, lY = 0, sN = 0, lN = 0;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        if (w <= 0) continue;
        const v = f[i];
        // A weak clue is answered "yes" less predictably than the trait itself.
        pYes += w * (0.5 + (v - 0.5) * (q.yes + q.no) / 2);
        const wy = w * broadFactor(q, 1, v);
        // A "no" to an age or console spares gifts that also suit another one.
        const vNo = group && v === 1 && group.some(o => o !== t && GIFTS[i].traits.has(o)) ? 0 : v;
        const wn = w * broadFactor(q, 0, vNo);
        sY += wy; lY += wy * Math.log2(wy);
        sN += wn; lN += wn * Math.log2(wn);
      }
      pYes /= total;
      const hY = Math.log2(sY) - lY / sY, hN = Math.log2(sN) - lN / sN;
      scores.push([key, pYes * hY + (1 - pYes) * hN]);
    });
    // Gift questions: score the 120 likeliest gifts' questions, plus 60 others at random.
    const order = ws.map((w, i) => [w, i]).sort((x, y) => y[0] - x[0]).map(x => x[1]);
    const cands = new Set(order.slice(0, 120));
    for (let tries = 0; tries < 60; tries++) cands.add(order[120 + Math.floor(rand() * Math.max(0, order.length - 120))]);
    cands.forEach(k => {
      if (k === undefined || ws[k] <= 0) return;
      const key = GIFTS[k].id;
      if (done.has(key) || skip.has(key)) return;
      const rel = related(k);
      let pYes = 0, sY = 0, lY = 0, sN = 0, lN = 0;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        if (w <= 0) continue;
        // Chance they'd say yes if gift i were the right one.
        pYes += w * (i === k ? 0.9 : rel[i] < 0 ? 0.02 : 0.03 + 0.35 * rel[i]);
        const wy = w * ownFactor(1, "yes", k, i, rel), wn = w * ownFactor(0, "no", k, i, rel);
        sY += wy; lY += wy * Math.log2(wy);
        sN += wn; lN += wn * Math.log2(wn);
      }
      pYes /= total;
      scores.push([key, pYes * (Math.log2(sY) - lY / sY) + (1 - pYes) * (Math.log2(sN) - lN / sN)]);
    });
    return scores.sort((a, b) => a[1] - b[1]);
  }

  // The next question. Every question is scored by its information gain: how
  // much it's expected to narrow down the gifts. The elf picks at random among
  // the questions that are nearly as good as the best one, preferring ones not in
  // "seen" (asked in earlier games). If every good question has been seen, it
  // asks the best unseen one, unless that's much worse.
  // After a "No", the elf never asks what it would have asked after a "Yes".
  function nextQuestion(state, seen = new Set(), rand = Math.random, goodEnough = GOOD_ENOUGH, freshFloor = FRESH_FLOOR) {
    const skip = new Set();
    const n = state.asked.length;
    const last = state.answers[n - 1];
    if (last === "no" || last === "probablyNot") {
      const before = replay(state.budget, state.asked.slice(0, -1), state.answers.slice(0, -1));
      const ifYes = scoreQuestions(answer(before, state.asked[n - 1], "yes"), new Set(), rand)[0];
      if (ifYes) skip.add(ifYes[0]);
    }
    const scores = scoreQuestions(state, skip, rand);
    if (!scores.length) return null;
    const now = ENTROPY(state.weights);
    const gains = scores.map(([k, h]) => [k, now - h]);
    const best = gains[0][1];
    const good = gains.filter(([, g]) => g >= best * goodEnough);
    const fresh = good.filter(([k]) => !seen.has(k));
    if (fresh.length) return fresh[Math.floor(rand() * fresh.length)][0];
    const bestFresh = gains.find(([k]) => !seen.has(k));
    if (bestFresh && bestFresh[1] >= best * freshFloor) return bestFresh[0];
    return good[Math.floor(rand() * good.length)][0];
  }

  // Gifts ranked best first, with how likely each one is.
  function ranked(state) {
    const total = state.weights.reduce((a, b) => a + b, 0);
    return GIFTS.map((g, i) => ({ ...g, chance: state.weights[i] / total }))
      .filter(g => g.price <= state.budget)
      .sort((a, b) => b.chance - a.chance);
  }

  // How sure the elf is, from 0 to 1: how far the top gift is ahead of the rest.
  function confidence(state) {
    const [a, b = { chance: 0 }] = ranked(state);
    return Math.min(1, a.chance * 3 + (a.chance - b.chance) * 4);
  }

  // The questions the player said yes to that this gift fits, for "why this gift".
  function reasons(state, gift) {
    return state.asked.filter((t, i) => (state.answers[i] === "yes" || state.answers[i] === "probably") &&
      (t === gift.id || (BROAD[t] && gift.traits.has(BROAD[t].trait))));
  }

  const traitOf = key => (BROAD[key] ? BROAD[key].trait : key);

  return { TRAIT_KEYS, BROAD_KEYS, ALL_KEYS, traitOf, ANSWERS, questionText, isGiftQuestion, fit, start, answer, replay, settled, nextQuestion, ranked, confidence, reasons };
})();
