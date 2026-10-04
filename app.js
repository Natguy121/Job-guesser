// Future Map — page logic for the "guess my job" game show
(function () {
  const PAGE = 20;
  const MAX_GUESSES = 10;
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Future jobs barely exist yet, so nobody has them today. Leave them out of guessing.
  // Hand-written jobs plus the big imported list of job titles (all-jobs.js).
  const prepared = Engine.prepareJobs(Engine.allJobs(JOBS, typeof ALL_JOB_TITLES === "undefined" ? null : ALL_JOB_TITLES));

  // Estimated accuracy for each game length: the share of games where the first
  // guess was right, for the 29 test workers in tests/ answering like real
  // players who leave about half their answers blank or vague.
  // Re-measure with: node tests/measure.js workers-simple --n 10 --vague 0.5
  // (35 measured a little lower only because the test players run out of fresh answers.)
  const ACCURACY = { 5: 0.35, 10: 0.42, 15: 0.55, 20: 0.56, 25: 0.56, 30: 0.57, 35: 0.57 };
  function accuracyFor(n) {
    const keys = Object.keys(ACCURACY).map(Number).sort((x, y) => x - y);
    const lo = keys.filter(k => k <= n).pop(), hi = keys.find(k => k >= n);
    if (lo === hi) return ACCURACY[lo];
    return ACCURACY[lo] + (ACCURACY[hi] - ACCURACY[lo]) * (n - lo) / (hi - lo);
  }

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pickOne = list => list[Math.floor(Math.random() * list.length)];

  const state = {
    asked: [],     // questions shown so far, in order
    texts: [],     // what the player typed for each
    readings: [],  // Engine.readFor result for each
    i: 0,
    heat: 0,       // how close the game thinks it is, 0 to 1
    guesses: [],   // jobs ranked best first
    guessAt: 0,    // which guess is showing
    listLimit: PAGE,
    total: 20,     // how many questions this game has
    fixed: [],     // the fixed questions for this game
    clockSecs: 0,  // 0 = no clock
    deadline: 0,
    timer: null,
    timedOut: false,
  };

  // ---------- Heat meter ----------
  // The meter shows how close the game is without saying what it's thinking.
  const HEAT = [
    [0.00, "Ice cold", "🧊"],
    [0.25, "Chilly", "🌬️"],
    [0.42, "Warmer", "🌤️"],
    [0.58, "Hot", "🔥"],
    [0.75, "On fire!", "🔥🔥"],
    [0.90, "I think I know!", "🤯"],
  ];
  function heatLabel(h) { return HEAT.filter(([min]) => h >= min).pop(); }

  function renderHeat() {
    const [, label, icon] = heatLabel(state.heat);
    // The track is a cold-to-hot gradient; a cover on the right shrinks as it heats up.
    $("heatCover").style.width = `${Math.round(96 - state.heat * 96)}%`;
    $("heatLabel").textContent = label;
    $("heatIcon").textContent = icon;
    $("heat").classList.toggle("blazing", state.heat >= 0.75);
  }

  // A host-style reaction to the last answer, based on how much the heat moved.
  function reaction(before, after, text) {
    if (!text) return pickOne(["No problem, let's keep going.", "That's okay, next one!", "Skipping is fine."]);
    const jump = after - before;
    if (after >= 0.9) return pickOne(["Okay, I'm pretty sure now…", "Don't say another word. Well, keep going.", "I can feel it!"]);
    if (jump > 0.12) return pickOne(["Ooh, now we're talking!", "That's a big clue!", "Oh! Interesting…", "That narrows it down a lot."]);
    if (jump > 0.03) return pickOne(["Getting warmer…", "Hmm, that helps.", "Okay, okay…", "I see where this is going."]);
    if (jump < -0.05) return pickOne(["Ooh, that surprises me!", "Interesting twist…", "Hmm, not what I expected."]);
    return pickOne(["Hmm… tell me more.", "That could be lots of jobs.", "Keep going…", "Tricky one!"]);
  }

  // ---------- Quiz ----------
  function show(id) {
    ["start", "quiz", "drumroll", "results"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderQuestion(say) {
    const q = state.asked[state.i];
    $("qCount").textContent = `Rung ${state.i + 1} of ${state.total}`;
    $("ladder").style.gridTemplateColumns = `repeat(${state.total}, 1fr)`;
    $("ladder").innerHTML = Array.from({ length: state.total }, (_, k) =>
      `<span class="${k < state.i ? "done" : k === state.i ? "now" : ""}"></span>`).join("");
    $("qText").textContent = q.q;
    $("backBtn").disabled = state.i === 0;
    $("nextBtn").textContent = state.i === state.total - 1 ? "Guess my job!" : "Next";
    const input = $("answer");
    input.value = state.texts[state.i] || "";
    input.placeholder = q.hint || "Type your answer here…";
    $("host").hidden = !say;
    if (say) {
      $("host").textContent = say;
      $("host").className = `host tone-${state.i % 6}`; // a new pastel colour each question
    }
    const card = $("qCard");
    card.classList.remove("pop");
    void card.offsetWidth; // restart the animation
    card.classList.add("pop");
    input.focus();
  }

  function nextQuestion() {
    const n = state.asked.length;
    if (n < state.fixed.length) return state.fixed[n];
    return Engine.pickFollowup(prepared, state.asked, state.readings.slice(0, n));
  }

  function submit() {
    const q = state.asked[state.i];
    const text = $("answer").value.trim();
    const changed = text !== (state.texts[state.i] || "");
    state.texts[state.i] = text;
    state.readings[state.i] = Engine.readFor(q, text);
    // A changed answer can change which follow-ups come next, so drop the
    // follow-ups after it. The first 12 questions stay, since they never change.
    if (changed) {
      const keep = Math.max(state.i + 1, state.fixed.length);
      state.asked.length = Math.min(state.asked.length, keep);
      state.texts.length = Math.min(state.texts.length, keep);
      state.readings.length = Math.min(state.readings.length, keep);
    }
    const before = state.heat;
    state.heat = Engine.closeness(Engine.scoreJobs(prepared, state.readings, null), state.readings);
    renderHeat();
    if (state.i >= state.total - 1) return finish();
    state.i += 1;
    if (!state.asked[state.i]) state.asked.push(nextQuestion());
    renderQuestion(reaction(before, state.heat, text));
  }

  // ---------- Clock ----------
  const RING = 2 * Math.PI * 34; // circumference of the clock ring (r = 34)

  function startClock() {
    clearInterval(state.timer);
    $("clock").hidden = !state.clockSecs;
    if (!state.clockSecs) return;
    state.deadline = Date.now() + state.clockSecs * 1000;
    tick();
    state.timer = setInterval(tick, 200);
  }

  function tick() {
    const msLeft = Math.max(0, state.deadline - Date.now());
    const left = Math.ceil(msLeft / 1000);
    $("clockText").textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    $("clockRing").style.strokeDashoffset = `${RING * (1 - msLeft / (state.clockSecs * 1000))}`;
    $("clock").classList.toggle("low", left <= 15);
    if (msLeft === 0) {
      // Time's up: keep whatever is typed in the box, then guess.
      const text = $("answer").value.trim();
      if (text) state.readings[state.i] = Engine.readFor(state.asked[state.i], text);
      state.timedOut = true;
      finish();
    }
  }

  // ---------- The big reveal ----------
  function finish() {
    clearInterval(state.timer);
    state.guesses = Engine.scoreJobs(prepared, state.readings, null);
    state.guessAt = 0;
    state.listLimit = PAGE;
    $("jobSearch").value = "";
    $("timeUp").hidden = !state.timedOut;
    renderResults();
    if (REDUCED) return show("results");
    show("drumroll");
    setTimeout(() => show("results"), 1800);
  }

  // The player's own words that pointed to this job.
  function cluesFor(job) {
    const { clues } = Engine.tally(state.readings);
    const words = [];
    job.topics.forEach(({ t }) => clues[t].forEach(w => { if (!words.includes(w)) words.push(w); }));
    job.hits.forEach(w => { if (!words.includes(w)) words.push(w); });
    return words.slice(0, 8);
  }

  function renderGuess(done) {
    const guess = state.guesses[state.guessAt];
    const why = cluesFor(guess);
    $("guessCount").textContent = done === "yes" ? "Nailed it!" : state.guessAt === 0 ? "My guess is…" : `Guess ${state.guessAt + 1}: is it…`;
    $("guessName").textContent = guess.name;
    $("guessDesc").textContent = describe(guess);
    $("guessWhy").innerHTML = why.length ? `What gave it away: <strong>${esc(why.join(", "))}</strong>` : "";
    $("guessAsk").hidden = !!done;
    $("guessDone").hidden = !done;
    const card = $("reveal");
    card.classList.remove("flip");
    void card.offsetWidth;
    card.classList.add("flip");
    if (done === "yes") {
      const n = state.guessAt + 1;
      $("guessDone").textContent = n === 1 ? "First try! Thanks for playing." : `Got it in ${n} guesses!`;
      confetti();
    } else if (done === "stumped") {
      $("guessCount").textContent = "You win!";
      $("guessDone").textContent = "You stumped me. Find your job in the list below so I know for next time.";
    }
  }

  function renderResults() {
    renderGuess();
    $("topJobs").innerHTML = state.guesses.slice(0, 8).map((j, idx) => `
      <li><span class="tj-rank">${idx + 1}</span><span class="tj-name">${esc(j.name)}</span><span class="tj-pct">${j.pct}%</span></li>`).join("");
    renderAllJobs();
  }

  // Imported titles have no description, so say which job they're like instead.
  function describe(job) {
    if (job.desc) return job.desc;
    return job.similar ? `A job a lot like ${job.similar}` : "From the big list of job titles";
  }

  function trainingText(job) {
    return job.train === 0 ? "Often no degree needed" : `About ${job.train} year${job.train === 1 ? "" : "s"} of training`;
  }

  function renderAllJobs() {
    const all = state.guesses;
    const q = $("jobSearch").value.trim().toLowerCase();
    const list = all.filter(j => !q || (j.name + " " + j.desc).toLowerCase().includes(q));
    const shown = list.slice(0, state.listLimit);
    $("jobCount").textContent = `${list.length} of ${all.length} jobs, best guess first`;
    $("moreJobs").hidden = shown.length >= list.length;
    $("moreJobs").textContent = `Show more jobs (${list.length - shown.length} left)`;
    $("allJobs").innerHTML = shown.map(j => `<li>
        <span class="jl-name">${esc(j.name)}</span>
        <span class="jl-pct">${j.pct}%</span>
        <span class="jl-desc">${esc(describe(j))} · ${trainingText(j)}</span>
      </li>`).join("") || `<li class="muted">No jobs match that search. Try a different word.</li>`;
  }

  // ---------- Confetti ----------
  function confetti() {
    if (REDUCED) return;
    const canvas = $("confetti");
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const colors = ["#FF4D4D", "#FF9F1C", "#FFC800", "#22B573", "#3A7BFF", "#8C52FF"];
    const bits = Array.from({ length: 90 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3, y: h * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      r: Math.random() * 6 + 4, spin: Math.random() * 6, c: pickOne(colors),
    }));
    canvas.hidden = false;
    let frame = 0;
    (function draw() {
      ctx.clearRect(0, 0, w, h);
      bits.forEach(b => {
        b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.spin += 0.2;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.spin);
        ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2);
        ctx.restore();
      });
      if (++frame < 120) requestAnimationFrame(draw);
      else { ctx.clearRect(0, 0, w, h); canvas.hidden = true; }
    })();
  }

  // ---------- Events ----------
  $("startBtn").addEventListener("click", () => {
    state.asked = [];
    state.texts = [];
    state.readings = [];
    state.i = 0;
    state.heat = 0;
    state.timedOut = false;
    state.total = Number($("numQ").value);
    state.fixed = Engine.planFixed(state.total);
    // The timed challenge gives about 9 seconds a question.
    state.clockSecs = $("timed").checked ? state.total * 9 : 0;
    renderHeat();
    show("quiz");
    state.asked.push(state.fixed[0]);
    renderQuestion("Welcome! Take your time. First question…");
    startClock();
  });
  $("answerForm").addEventListener("submit", e => { e.preventDefault(); submit(); });
  $("answer").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  });
  $("skipBtn").addEventListener("click", () => { $("answer").value = ""; submit(); });
  $("backBtn").addEventListener("click", () => {
    if (state.i > 0) { state.i -= 1; renderQuestion(); }
  });
  $("yesBtn").addEventListener("click", () => renderGuess("yes"));
  $("noBtn").addEventListener("click", () => {
    if (state.guessAt >= MAX_GUESSES - 1) return renderGuess("stumped");
    state.guessAt += 1;
    renderGuess();
  });
  $("jobSearch").addEventListener("input", () => { state.listLimit = PAGE; renderAllJobs(); });
  $("moreJobs").addEventListener("click", () => { state.listLimit += PAGE; renderAllJobs(); });
  $("retakeBtn").addEventListener("click", () => show("start"));

  // Question-count slider: 5 to 35 questions, with an accuracy meter.
  function renderLength() {
    const n = Number($("numQ").value);
    const acc = accuracyFor(n);
    $("numQOut").textContent = n;
    // The bar climbs steadily from nearly empty at 5 questions to full at 35: half
    // from the measured accuracy, half from how thorough the game is. The sentence
    // below gives the actual estimate.
    const lo = ACCURACY[5], hi = ACCURACY[35];
    const fill = 0.5 * (acc - lo) / (hi - lo) + 0.5 * (n - 5) / 30;
    $("accFill").style.width = `${Math.round(8 + 92 * fill)}%`;
    $("accText").textContent = `${n} questions: right on the first guess in about ${Math.round(acc * 100)}% of games` +
      (n <= 8 ? ". Quick, but it's a long shot!" : n >= 30 ? ". Thorough, but it takes a while." : ".");
    $("timedLabel").textContent = `Timed challenge (${Math.floor(n * 9 / 60)}:${String(n * 9 % 60).padStart(2, "0")})`;
  }
  $("numQ").addEventListener("input", renderLength);
  renderLength();

  $("jobTotal").textContent = prepared.list.length.toLocaleString("en-US");
})();
