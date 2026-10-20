// Gift Elf — the guessing engine. Pure functions, so it can be tested on its own.
//
// Every gift starts equally likely. Each answer (Yes, Probably, Don't know,
// Probably not, No) makes gifts that fit it more likely and the rest less
// likely. The next question is always the one that splits the gifts still in
// the running most evenly, so every answer rules out as much as possible.
const GiftEngine = (function () {
  const TRAIT_KEYS = Object.keys(TRAITS);
  const ANSWERS = { yes: 1, probably: 0.75, unsure: 0.5, probablyNot: 0.25, no: 0 };
  // Groups where a gift lists the ones it suits: ages, and games consoles.
  const GROUPS = [AGE_TRAITS, PLATFORM_TRAITS];
  const groupOf = trait => GROUPS.find(g => g.includes(trait));

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

  // Gifts over the budget are left out from the start.
  function start(budget = Infinity) {
    return { budget, weights: GIFTS.map(g => (g.price <= budget ? 1 : 0)), asked: [], answers: [] };
  }

  // Apply one answer. "Don't know" changes nothing.
  function answer(state, trait, value) {
    const a = ANSWERS[value];
    const weights = state.weights.map((w, i) => {
      if (a === 0.5) return w;
      let v = fit(GIFTS[i], trait);
      // "Not a child" shouldn't rule out a gift that also suits teens or adults:
      // a "no" to an age (or console) only counts against gifts just for that one.
      const group = groupOf(trait);
      if (group && a < 0.5 && v === 1 && group.some(t => t !== trait && GIFTS[i].traits.has(t))) v = a;
      return w * (1 - 0.9 * Math.abs(a - v)); // never all the way to zero, so one slip isn't fatal
    });
    return { budget: state.budget, weights, asked: state.asked.concat(trait), answers: state.answers.concat(value) };
  }

  // Replay answers from scratch (used for the Back button).
  function replay(budget, asked, answers) {
    return asked.reduce((s, t, i) => answer(s, t, answers[i]), start(budget));
  }

  // Traits that no longer need asking. Once an age gets a "yes", the other ages are settled.
  // Consoles aren't, since people often own more than one.
  function settled(state) {
    const done = new Set(state.asked);
    const ageYes = state.asked.some((t, i) => AGE_TRAITS.includes(t) && (state.answers[i] === "yes" || state.answers[i] === "probably"));
    if (ageYes) AGE_TRAITS.forEach(t => done.add(t));
    return done;
  }

  // Pick the question expected to narrow things down the most: for each
  // possible answer, how much would the spread of likely gifts shrink?
  const ENTROPY = ws => {
    const total = ws.reduce((a, b) => a + b, 0);
    return -ws.reduce((h, w) => (w > 0 ? h + (w / total) * Math.log2(w / total) : h), 0);
  };
  function nextQuestion(state) {
    const done = settled(state);
    const total = state.weights.reduce((a, b) => a + b, 0);
    let best = null, bestScore = Infinity;
    TRAIT_KEYS.forEach(t => {
      if (done.has(t)) return;
      // Chance the player says yes (or no), given how likely each gift is.
      const pYes = state.weights.reduce((sum, w, i) => sum + w * fit(GIFTS[i], t), 0) / total;
      let expected = 0;
      [["yes", pYes], ["no", 1 - pYes]].forEach(([value, p]) => {
        if (p <= 0) return;
        expected += p * ENTROPY(answer(state, t, value).weights);
      });
      if (expected < bestScore) { bestScore = expected; best = t; }
    });
    return best;
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

  // The traits the player said yes to that this gift fits, for "why this gift".
  function reasons(state, gift) {
    return state.asked.filter((t, i) => (state.answers[i] === "yes" || state.answers[i] === "probably") && gift.traits.has(t));
  }

  return { TRAIT_KEYS, ANSWERS, fit, start, answer, replay, settled, nextQuestion, ranked, confidence, reasons };
})();
