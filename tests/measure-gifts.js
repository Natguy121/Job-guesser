// Accuracy check for the gift finder.
//
// For every gift in the catalogue we make a pretend person that gift would
// suit: one age (from the ages the gift suits), the gift's interests, plus a
// few random extra interests (real people like more than one thing). A pretend
// shopper answers the questions about that person honestly, with some
// uncertainty ("Probably", "Don't know", the odd slip).
//
// Two scores:
//   good pick   the top pick suits the person's age and at least one of their
//               interests (a telescope for a space-mad kid counts, even if the
//               shopper was picturing a science kit)
//   exact gift  the top pick (or top 3 / top 5) is the very gift we started from
//
//   node tests/measure-gifts.js          (16 questions, the default)
//   node tests/measure-gifts.js --n 15
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const g = {};
new Function("g", ["gifts.js", "gift-engine.js"].map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n") +
  ";g.E=GiftEngine;g.P=PLATFORM_TRAITS;g.G=GIFTS;g.A=AGE_TRAITS;g.T=TRAITS")(g);
const AGE = g.A;
const nArg = process.argv.indexOf("--n");
const N = nArg > 0 ? +process.argv[nArg + 1] : 16;

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Traits that describe the shopping situation, not the person's interests.
const NOT_INTEREST = new Set([...AGE, ...g.P, "pokemon", "starwars", "marvel", "harrypotter", "disney", "practical", "funny", "sentimental", "experience", "relax"]);
const INTERESTS = Object.keys(g.T).filter(t => !NOT_INTEREST.has(t));

function makePerson(gift) {
  const ages = AGE.filter(a => gift.traits.has(a));
  const pool = ages.length ? ages : AGE;
  const age = pool[Math.floor(rand() * pool.length)];
  const has = new Set([age]);
  gift.traits.forEach(t => { if (!AGE.includes(t) && !g.P.includes(t)) has.add(t); });
  // One console the game runs on (or a random one for gamers), sometimes two.
  const plats = g.P.filter(p => gift.traits.has(p));
  if (plats.length) has.add(plats[Math.floor(rand() * plats.length)]);
  if (gift.traits.has("gamer")) g.P.forEach(p => { if (!plats.length && rand() < 0.4 || rand() < 0.15) has.add(p); });
  ["pokemon", "starwars", "marvel", "harrypotter", "disney"].forEach(t => { if (gift.traits.has(t) || rand() < 0.08) has.add(t); });
  INTERESTS.forEach(t => { if (rand() < 0.12) has.add(t); });           // a few extra interests
  ["practical", "funny", "sentimental", "experience", "relax"].forEach(t => { if (rand() < 0.2) has.add(t); });
  return { age, has };
}

function reply(person, trait, gift) {
  const r = rand();
  // A gift's own question: yes for the gift we started from, and now and then
  // for another gift that shares one of their interests.
  if (g.E.isGiftQuestion(trait)) {
    if (trait === gift.id) return r < 0.8 ? "yes" : r < 0.95 ? "probably" : "unsure";
    const other = g.G.find(x => x.id === trait);
    const shares = [...other.traits].some(t => !NOT_INTEREST.has(t) && person.has.has(t));
    return shares && r < 0.15 ? "probably" : r < 0.7 ? "no" : r < 0.9 ? "probablyNot" : "unsure";
  }
  if (person.has.has(trait)) return r < 0.75 ? "yes" : r < 0.92 ? "probably" : "unsure";
  return r < 0.65 ? "no" : r < 0.88 ? "probablyNot" : r < 0.96 ? "unsure" : "probably";
}

function goodPick(pick, person) {
  const ageOk = !AGE.some(a => pick.traits.has(a)) || pick.traits.has(person.age);
  const consoleOk = !g.P.some(p => pick.traits.has(p)) || g.P.some(p => pick.traits.has(p) && person.has.has(p));
  if (!consoleOk) return false;
  const interest = [...pick.traits].some(t => !NOT_INTEREST.has(t) && person.has.has(t));
  return ageOk && interest;
}

let top1 = 0, top3 = 0, top5 = 0, good = 0, total = 0;
for (let run = 0; run < 3; run++) {
  g.G.forEach(gift => {
    const person = makePerson(gift);
    // A budget the gift fits in: its price, or a bit more.
    let s = g.E.start(gift.price * (1 + rand() * 2));
    for (let i = 0; i < N; i++) {
      const t = g.E.nextQuestion(s, new Set(), rand);
      if (!t) break;
      s = g.E.answer(s, t, reply(person, t, gift));
    }
    const list = g.E.ranked(s);
    const r = list.findIndex(x => x.name === gift.name);
    total++;
    if (r === 0) top1++;
    if (r >= 0 && r < 3) top3++;
    if (r >= 0 && r < 5) top5++;
    if (goodPick(list[0], person)) good++;
  });
}
const pct = v => `${Math.round(v / total * 100)}%`;
console.log(`${N} questions: good pick ${pct(good)} | exact gift ${pct(top1)} (top 3 ${pct(top3)}, top 5 ${pct(top5)})`);
