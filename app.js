// Gift Elf — page logic
(function () {
  const EXTRA_QUESTIONS = 5;
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pickOne = list => list[Math.floor(Math.random() * list.length)];

  // Short phrases for "why this gift" ("they love being outdoors").
  const REASON = {
    kid: "they're a kid", teen: "they're a teenager", adult: "they're a grown-up", senior: "it suits grandparents",
    nintendo: "they have a Switch", playstation: "they have a PlayStation", xbox: "they play on Xbox or PC",
    pokemon: "they love Pokémon", starwars: "they love Star Wars", marvel: "they love Marvel",
    harrypotter: "they love Harry Potter", disney: "they love Disney", outdoors: "they love the outdoors",
    sporty: "they love sport", fitness: "they're into fitness", gamer: "they play games", techie: "they love gadgets",
    reader: "they love reading", crafty: "they like making things", artsy: "they're artistic", music: "they love music",
    cook: "they love cooking", coffee: "they love coffee or tea", sweet: "they have a sweet tooth",
    fashion: "they love style", beauty: "they love pampering", cosy: "they love cosy nights in",
    travel: "they love travelling", pets: "they have a pet", animals: "they love animals", garden: "they love plants",
    movies: "they love films", puzzles: "they love puzzles", building: "they love building things",
    science: "they're curious about science", cars: "they're into cars", collector: "they collect things",
    funny: "they'd love a laugh", sentimental: "it's personal", practical: "it's useful", party: "they love a party",
    drinks: "they enjoy a fancy drink", photo: "they love taking photos", diy: "they love DIY",
    boardgames: "they love games night", home: "they love their home", relax: "they need to relax",
    experience: "they'd love to do something special",
  };

  // Budget slider steps, in dollars; the last one means "no limit".
  const BUDGETS = [10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, Infinity];
  const money = n => (n === Infinity ? "No limit" : `$${n}`);
  const budget = () => BUDGETS[+$("budget").value];

  // Questions seen in earlier games, kept in this browser so the next game asks
  // different ones. Once nearly all the broad questions are used up, they come back.
  const SEEN_KEY = "giftElfSeen";
  let seen = new Set();
  try { seen = new Set(JSON.parse(localStorage.getItem(SEEN_KEY)) || []); } catch (e) { /* no storage: start fresh */ }
  function remember(key) {
    seen.add(key);
    if (GiftEngine.TRAIT_KEYS.filter(t => !seen.has(t)).length < 12) GiftEngine.TRAIT_KEYS.forEach(t => seen.delete(t));
    if (GiftEngine.ALL_KEYS.every(k => seen.has(k))) seen.clear();
    try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch (e) { /* fine without it */ }
  }

  let state = GiftEngine.start();
  let current = null;     // the trait being asked now
  let limit = 16;

  function show(id) {
    ["start", "quiz", "thinking", "result"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  // ---------- Questions ----------
  function renderQuestion(say) {
    const n = state.asked.length;
    current = GiftEngine.nextQuestion(state, seen);
    $("qCount").textContent = `Question ${n + 1} of ${limit}`;
    $("baubles").innerHTML = Array.from({ length: limit }, (_, k) =>
      `<li class="${k < n ? "done" : k === n ? "now" : ""}"></li>`).join("");
    $("qText").textContent = GiftEngine.questionText(current);
    $("bubble").textContent = say;
    $("backBtn").disabled = n === 0;
    $("sureFill").style.width = `${Math.round(6 + 94 * GiftEngine.confidence(state))}%`;
    const card = $("qCard");
    card.classList.remove("in");
    void card.offsetWidth; // restart the animation
    card.classList.add("in");
  }

  function reaction(before, after, value) {
    if (value === "unsure") return pickOne(["No worries, next one!", "That's fine, I'll ask something else.", "Okay, let's skip that."]);
    if (after > 0.8) return pickOne(["Ooh, I think I know…", "I've got a really good idea!", "Nearly there!"]);
    if (after - before > 0.1) return pickOne(["That helps a lot!", "Ooh, interesting!", "Now we're getting somewhere!"]);
    return pickOne(["Hmm, let me think…", "Okay, okay…", "Noted!", "Interesting…", "Checking my list…"]);
  }

  function answer(value) {
    if (!current) return;
    const before = GiftEngine.confidence(state);
    state = GiftEngine.answer(state, current, value);
    remember(current);
    if (state.asked.length >= limit) return reveal();
    renderQuestion(reaction(before, GiftEngine.confidence(state), value));
  }

  // ---------- Result ----------
  function reveal() {
    current = null;
    const top = GiftEngine.ranked(state);
    const best = top[0];
    $("giftEmoji").textContent = best.emoji;
    $("giftName").textContent = best.name;
    $("giftWhy").textContent = best.why;
    $("giftPrice").textContent = `About $${best.price}`;
    const why = GiftEngine.reasons(state, best).map(t => (t === best.id ? "you said they'd love it" : REASON[t])).filter(Boolean).slice(0, 3);
    $("giftReasons").textContent = why.length ? `Why: ${why.join(", ")}.` : "";
    $("more").innerHTML = top.slice(1, 6).map(g => `
      <li><span class="m-emoji" aria-hidden="true">${g.emoji}</span>
        <span class="m-text"><strong>${esc(g.name)}</strong><span>${esc(g.why)}</span></span>
        <span class="m-price">$${g.price}</span></li>`).join("");
    $("moreQsBtn").hidden = state.asked.length >= GiftEngine.ALL_KEYS.length;
    if (REDUCED) { show("result"); return; }
    show("thinking");
    setTimeout(() => { show("result"); sparkle(); }, 1400);
  }

  // ---------- Snow ----------
  function snow() {
    if (REDUCED) return;
    const canvas = $("snow");
    const ctx = canvas.getContext("2d");
    let w, h, flakes;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      flakes = Array.from({ length: Math.round(w / 12) }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.2 + 1, s: Math.random() * 0.6 + 0.3, d: Math.random() * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    (function fall() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(170, 195, 210, 0.7)";
      flakes.forEach(f => {
        f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.3;
        if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(fall);
    })();
  }

  // A small burst of stars and baubles when the gift is revealed.
  function sparkle() {
    if (REDUCED) return;
    const card = $("giftCard");
    card.classList.remove("pop");
    void card.offsetWidth;
    card.classList.add("pop");
  }

  // ---------- Events ----------
  $("startBtn").addEventListener("click", () => {
    state = GiftEngine.start(budget());
    limit = +$("qSlider").value;
    show("quiz");
    renderQuestion("Let's find them something wonderful!");
  });
  $("answers").addEventListener("click", e => {
    const b = e.target.closest(".ans");
    if (b) answer(b.dataset.a);
  });
  document.addEventListener("keydown", e => {
    if ($("quiz").hidden) return;
    const keys = { 1: "yes", 2: "probably", 3: "unsure", 4: "probablyNot", 5: "no" };
    if (keys[e.key]) answer(keys[e.key]);
  });
  $("backBtn").addEventListener("click", () => {
    if (!state.asked.length) return;
    state = GiftEngine.replay(state.budget, state.asked.slice(0, -1), state.answers.slice(0, -1));
    renderQuestion("Let's try that one again.");
  });
  $("moreQsBtn").addEventListener("click", () => {
    limit = Math.min(state.asked.length + EXTRA_QUESTIONS, GiftEngine.ALL_KEYS.length);
    show("quiz");
    renderQuestion("Okay, a few more questions!");
  });
  $("againBtn").addEventListener("click", () => show("start"));

  // Show the budget, and how many gifts fit it.
  function showBudget() {
    const b = budget();
    $("budgetOut").textContent = money(b);
    $("giftTotal").textContent = GIFTS.filter(g => g.price <= b).length;
  }
  $("budget").max = BUDGETS.length - 1;
  $("budget").value = BUDGETS.indexOf(100);
  $("budget").addEventListener("input", showBudget);
  $("qSlider").addEventListener("input", () => {
    $("qOut").textContent = $("qTotal").textContent = $("qSlider").value;
  });
  showBudget();
  snow();
})();
