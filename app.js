// Future Map — survey logic
(function () {
  const THIS_YEAR = new Date().getFullYear();
  const MAX_PER_TOPIC = 8;
  const TOPIC_KEYS = Object.keys(TOPICS);

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

  // Turn "sci3 nat2 wrd1" into [{t:"sci", w:3}, ...], most important first.
  const jobs = JOBS.map(([name, desc, tags, train, outlook]) => ({
    name, desc, train, outlook,
    topics: tags.split(" ").map(s => ({ t: s.slice(0, 3), w: Number(s.slice(3)) }))
                .sort((a, b) => b.w - a.w),
  }));

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
    answers: new Array(QUESTIONS.length).fill(null),
    i: 0,
    locked: false,
    listLimit: 20,
  };
  const PAGE = 20;

  function clampAge(a) { a = Number(a); return Number.isFinite(a) ? Math.min(18, Math.max(5, Math.round(a))) : 10; }

  // ---------- Age ----------
  function ageStage(age) {
    if (age <= 7)  return { pct: 90, label: "Very likely to change",
      text: `At ${age}, your favourite things can change lots of times, and that's great. Try many different activities and take this survey again next year.` };
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

  // ---------- Scoring ----------
  function topicScores() {
    const s = Object.fromEntries(TOPIC_KEYS.map(k => [k, 0]));
    state.answers.forEach((pick, qi) => { if (pick != null) s[QUESTIONS[qi].a[pick][2]] += 1; });
    return s;
  }

  // Rank topics (ties share a rank) and give each an importance level.
  function rankTopics(scores) {
    const list = TOPIC_KEYS.map(t => ({ t, s: scores[t] })).sort((a, b) => b.s - a.s);
    list.forEach((item, idx) => {
      item.rank = idx > 0 && item.s === list[idx - 1].s ? list[idx - 1].rank : idx + 1;
      item.level = item.s === 0 ? "low" : item.rank <= 2 ? "top" : item.rank <= 4 ? "high" : item.rank <= 7 ? "med" : "low";
    });
    return list;
  }

  function startInfo(job, age) {
    const startAge = 18 + job.train;
    const yearsAway = Math.max(0, startAge - age);
    return { startAge: Math.max(startAge, age), yearsAway, year: THIS_YEAR + yearsAway };
  }

  // Match = how well your topic points line up with what the job needs,
  // adjusted by how far away the job is (future jobs rise, changing jobs dip for young kids).
  // 100% means every topic the job needs is as high as your best topic.
  function matchJob(job, scores, age) {
    const best = Math.max(1, ...Object.values(scores));
    let got = 0, max = 0;
    job.topics.forEach(({ t, w }) => { got += w * scores[t]; max += w * best; });
    const base = max ? got / max : 0;
    const yrs = Math.min(15, startInfo(job, age).yearsAway);
    const mod = { f: 1 + 0.012 * yrs, g: 1 + 0.004 * yrs, s: 1, c: 1 - 0.008 * yrs }[job.outlook];
    return Math.min(100, Math.round(base * mod * 100));
  }

  // ---------- Start screen ----------
  function renderAge() {
    $("ageOut").textContent = state.age;
    $("age").value = state.age;
    $("barAge").textContent = `Age ${state.age}`;
    const yrs = 18 - state.age;
    $("ageNote").textContent = (yrs > 0 ? `You'll be 18 in ${THIS_YEAR + yrs}. ` : "") +
      `Your age changes your results: younger kids see more future jobs and more room for change, and older kids get next steps for school.`;
  }

  function renderTopicChips() {
    $("topicChips").innerHTML = TOPIC_KEYS.map(t =>
      `<li class="chip" style="--tc: var(--t-${t})">${TOPICS[t].icon} ${esc(TOPICS[t].name)}</li>`).join("");
  }

  // ---------- Quiz ----------
  function show(id) {
    ["start", "quiz", "results"].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderQuestion() {
    const q = QUESTIONS[state.i];
    const n = QUESTIONS.length;
    $("qCount").textContent = `Question ${state.i + 1} of ${n}`;
    $("qFill").style.width = `${(state.i / n) * 100}%`;
    $("qText").textContent = q.q;
    $("youngTip").hidden = state.age > 8;
    $("backBtn").disabled = state.i === 0;
    $("answers").innerHTML = q.a.map(([emo, text], k) =>
      `<button type="button" class="answer${state.answers[state.i] === k ? " picked" : ""}" data-k="${k}">
         <span class="emo" aria-hidden="true">${emo}</span><span>${esc(text)}</span><span class="num" aria-hidden="true">${k + 1}</span>
       </button>`).join("");
    state.locked = false;
  }

  function pick(k) {
    if (state.locked) return;
    state.locked = true;
    state.answers[state.i] = k;
    document.querySelectorAll(".answer").forEach(b => b.classList.toggle("picked", Number(b.dataset.k) === k));
    setTimeout(() => {
      if (state.i < QUESTIONS.length - 1) { state.i += 1; renderQuestion(); }
      else finish();
    }, 260);
  }

  function finish() {
    state.viewAge = state.age;
    state.listLimit = PAGE;
    const scores = topicScores();
    const ranked = rankTopics(scores);
    const top = ranked.slice(0, 3).map(r => r.t);
    const best = rankedJobs(scores, state.age).slice(0, 3).map(j => j.name);
    const history = store.get("futureMap.history", []);
    history.push({ date: new Date().toISOString().slice(0, 10), age: state.age, top, jobs: best });
    store.set("futureMap.history", history.slice(-12));
    renderResults();
    show("results");
  }

  // ---------- Results ----------
  function rankedJobs(scores, age) {
    return jobs.map(j => ({ ...j, pct: matchJob(j, scores, age) }))
               .sort((a, b) => b.pct - a.pct || a.train - b.train || a.name.localeCompare(b.name));
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

  function renderResults() {
    const age = state.viewAge;
    const scores = topicScores();
    const ranked = rankTopics(scores);
    const levelOf = Object.fromEntries(ranked.map(r => [r.t, r.level]));

    $("resAge").value = age;
    $("resAgeOut").textContent = age;
    const st = ageStage(age);
    $("changeLabel").textContent = st.label;
    $("changeFill").style.width = st.pct + "%";
    $("changeText").textContent = st.text;
    $("futureText").textContent = futureNote(age);
    $("resTitle").textContent = `Your Future Map at age ${age}`;

    // Topics with importance levels
    $("topicRank").innerHTML = ranked.map(r => `
      <li class="topic-row${r.level === "top" ? " top" : ""}" style="--tc: var(--t-${r.t})">
        <span class="rank">${r.rank}</span>
        <span class="name">${TOPICS[r.t].icon} ${esc(TOPICS[r.t].name)} <span class="pts">${r.s} / ${MAX_PER_TOPIC} points</span></span>
        <span class="lvl ${LEVELS[r.level].cls}">${LEVELS[r.level].label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(r.s / MAX_PER_TOPIC) * 100}%"></div></div>
      </li>`).join("");

    // Top jobs. Younger kids see a couple more ideas since things will change.
    const all = rankedJobs(scores, age);
    const count = age <= 10 ? 10 : 8;
    $("topJobs").innerHTML = all.slice(0, count).map((j, idx) => jobCard(j, idx, age, levelOf)).join("");

    // Tips for top 3 topics, tuned to age
    const band = ageBand(age);
    const bandName = ["ages 5–8", "ages 9–12", "ages 13–18"][band];
    $("tips").innerHTML = ranked.slice(0, 3).map(r => `
      <div class="tip" style="--tc: var(--t-${r.t})">
        <strong>${TOPICS[r.t].icon} ${esc(TOPICS[r.t].name)}</strong>
        <span>${esc(TIPS[r.t][band])}</span>
        <span class="muted small">Idea for ${bandName}</span>
      </div>`).join("");

    renderHistory();
    fillTopicFilter();
    renderAllJobs();
  }

  function jobCard(j, idx, age, levelOf) {
    const w = whenText(j, age);
    const o = OUTLOOK[j.outlook];
    const note = outlookNote(j, age);
    const needs = j.topics.map(({ t, w: weight }) => {
      const strong = levelOf[t] === "top" || levelOf[t] === "high";
      return `<li><span class="imp">${IMPORTANCE[weight]}</span>
        <span${strong ? ' class="yes"' : ""}>${TOPICS[t].icon} ${esc(TOPICS[t].name)}${strong ? " ✓" : ""}</span></li>`;
    }).join("");
    return `
      <article class="job-card${idx === 0 ? " best" : ""}">
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
        <td>${(h.top || []).map(t => TOPICS[t] ? `${TOPICS[t].icon} ${esc(TOPICS[t].name)}` : "").join("<br>")}</td>
        <td>${(h.jobs || []).map(esc).join("<br>")}</td>
      </tr>`).join("");
  }

  function fillTopicFilter() {
    const sel = $("jobTopic");
    if (sel.options.length) return;
    sel.innerHTML = `<option value="">All topics</option>` +
      TOPIC_KEYS.map(t => `<option value="${t}">${TOPICS[t].icon} ${esc(TOPICS[t].name)}</option>`).join("") +
      `<option value="future">✨ Future jobs only</option>`;
  }

  function renderAllJobs() {
    const q = $("jobSearch").value.trim().toLowerCase();
    const topic = $("jobTopic").value;
    const age = state.viewAge;
    const list = rankedJobs(topicScores(), age).filter(j => {
      if (topic === "future" && j.outlook !== "f") return false;
      if (topic && topic !== "future" && !j.topics.some(x => x.t === topic)) return false;
      if (q && !(j.name + " " + j.desc).toLowerCase().includes(q)) return false;
      return true;
    });
    const shown = list.slice(0, state.listLimit);
    $("jobCount").textContent = `${list.length} of ${jobs.length} jobs match, best match first`;
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
    state.answers.fill(null);
    state.i = 0;
    renderQuestion();
    show("quiz");
  });
  $("answers").addEventListener("click", e => {
    const b = e.target.closest(".answer");
    if (b) pick(Number(b.dataset.k));
  });
  $("backBtn").addEventListener("click", () => {
    if (state.i > 0) { state.i -= 1; renderQuestion(); }
  });
  document.addEventListener("keydown", e => {
    if ($("quiz").hidden) return;
    const k = Number(e.key);
    if (k >= 1 && k <= 4) pick(k - 1);
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
})();
