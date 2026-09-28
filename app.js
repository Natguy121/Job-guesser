// Future Map — page logic for the job guessing game
(function () {
  const THIS_YEAR = new Date().getFullYear();
  const TOPIC_KEYS = Engine.TOPIC_KEYS;
  const PAGE = 20;
  const prepared = Engine.prepareJobs(JOBS);

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
  const OUTLOOK = {
    g: { label: "Growing",    cls: "pill-g" },
    s: { label: "Steady",     cls: "pill-s" },
    c: { label: "Changing",   cls: "pill-c" },
    f: { label: "Future job", cls: "pill-f" },
  };

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
  };

  const state = {
    age: clampAge(store.get("futureMap.age", 10)),
    viewAge: 10,
    asked: [],     // questions shown so far, in order
    texts: [],     // what the kid typed for each
    readings: [],  // Engine.readAnswer result for each
    i: 0,
    listLimit: PAGE,
  };

  function clampAge(a) { a = Number(a); return Number.isFinite(a) ? Math.min(18, Math.max(5, Math.round(a))) : 10; }

  // ---------- Age ----------
  function ageStage(age) {
    if (age <= 7)  return { pct: 90, label: "Very likely to change",
      text: `At ${age}, your favourite things can change lots of times, and that's great. Try many different activities and play again next year.` };
    if (age <= 10) return { pct: 75, label: "Likely to change",
      text: `At ${age}, your interests are starting to show, but they will keep growing. Notice which topics you keep coming back to.` };
    if (age <= 13) return { pct: 55, label: "Could change",
      text: `At ${age}, you're finding out what you're really good at. Some of these topics will stick with you and some will change.` };
    if (age <= 16) return { pct: 35, label: "Getting clearer",
      text: `At ${age}, your interests are getting clearer. It's a good time to choose classes and clubs that match your top topics.` };
    return { pct: 20, label: "Pretty focused",
      text: `At ${age}, you're close to choosing what comes after school. Check how many years of training the jobs you like need.` };
  }

  function futureNote(age) {
    const yrs = 18 - age;
    if (yrs <= 0) return "You could start working or training right now. Jobs marked Changing are already using new tools like AI, so learning those tools helps.";
    return `You'll finish school around ${THIS_YEAR + yrs}. That's ${yrs} year${yrs === 1 ? "" : "s"} away, and the world of work will change a lot by then. ` +
      "Jobs marked Future job barely exist today but could be big when you grow up. Jobs marked Changing will still exist, but robots and AI may do parts of them.";
  }

  function ageBand(age) { return age <= 8 ? 0 : age <= 12 ? 1 : 2; }

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
  // The first 15 are the same for everyone. After that, each question is a
  // follow-up about one of the top 4 topics found so far, spreading the
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

  // ---------- Start screen ----------
  function renderAge() {
    $("ageOut").textContent = state.age;
    $("age").value = state.age;
    $("barAge").textContent = `Age ${state.age}`;
    const yrs = 18 - state.age;
    $("ageNote").textContent = (yrs > 0 ? `You'll be 18 in ${THIS_YEAR + yrs}. ` : "") +
      "Your age changes the guess: younger kids see more future jobs and more room for change, and older kids get next steps for school.";
  }

  function renderTopicChips() {
    $("topicChips").innerHTML = TOPIC_KEYS.map(t => `<li class="chip" style="${tc(t)}">${topicLabel(t)}</li>`).join("");
  }

  // ---------- Quiz ----------
  function show(id) {
    ["start", "quiz", "results"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderQuestion(feedback) {
    const q = state.asked[state.i];
    $("qCount").textContent = `Question ${state.i + 1} of ${TOTAL_QUESTIONS}`;
    $("qFill").style.width = `${(state.i / TOTAL_QUESTIONS) * 100}%`;
    $("qText").textContent = q.q;
    $("qBecause").hidden = !q.for;
    if (q.for) $("qBecause").innerHTML = `Because you wrote about <strong>${topicLabel(q.for)}</strong>`;
    $("youngTip").hidden = state.age > 8;
    $("backBtn").disabled = state.i === 0;
    $("nextBtn").textContent = state.i === TOTAL_QUESTIONS - 1 ? "Make my guess" : "Next";
    const input = $("answer");
    input.value = state.texts[state.i] || "";
    input.placeholder = q.hint || "Type your answer here…";
    $("clueBox").hidden = !feedback;
    if (feedback) $("clueBox").innerHTML = feedback;
    input.focus();
  }

  function feedbackFor(reading, text) {
    if (!text) return `<span class="muted">Skipped. That's okay!</span>`;
    const found = Object.entries(reading.clues).filter(([t]) => reading.topics[t] > 0);
    if (!found.length) return `<span class="muted">I didn't spot any clues in that one. Try adding a few more words next time!</span>`;
    return "Clues from your last answer: " + found.map(([t, words]) =>
      `<span class="clue" style="${tc(t)}">${topicLabel(t)} <em>${esc([...new Set(words)].slice(0, 3).join(", "))}</em></span>`).join(" ");
  }

  function submit() {
    const q = state.asked[state.i];
    const text = $("answer").value.trim();
    const changed = text !== (state.texts[state.i] || "");
    state.texts[state.i] = text;
    state.readings[state.i] = Engine.readAnswer(text, q.q, q.named ?? (q.for ? 0.6 : 0.25));
    // A changed answer can change which follow-ups come next, so drop the
    // follow-ups after it. The first 15 questions stay, since they never change.
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
  }

  function finish() {
    state.viewAge = state.age;
    state.listLimit = PAGE;
    const { s, last } = Engine.tally(state.readings);
    const top = rankTopics(s, last).filter(r => r.s > 0).slice(0, 3).map(r => r.t);
    const jobs = Engine.scoreJobs(prepared, state.readings, state.age).slice(0, 3).map(j => j.name);
    const history = store.get("futureMap.history", []);
    history.push({ date: new Date().toISOString().slice(0, 10), age: state.age, top, jobs });
    store.set("futureMap.history", history.slice(-12));
    renderResults();
    show("results");
  }

  // ---------- Results ----------
  function startInfo(job, age) {
    const yearsAway = Engine.startYears(job, age);
    return { startAge: Math.max(18 + job.train, age), yearsAway, year: THIS_YEAR + yearsAway };
  }

  function whenText(job, age) {
    const s = startInfo(job, age);
    const training = job.train === 0 ? "No extra school needed after 18" : `About ${job.train} year${job.train === 1 ? "" : "s"} of training after school`;
    const start = s.yearsAway === 0 ? "You could start now" : `Start around age ${s.startAge} (${s.year})`;
    return { start, training };
  }

  function outlookNote(job, age) {
    const s = startInfo(job, age);
    if (job.outlook === "f") return `This job is still new. It could be much bigger by ${s.year}.`;
    if (job.outlook === "c") return s.yearsAway > 0
      ? `By ${s.year}, robots and AI may do parts of this job, so it will look different.`
      : "Robots and AI are already changing parts of this job.";
    if (job.outlook === "g") return "More people are expected to be needed for this job.";
    return "";
  }

  // The words from the kid's answers that led to this job.
  function cluesFor(job, clues) {
    const words = [];
    job.topics.forEach(({ t }) => clues[t].forEach(w => { if (!words.includes(w)) words.push(w); }));
    job.hits.forEach(w => { if (!words.includes(w)) words.push(w); });
    return words.slice(0, 8);
  }

  function renderResults() {
    const age = state.viewAge;
    const { s, last, clues } = Engine.tally(state.readings);
    const ranked = rankTopics(s, last);
    const levelOf = Object.fromEntries(ranked.map(r => [r.t, r.level]));
    const topScore = Math.max(1, ranked[0].s);
    const all = Engine.scoreJobs(prepared, state.readings, age);
    const totalClues = ranked.reduce((sum, r) => sum + r.s, 0);

    // The big guess
    const guess = all[0];
    const why = cluesFor(guess, clues);
    $("guessName").textContent = guess.name;
    $("guessDesc").textContent = guess.desc;
    $("guessWhy").innerHTML = guess.mentioned
      ? `You told me you want to be this, and your answers fit it too.${why.length ? ` Clues: <strong>${esc(why.join(", "))}</strong>` : ""}`
      : why.length ? `Clues from your answers: <strong>${esc(why.join(", "))}</strong>` : "";
    $("fewClues").hidden = totalClues >= 4;

    $("resAge").value = age;
    $("resAgeOut").textContent = age;
    const st = ageStage(age);
    $("changeLabel").textContent = st.label;
    $("changeFill").style.width = st.pct + "%";
    $("changeText").textContent = st.text;
    $("futureText").textContent = futureNote(age);

    // Topics with importance levels
    $("topicRank").innerHTML = ranked.map(r => `
      <li class="topic-row${r.level === "top" ? " top" : ""}" style="${tc(r.t)}">
        <span class="rank">${r.rank}</span>
        <span class="name">${topicLabel(r.t)} <span class="pts">${r.s} point${r.s === 1 ? "" : "s"}</span></span>
        <span class="lvl ${LEVELS[r.level].cls}">${LEVELS[r.level].label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(r.s / topScore) * 100}%"></div></div>
        ${clues[r.t].length ? `<span class="topic-clues">${esc(clues[r.t].slice(0, 6).join(", "))}</span>` : ""}
      </li>`).join("");

    // Other close guesses. Younger kids see a couple more ideas since things will change.
    const count = age <= 10 ? 10 : 8;
    $("topJobs").innerHTML = all.slice(1, count + 1).map(j => jobCard(j, age, levelOf)).join("");

    // Tips for top 3 topics, tuned to age
    const band = ageBand(age);
    const bandName = ["ages 5–8", "ages 9–12", "ages 13–18"][band];
    $("tips").innerHTML = ranked.slice(0, 3).map(r => `
      <div class="tip" style="${tc(r.t)}">
        <strong>${topicLabel(r.t)}</strong>
        <span>${esc(TIPS[r.t][band])}</span>
        <span class="muted small">Idea for ${bandName}</span>
      </div>`).join("");

    renderHistory();
    fillTopicFilter();
    renderAllJobs(all);
  }

  function jobCard(j, age, levelOf) {
    const w = whenText(j, age);
    const o = OUTLOOK[j.outlook];
    const note = outlookNote(j, age);
    const needs = j.topics.map(({ t, w: weight }) => {
      const strong = levelOf[t] === "top" || levelOf[t] === "high";
      return `<li><span class="imp">${IMPORTANCE[weight]}</span>
        <span${strong ? ' class="yes"' : ""}>${topicLabel(t)}${strong ? " ✓" : ""}</span></li>`;
    }).join("");
    return `
      <article class="job-card">
        <div class="job-head">
          <h3>${esc(j.name)}</h3>
          <span class="match">${j.pct}%<small>match</small></span>
        </div>
        <p class="job-desc">${esc(j.desc)}</p>
        <ul class="need">${needs}</ul>
        <div class="job-foot">
          <span class="pill ${o.cls}">${o.label}</span>
          <span class="when">${w.start}</span>
          <span class="muted">${w.training}</span>
        </div>
        ${note ? `<p class="outlook-note">${esc(note)}</p>` : ""}
      </article>`;
  }

  function renderHistory() {
    const history = store.get("futureMap.history", []);
    $("historyBox").hidden = history.length < 2;
    if (history.length < 2) return;
    $("historyBody").innerHTML = history.slice().reverse().map((h, idx) => `
      <tr${idx === 0 ? ' class="now"' : ""}>
        <td>${esc(h.date)}${idx === 0 ? " (now)" : ""}</td>
        <td>${esc(h.age)}</td>
        <td>${(h.top || []).map(t => TOPICS[t] ? topicLabel(t) : "").join("<br>")}</td>
        <td>${(h.jobs || []).map(esc).join("<br>")}</td>
      </tr>`).join("");
  }

  function fillTopicFilter() {
    const sel = $("jobTopic");
    if (sel.options.length) return;
    sel.innerHTML = `<option value="">All topics</option>` +
      TOPIC_KEYS.map(t => `<option value="${t}">${topicLabel(t)}</option>`).join("") +
      `<option value="future">✨ Future jobs only</option>`;
  }

  function renderAllJobs(all = Engine.scoreJobs(prepared, state.readings, state.viewAge)) {
    const q = $("jobSearch").value.trim().toLowerCase();
    const topic = $("jobTopic").value;
    const age = state.viewAge;
    const list = all.filter(j => {
      if (topic === "future" && j.outlook !== "f") return false;
      if (topic && topic !== "future" && !j.topics.some(x => x.t === topic)) return false;
      if (q && !(j.name + " " + j.desc).toLowerCase().includes(q)) return false;
      return true;
    });
    const shown = list.slice(0, state.listLimit);
    $("jobCount").textContent = `${list.length} of ${all.length} jobs match, best guess first`;
    $("moreJobs").hidden = shown.length >= list.length;
    $("moreJobs").textContent = `Show more jobs (${list.length - shown.length} left)`;
    $("allJobs").innerHTML = shown.map(j => {
      const w = whenText(j, age);
      const o = OUTLOOK[j.outlook];
      return `<li>
        <span class="jl-name">${esc(j.name)}</span>
        <span class="jl-pct">${j.pct}%</span>
        <span class="jl-desc">${esc(j.desc)}</span>
        <span class="jl-meta">
          <span class="pill ${o.cls}">${o.label}</span>
          <span>${w.start}</span>
          <span class="mini-topic">${j.topics.map(x => TOPICS[x.t].icon).join(" ")}</span>
        </span>
      </li>`;
    }).join("") || `<li class="muted">No jobs match that search. Try a different word or topic.</li>`;
  }

  // ---------- Events ----------
  $("age").addEventListener("input", e => {
    state.age = clampAge(e.target.value);
    store.set("futureMap.age", state.age);
    renderAge();
  });
  $("startBtn").addEventListener("click", () => {
    state.asked = [QUESTIONS[0]];
    state.texts = [];
    state.readings = [];
    state.i = 0;
    show("quiz");
    renderQuestion();
  });
  $("answerForm").addEventListener("submit", e => { e.preventDefault(); submit(); });
  $("answer").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  });
  $("skipBtn").addEventListener("click", () => { $("answer").value = ""; submit(); });
  $("backBtn").addEventListener("click", () => {
    if (state.i > 0) { state.i -= 1; renderQuestion(); }
  });
  $("resAge").addEventListener("input", e => {
    state.viewAge = clampAge(e.target.value);
    renderResults();
  });
  const resetList = () => { state.listLimit = PAGE; renderAllJobs(); };
  $("jobSearch").addEventListener("input", resetList);
  $("jobTopic").addEventListener("change", resetList);
  $("moreJobs").addEventListener("click", () => { state.listLimit += PAGE; renderAllJobs(); });
  $("retakeBtn").addEventListener("click", () => { renderAge(); show("start"); });
  $("clearHistory").addEventListener("click", () => {
    const h = store.get("futureMap.history", []);
    store.set("futureMap.history", h.slice(-1));
    renderHistory();
  });

  renderAge();
  renderTopicChips();
  $("jobTotal").textContent = JOBS.length;
})();
