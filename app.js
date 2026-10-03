// Future Map — page logic for the "guess my job" game
(function () {
  const TOPIC_KEYS = Engine.TOPIC_KEYS;
  const PAGE = 20;
  const MAX_GUESSES = 10;
  // Future jobs barely exist yet, so nobody has them today. Leave them out of guessing.
  const prepared = Engine.prepareJobs(JOBS.filter(j => j[4] !== "f"));

  // Spread topic colors around the color wheel; lightness comes from the theme.
  TOPIC_KEYS.forEach((t, i) => { TOPICS[t].hue = Math.round(i * (360 / TOPIC_KEYS.length)); });
  const tc = t => `--tc: hsl(${TOPICS[t].hue} 62% var(--tl))`;
  const topicLabel = t => `${TOPICS[t].icon} ${esc(TOPICS[t].name)}`;

  const IMPORTANCE = { 3: "Comes first", 2: "Important", 1: "Helps too" };
  const LEVELS = {
    top:  { label: "Top priority", cls: "lvl-top" },
    high: { label: "High",         cls: "lvl-high" },
    med:  { label: "Medium",       cls: "lvl-med" },
    low:  { label: "Low",          cls: "lvl-low" },
  };

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const state = {
    asked: [],     // questions shown so far, in order
    texts: [],     // what the player typed for each
    readings: [],  // Engine.readFor result for each
    i: 0,
    guesses: [],   // jobs ranked best first
    guessAt: 0,    // which guess is showing
    clockSecs: 0,  // 0 = no clock
    deadline: 0,   // when the clock runs out (ms)
    timer: null,
    timedOut: false,
    listLimit: PAGE,
  };

  // Rank topics and give each an importance level. Ties go to the topic mentioned most recently.
  function rankTopics(scores, last) {
    const list = TOPIC_KEYS.map(t => ({ t, s: scores[t] })).sort((a, b) => b.s - a.s || last[b.t] - last[a.t]);
    list.forEach((item, idx) => {
      item.rank = idx > 0 && item.s === list[idx - 1].s ? list[idx - 1].rank : idx + 1;
      item.level = item.s === 0 ? "low" : item.rank <= 3 ? "top" : item.rank <= 6 ? "high" : item.rank <= 12 ? "med" : "low";
    });
    return list;
  }

  // ---------- Picking questions ----------
  // The first 12 are the same for everyone. After that, each question is a
  // follow-up about one of the top 4 areas found so far, spreading the
  // follow-ups between them so no single early answer takes over.
  function nextQuestion() {
    const n = state.asked.length;
    if (n < QUESTIONS.length) return QUESTIONS[n];
    const used = new Set(state.asked);
    const left = FOLLOWUPS.filter(f => !used.has(f));
    const { s, last } = Engine.tally(state.readings.slice(0, n));
    const lastFor = state.asked[n - 1].for;
    const asked = t => state.asked.filter(q => q.for === t).length;
    const top = rankTopics(s, last).filter(r => r.s > 0).slice(0, 4).map(r => r.t);
    const options = top.filter(t => t !== lastFor && left.some(f => f.for === t));
    const pool = options.length ? options : top.filter(t => left.some(f => f.for === t));
    if (pool.length) {
      const t = pool.reduce((a, b) => (asked(b) < asked(a) ? b : a));
      return left.find(f => f.for === t);
    }
    return left[Math.floor(Math.random() * left.length)];
  }

  // ---------- Quiz ----------
  function show(id) {
    ["start", "quiz", "results"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderQuestion(feedback) {
    const q = state.asked[state.i];
    $("qCount").textContent = `Rung ${state.i + 1} of ${TOTAL_QUESTIONS}`;
    $("ladder").innerHTML = Array.from({ length: TOTAL_QUESTIONS }, (_, k) =>
      `<span class="${k < state.i ? "done" : k === state.i ? "now" : ""}"></span>`).join("");
    $("qText").textContent = q.q;
    $("qBecause").hidden = !q.for;
    if (q.for) $("qBecause").innerHTML = `Because you wrote about <strong>${topicLabel(q.for)}</strong>`;
    $("backBtn").disabled = state.i === 0;
    $("nextBtn").textContent = state.i === TOTAL_QUESTIONS - 1 ? "Guess my job" : "Next";
    const input = $("answer");
    input.value = state.texts[state.i] || "";
    input.placeholder = q.hint || "Type your answer here…";
    $("clueBox").hidden = !feedback;
    if (feedback) $("clueBox").innerHTML = feedback;
    input.focus();
  }

  function feedbackFor(reading, text) {
    if (!text) return `<span class="muted">Skipped.</span>`;
    const found = Object.entries(reading.clues).filter(([t]) => reading.topics[t] > 0);
    if (!found.length) return `<span class="muted">I didn't spot any clues in that one. A few more words help!</span>`;
    return "Clues from your last answer: " + found.map(([t, words]) =>
      `<span class="clue" style="${tc(t)}">${topicLabel(t)} <em>${esc([...new Set(words)].slice(0, 3).join(", "))}</em></span>`).join(" ");
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
      const keep = Math.max(state.i + 1, QUESTIONS.length);
      state.asked.length = Math.min(state.asked.length, keep);
      state.texts.length = Math.min(state.texts.length, keep);
      state.readings.length = Math.min(state.readings.length, keep);
    }
    const feedback = feedbackFor(state.readings[state.i], text);
    if (state.i >= TOTAL_QUESTIONS - 1) return finish();
    state.i += 1;
    if (!state.asked[state.i]) state.asked.push(nextQuestion());
    renderQuestion(feedback);
    renderHunch();
  }

  // Think out loud: show the current best guess once there are a few clues.
  function renderHunch() {
    const { s } = Engine.tally(state.readings);
    const clues = Object.values(s).reduce((x, y) => x + y, 0);
    const box = $("hunch");
    if (clues < 2) { box.hidden = true; return; }
    const [first, second] = Engine.scoreJobs(prepared, state.readings, null);
    const sure = first.score - second.score > 0.08;
    box.hidden = false;
    box.innerHTML = sure
      ? `My hunch: <strong>${esc(first.name)}</strong>. Am I close?`
      : `Hmm… <strong>${esc(first.name)}</strong> or <strong>${esc(second.name)}</strong>?`;
  }

  // ---------- Clock ----------
  function startClock() {
    clearInterval(state.timer);
    $("clock").hidden = !state.clockSecs;
    if (!state.clockSecs) return;
    state.deadline = Date.now() + state.clockSecs * 1000;
    tick();
    state.timer = setInterval(tick, 250);
  }

  function tick() {
    const left = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
    $("clock").textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    $("clock").classList.toggle("low", left <= 15);
    if (left === 0) {
      // Time's up: keep whatever is typed in the box, then guess.
      const text = $("answer").value.trim();
      if (text) state.readings[state.i] = Engine.readFor(state.asked[state.i], text);
      state.timedOut = true;
      finish();
    }
  }

  function finish() {
    clearInterval(state.timer);
    state.guesses = Engine.scoreJobs(prepared, state.readings, null);
    state.guessAt = 0;
    state.listLimit = PAGE;
    $("jobSearch").value = "";
    renderResults();
    $("timeUp").hidden = !state.timedOut;
    show("results");
  }

  // ---------- Results ----------
  // The words from the player's answers that led to this job.
  function cluesFor(job, clues) {
    const words = [];
    job.topics.forEach(({ t }) => clues[t].forEach(w => { if (!words.includes(w)) words.push(w); }));
    job.hits.forEach(w => { if (!words.includes(w)) words.push(w); });
    return words.slice(0, 8);
  }

  function renderGuess(done) {
    const { clues, s } = Engine.tally(state.readings);
    const guess = state.guesses[state.guessAt];
    const why = cluesFor(guess, clues);
    $("guessCount").textContent = done === "yes" ? "Got it!" : `Guess ${state.guessAt + 1}: is your job…`;
    $("guessName").textContent = guess.name;
    $("guessDesc").textContent = guess.desc;
    $("guessWhy").innerHTML = why.length ? `Clues from your answers: <strong>${esc(why.join(", "))}</strong>` : "";
    $("fewClues").hidden = Object.values(s).reduce((a, b) => a + b, 0) >= 4 || !!done;
    $("guessAsk").hidden = !!done;
    $("guessDone").hidden = !done;
    if (done === "yes") {
      const n = state.guessAt + 1;
      $("guessDone").textContent = n === 1 ? "I got it on my first guess!" : `I got it in ${n} guesses!`;
    } else if (done === "stumped") {
      $("guessCount").textContent = `Guess ${MAX_GUESSES}`;
      $("guessDone").textContent = `You stumped me! Find your job in the list below.`;
    }
  }

  function renderResults() {
    const { s, last, clues } = Engine.tally(state.readings);
    const ranked = rankTopics(s, last);
    const levelOf = Object.fromEntries(ranked.map(r => [r.t, r.level]));
    const topScore = Math.max(1, ranked[0].s);

    renderGuess();

    $("topJobs").innerHTML = state.guesses.slice(0, 8).map((j, idx) => jobCard(j, idx, levelOf)).join("");

    $("topicRank").innerHTML = ranked.filter(r => r.s > 0).map(r => `
      <li class="topic-row${r.level === "top" ? " top" : ""}" style="${tc(r.t)}">
        <span class="rank">${r.rank}</span>
        <span class="name">${topicLabel(r.t)} <span class="pts">${r.s} point${r.s === 1 ? "" : "s"}</span></span>
        <span class="lvl ${LEVELS[r.level].cls}">${LEVELS[r.level].label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(r.s / topScore) * 100}%"></div></div>
        ${clues[r.t].length ? `<span class="topic-clues">${esc(clues[r.t].slice(0, 6).join(", "))}</span>` : ""}
      </li>`).join("") || `<li class="muted">I didn't find any clues this time.</li>`;

    fillTopicFilter();
    renderAllJobs();
  }

  function trainingText(job) {
    return job.train === 0 ? "Often no degree needed" : `Usually about ${job.train} year${job.train === 1 ? "" : "s"} of training after school`;
  }

  function jobCard(j, idx, levelOf) {
    const needs = j.topics.map(({ t, w: weight }) => {
      const strong = levelOf[t] === "top" || levelOf[t] === "high";
      return `<li><span class="imp">${IMPORTANCE[weight]}</span>
        <span${strong ? ' class="yes"' : ""}>${topicLabel(t)}${strong ? " ✓" : ""}</span></li>`;
    }).join("");
    return `
      <article class="job-card${idx === 0 ? " best" : ""}">
        <div class="job-head">
          <h3>${idx + 1}. ${esc(j.name)}</h3>
          <span class="match">${j.pct}%<small>match</small></span>
        </div>
        <p class="job-desc">${esc(j.desc)}</p>
        <ul class="need">${needs}</ul>
        <div class="job-foot"><span class="muted">${trainingText(j)}</span></div>
      </article>`;
  }

  function fillTopicFilter() {
    const sel = $("jobTopic");
    if (sel.options.length) return;
    sel.innerHTML = `<option value="">All areas</option>` +
      TOPIC_KEYS.map(t => `<option value="${t}">${topicLabel(t)}</option>`).join("");
  }

  function renderAllJobs() {
    const all = state.guesses;
    const q = $("jobSearch").value.trim().toLowerCase();
    const topic = $("jobTopic").value;
    const list = all.filter(j => {
      if (topic && !j.topics.some(x => x.t === topic)) return false;
      if (q && !(j.name + " " + j.desc).toLowerCase().includes(q)) return false;
      return true;
    });
    const shown = list.slice(0, state.listLimit);
    $("jobCount").textContent = `${list.length} of ${all.length} jobs, best guess first`;
    $("moreJobs").hidden = shown.length >= list.length;
    $("moreJobs").textContent = `Show more jobs (${list.length - shown.length} left)`;
    $("allJobs").innerHTML = shown.map(j => `<li>
        <span class="jl-name">${esc(j.name)}</span>
        <span class="jl-pct">${j.pct}%</span>
        <span class="jl-desc">${esc(j.desc)}</span>
        <span class="jl-meta"><span class="mini-topic">${j.topics.map(x => TOPICS[x.t].icon).join(" ")}</span></span>
      </li>`).join("") || `<li class="muted">No jobs match that search. Try a different word or area.</li>`;
  }

  // ---------- Events ----------
  $("startBtn").addEventListener("click", () => {
    state.asked = [QUESTIONS[0]];
    state.texts = [];
    state.readings = [];
    state.i = 0;
    state.timedOut = false;
    state.clockSecs = Number(document.querySelector('input[name="clock"]:checked').value);
    $("hunch").hidden = true;
    show("quiz");
    renderQuestion();
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
  const resetList = () => { state.listLimit = PAGE; renderAllJobs(); };
  $("jobSearch").addEventListener("input", resetList);
  $("jobTopic").addEventListener("change", resetList);
  $("moreJobs").addEventListener("click", () => { state.listLimit += PAGE; renderAllJobs(); });
  $("retakeBtn").addEventListener("click", () => show("start"));

  $("topicChips").innerHTML = TOPIC_KEYS.map(t => `<li class="chip" style="${tc(t)}">${topicLabel(t)}</li>`).join("");
  $("jobTotal").textContent = prepared.list.length;
})();
