// Gift Elf — the guessing engine. Pure functions, so it can be tested on its own.
//
// Every gift starts equally likely. Each answer (Yes, Probably, Don't know,
// Probably not, No) makes gifts that fit it more likely and the rest less
// likely. There are two kinds of question:
//   - broad ones about the person ("Do they love being outdoors?"), one per trait
//   - one question per gift ("Do they cheer for the Dallas Cowboys?"), 1,250 in all
// The elf picks at random from the few best questions of each kind, and skips
// questions you've seen in earlier games, so every game asks different things.
const GiftEngine = (function () {
  const TRAIT_KEYS = Object.keys(TRAITS);
  const GIFT_BY_ID = Object.fromEntries(GIFTS.map((g, i) => [g.id, i]));
  const ALL_KEYS = TRAIT_KEYS.concat(GIFTS.map(g => g.id));
  const ANSWERS = { yes: 1, probably: 0.75, unsure: 0.5, probablyNot: 0.25, no: 0 };
  // How a gift's own question changes its weight.
  const OWN = { yes: 8, probably: 3, unsure: 1, probablyNot: 0.4, no: 0.08 };
  // The elf picks at random between the best 2 broad questions and the best 3
  // gift questions. The first few questions are always broad, to get started.
  const BROAD_CHOICES = 2, GIFT_CHOICES = 3, BROAD_START = 3;
  // Groups where a gift lists the ones it suits: ages, and games consoles.
  const GROUPS = [AGE_TRAITS, PLATFORM_TRAITS];
  const groupOf = trait => GROUPS.find(g => g.includes(trait));
  const isGiftQuestion = key => key in GIFT_BY_ID;

  // Fit of every gift to every broad question, worked out once.
  const FIT = {};

  function questionText(key) {
    return isGiftQuestion(key) ? GIFTS[GIFT_BY_ID[key]].question : TRAITS[key];
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

  // Gifts over the budget are left out from the start.
  function start(budget = Infinity) {
    return { budget, weights: GIFTS.map(g => (g.price <= budget ? 1 : 0)), asked: [], answers: [] };
  }

  // Apply one answer. "Don't know" changes nothing.
  function answer(state, key, value) {
    const a = ANSWERS[value];
    let weights;
    if (isGiftQuestion(key)) {
      // A gift's own question moves that gift a lot. A "yes" also nudges up
      // gifts that share its interests (a Cowboys fan probably likes sport).
      const k = GIFT_BY_ID[key];
      const likes = [...GIFTS[k].traits].filter(t => !groupOf(t));
      const boost = a > 0.5 ? (a - 0.5) * 1.2 : 0;
      weights = state.weights.map((w, i) => {
        if (i === k) return w * OWN[value];
        if (!boost || !likes.length) return w;
        const share = likes.filter(t => GIFTS[i].traits.has(t)).length / likes.length;
        return w * (1 + boost * share);
      });
    } else {
      weights = state.weights.map((w, i) => {
        if (a === 0.5) return w;
        let v = fit(GIFTS[i], key);
        // "Not a child" shouldn't rule out a gift that also suits teens or adults:
        // a "no" to an age (or console) only counts against gifts just for that one.
        const group = groupOf(key);
        if (group && a < 0.5 && v === 1 && group.some(t => t !== key && GIFTS[i].traits.has(t))) v = a;
        return w * (1 - 0.9 * Math.abs(a - v)); // never all the way to zero, so one slip isn't fatal
      });
    }
    return { budget: state.budget, weights, asked: state.asked.concat(key), answers: state.answers.concat(value) };
  }

  // Replay answers from scratch (used for the Back button).
  function replay(budget, asked, answers) {
    return asked.reduce((s, t, i) => answer(s, t, answers[i]), start(budget));
  }

  // Questions that no longer need asking. Once an age gets a "yes", the other ages are settled.
  // Consoles aren't, since people often own more than one.
  function settled(state) {
    const done = new Set(state.asked);
    const ageYes = state.asked.some((t, i) => AGE_TRAITS.includes(t) && (state.answers[i] === "yes" || state.answers[i] === "probably"));
    if (ageYes) AGE_TRAITS.forEach(t => done.add(t));
    return done;
  }

  // Spread of likely gifts, in bits: lower means the elf is closer to an answer.
  const ENTROPY = ws => {
    const total = ws.reduce((a, b) => a + b, 0);
    return -ws.reduce((h, w) => (w > 0 ? h + (w / total) * Math.log2(w / total) : h), 0);
  };

  // Every question that could be asked now, with its expected spread after the
  // answer (lower is better).
  function scoreQuestions(state, skip) {
    const done = settled(state);
    const ws = state.weights;
    const total = ws.reduce((a, b) => a + b, 0);
    const scores = [];
    TRAIT_KEYS.forEach(t => {
      if (done.has(t) || skip.has(t)) return;
      const f = FIT[t];
      const group = groupOf(t);
      // Spread after a "yes" and after a "no", without copying the weights.
      let pYes = 0, sY = 0, lY = 0, sN = 0, lN = 0;
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        if (w <= 0) continue;
        const v = f[i];
        pYes += w * v;
        const wy = w * (1 - 0.9 * (1 - v));
        // A "no" to an age or console spares gifts that also suit another one.
        const vNo = group && v === 1 && group.some(o => o !== t && GIFTS[i].traits.has(o)) ? 0 : v;
        const wn = w * (1 - 0.9 * vNo);
        sY += wy; lY += wy * Math.log2(wy);
        sN += wn; lN += wn * Math.log2(wn);
      }
      pYes /= total;
      const hY = Math.log2(sY) - lY / sY, hN = Math.log2(sN) - lN / sN;
      scores.push([t, pYes * hY + (1 - pYes) * hN]);
    });
    // Gift questions only help for gifts still in the running, so score the top 40.
    // Changing one weight lets the spread be worked out without copying every weight.
    const sumWLog = ws.reduce((s, w) => (w > 0 ? s + w * Math.log2(w) : s), 0);
    const spreadIf = (w, w2) => {
      const t2 = total - w + w2;
      const l2 = sumWLog - (w > 0 ? w * Math.log2(w) : 0) + (w2 > 0 ? w2 * Math.log2(w2) : 0);
      return Math.log2(t2) - l2 / t2;
    };
    ws.map((w, i) => [w, i]).sort((a, b) => b[0] - a[0]).slice(0, 40).forEach(([w, i]) => {
      const key = GIFTS[i].id;
      if (w <= 0 || done.has(key) || skip.has(key)) return;
      const pYes = Math.min(0.9, w / total + 0.1); // other gifts could suit them too
      scores.push([key, pYes * spreadIf(w, w * OWN.yes) + (1 - pYes) * spreadIf(w, w * OWN.no)]);
    });
    return scores.sort((a, b) => a[1] - b[1]);
  }

  // The next question. Picks at random among the best few, skipping questions in
  // "seen" (from earlier games) while there are enough others to choose from.
  // After a "No", the elf never asks what it would have asked after a "Yes".
  function nextQuestion(state, seen = new Set(), rand = Math.random) {
    const skip = new Set(seen);
    const n = state.asked.length;
    const last = state.answers[n - 1];
    if (last === "no" || last === "probablyNot") {
      const before = replay(state.budget, state.asked.slice(0, -1), state.answers.slice(0, -1));
      const ifYes = scoreQuestions(answer(before, state.asked[n - 1], "yes"), new Set())[0];
      if (ifYes) skip.add(ifYes[0]);
    }
    let scores = scoreQuestions(state, skip);
    if (scores.length < BROAD_CHOICES + GIFT_CHOICES) scores = scoreQuestions(state, new Set());
    if (!scores.length) return null;
    const broad = scores.filter(([k]) => !isGiftQuestion(k)).slice(0, BROAD_CHOICES);
    const gifts = scores.filter(([k]) => isGiftQuestion(k)).slice(0, GIFT_CHOICES);
    let pick = n < BROAD_START && broad.length ? broad : broad.concat(gifts);
    if (!pick.length) pick = scores.slice(0, 1);
    return pick[Math.floor(rand() * pick.length)][0];
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
      (gift.traits.has(t) || t === gift.id));
  }

  return { TRAIT_KEYS, ALL_KEYS, ANSWERS, questionText, isGiftQuestion, fit, start, answer, replay, settled, nextQuestion, ranked, confidence, reasons };
})();
